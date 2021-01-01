const express = require("express");
const multer = require("multer");
const expressStatic = require("express-static");
const fs = require("fs-extra");

let server = express();
let upload = multer({ dest: __dirname +'/uploads/' });
let path = require("path");

// hosts
let server_hosts = "http://localhost:8080"

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

  let new_image_name = String(Date.now())+randomString(8)+"."+req.file.mimetype.split("/").pop();
  

  fs.moveSync(req.file.path, path.join(req.file.destination, new_image_name));

  console.log("--image-new-url-->>", server_hosts+"/"+new_image_name)

  res.send(server_hosts+"/"+new_image_name)

})

// 处理静态目录
server.use(expressStatic(path.join(__dirname, "uploads")));


// 监听服务
server.listen(8080, function(){
  console.log("请使用浏览器访问 "+server_hosts)
});