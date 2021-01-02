const express = require("express");
const multer = require("multer");
const expressStatic = require("express-static");
const fs = require("fs-extra");
const matter = require('gray-matter');
const path = require("path");
const moment = require("moment");
const conf_info = require("../conf");

let server = express();
let upload = multer({ dest: __dirname + '/assets/' });


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

// 处理提交文件的post请求
server.post('/upload_file', upload.single('file'), function (req, res) {

  console.log("file信息", req.file);
  let new_image_name = String(Date.now()) + randomString(8) + "." + req.file.mimetype.split("/").pop();
  console.log("===req>>>::", req);
  // 如配置文件conf.js中secret_token为空字符串，或客户端携带正确的secret_token, 则进行存储； 如果无法通过校验，则返回鉴权失败
  if((secret_token.length === 0) || (req["body"]["secret_token"] === secret_token)){

    fs.moveSync(req.file.path, path.join(req.file.destination, new_image_name));
    let image_url = `${host}:${client_port}/assets/${new_image_name}`;
    if((client_port == "80")||(client_port == "443")){
      image_url = `${host}/assets/${new_image_name}`;
    }

  
    console.log(`--${moment().format("YYYY-MM-DD HH:mm:ss")}-image_url-->>${image_url}`)
    res.send(image_url)

  }else{

    res.send("鉴权失败！请重新运行npm run build构建新的私有客户端")

  }



})

server.get("/info", function(req, res){
  
  res.send({
    host: host,
    client_port: client_port,
    server_port: server_port,
    url: url
  })
})


server.get("/", function(req, res){
  
  res.send("这是一个适用于Typora的私有化图床！")
})

// 处理静态目录
server.use(expressStatic(__dirname));



// 监听服务
server.listen(server_port, function () {
  console.log(`图床上传接口 ${url}`)
});