const express = require("express");
const multer = require("multer");
const expressStatic = require("express-static");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment");
const crypto = require("crypto");
const conf_info = require("../conf");
const request = require('request');
const bodyParser = require("body-parser")

let server = express();

server.use(bodyParser.json())
let upload = multer({ dest: __dirname + '/assets/' });
const HASH_PREFIX_LEN = 64;


// 获取配置信息
const host = (conf_info)["host"];
const client_port = (conf_info)["client_port"];
const server_port = (conf_info)["server_port"];
const secret_token = (conf_info)["secret_token"];
const url = `${host}:${client_port}/upload_file`;

console.log(`host:${host}`);
console.log(`client_port:${client_port}`);
console.log(`server_port:${server_port}`);
console.log(`url:${url}`);



//  随机产生字符串
function randomString(e) {
  e = e || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz012345678",
    a = t.length,
    n = "";
  for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
}

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}


async function download_http_img(img_url) {
  let new_img_url = new URL(img_url).origin + new URL(img_url).pathname;
  const img_name = String(Date.now()) + randomString(8) + "." + new_img_url.split(".").pop();

  const local_img_path_name = path.join(__dirname, "assets", img_name)

  return new Promise((resolve, reject) => {

    let ws = fs.createWriteStream(local_img_path_name)

    request(new_img_url).pipe(ws);

    ws.on("close", () => {
      let http_image_url = `${host}:${client_port}/assets/${img_name}`;
      if ((client_port == "80") || (client_port == "443")) {
        http_image_url = `${host}/assets/${img_name}`;
      }


      console.log(`--${moment().format("YYYY-MM-DD HH:mm:ss")}-http_image_url-->>${http_image_url}`)

      resolve(http_image_url);
    })
  })
}

// 处理http图片

server.post('/download_http_file', async function (req, res) {

  console.log("=req_body=>>", req["body"]);

  let new_img_url = "https://www.v2fy.com/wp-content/uploads/2020/12/v2fy-logo-1.png";


  let img_url = req["body"]["img_url"];

  new_img_url =  await download_http_img(img_url);

  let result = {


  }

  if ((secret_token.length === 0) || (req["body"]["secret_token"] === secret_token)) {
    result = {
      status: 1000,
      message: "下载图片",
      data: {
        "new_img_url": new_img_url
      }
    }

  } else {
    result = {

      status: 2100,
      message: "鉴权失败！请重新运行npm run build构建新的私有客户端",
      data: {
        "new_img_url": ""
      }
    }



  }






  res.send(JSON.stringify(result));









})

// 处理提交文件的post请求
server.post('/upload_file', upload.single('file'), async function (req, res) {

  console.log("file信息", req.file);

  let extension = req.file.mimetype.split("/").pop();
  if (extension === "octet-stream") {
      extension = "png";
  }
  let new_image_name = "";

  // let new_image_name = String(Date.now()) + randomString(8) + "." + req.file.mimetype.split("/").pop();
  console.log("===req>>>::", req);
  // 如配置文件conf.js中secret_token为空字符串，或客户端携带正确的secret_token, 则进行存储； 如果无法通过校验，则返回鉴权失败
  if ((secret_token.length === 0) || (req["body"]["secret_token"] === secret_token)) {
    try {
      const file_hash = await hashFile(req.file.path);
      const short_hash = file_hash.slice(0, HASH_PREFIX_LEN);
      new_image_name = `${short_hash}.${extension}`;
      const target_path = path.join(req.file.destination, new_image_name);

      if (await fs.pathExists(target_path)) {
        await fs.remove(req.file.path);
        console.log("文件已存在，删除临时文件");
      } else {
        await fs.move(req.file.path, target_path);
        console.log("文件移动到目标路径");
      }

      let image_url = `${host}:${client_port}/assets/${new_image_name}`;
      if ((client_port == "80") || (client_port == "443")) {
        image_url = `${host}/assets/${new_image_name}`;
      }
      

      console.log(`--${moment().format("YYYY-MM-DD HH:mm:ss")}-image_url-->>${image_url}`)
      res.send(image_url)
    } catch (err) {
      console.error("处理上传文件失败:", err);
      res.status(500).send("处理上传文件失败");
    }

  } else {

    res.send("鉴权失败！请重新运行npm run build构建新的私有客户端")

  }



})

server.get("/info", function (req, res) {

  res.send({
    host: host,
    client_port: client_port,
    server_port: server_port,
    url: url
  })
})


server.get("/", function (req, res) {

  res.send("这是一个适用于Typora的私有化图床！")
})

// 处理静态目录
server.use(expressStatic(__dirname));



// 监听服务
server.listen(server_port, function () {
  console.log(`图床上传接口 ${url}`)
});
