# EasyTypora

EasyTypora是一个为Typora添加私用化图床的实用小工具，要使用本项目，你需要有自己的一台云服务器～

## 项目特色

- 跨平台！无论你使用macOS, Windows， Linux， 都可以使用本工具
- 开箱即用，部署简单, 本项目不需要复杂的配置项，你可以直接将本项目直接git clone到服务器，npm run build 获取客户端， npm start 开启服务端，然后就可以愉快使用了
- 图床私用化，无需担心被别人白嫖流量，如果你想分享给同伴，可以直接送一个可执行文件


## 如何实现图床私有化加密？（避免白嫖）

用户可进入根目录下的conf.js文件，为secret_conf字段加入随机字符串（随便填一些字符），进行加密。

为secret_conf添加的字符串，会自动构建到到客户端和服务端，完全不需要记


## 如何实现Typora跨平台私有化图床上传工具？


Typora自定义图床，需要一个可执行文件，而Windows与Linux的shell脚本不可能通用，于是zhaoolee使用Node.js完成了客户端的编写，并使用Node.js神器pkg完成了跨平台打包（macOS, Windows， Linux都支持）



## 图片如何存放？

用户上传的图片，存储在项目中 server/assets 目录里，如果要迁移到其它服务器，可以跟着项目一起打包运走。

为了避免文件名重复，程序会自动为图片文件重新命名。

为了方便日后确定图片上传时间，命名会自动添加时间戳。


## 这个图床服务可以单独拆出来，给其它网页用么？

当然可以！你只需满足file，secret_token这两个字段，就可以在网页使用，具体实现方式参考 client/typora.js ，开源代码绝不作假


如果你想省略传secret_token字段，那把conf.js里面的secret_token字段， 改成 `secret_token: ""`，就好了


## 如何使用


#### 安装node.js 环境


```
cd /opt/
wget https://nodejs.org/dist/v14.0.0/node-v14.0.0-linux-x64.tar.xz
tar xvf node-v14.0.0-linux-x64.tar.xz

```

- 将Node.js添加到系统变量 vim

```
echo "export NODE_HOME=/opt/node-v14.0.0-linux-x64" >> ~/.bashrc
echo "export PATH=\$NODE_HOME/bin:\$PATH" >> ~/.bashrc
source ~/.bashrc
```

#### 获取最新版本的小程序

```
cd  /opt/
git clone --depth 1 https://github.com/zhaoolee/EasyTypora.git
cd EasyTypora
# 安装依赖包
npm i 
```

#### 将conf.js里面的内容改为自己的服务器


```
module.exports = {
    // 填写域名或ip(带http或https协议，如 http://cdn.fangyuanxiaozhan.com)
    host: "http://cdn.fangyuanxiaozhan.com",
    // 填写服务端运行的端口号（填字符串）
    server_port: "12800",
    // 填写客户端请求的端口号（填字符串）
    client_port: "12800",
    // secret_token (客户端和服务端会同时添加secret_token鉴权，防止被他人滥用) 
    secret_token: "8asadelualdldfgaseasdfasdedadf"
}

```

#### 启动服务
```
npm start
```

#### 关闭服务

```
npm run stop
```

#### 构建客户端二进制包


```
// 同时构建 Linux macOS Windows的二进制包
npm run build
```


