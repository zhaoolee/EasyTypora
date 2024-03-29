# EasyTypora

EasyTypora是一个为Typora添加私用化图床的实用小工具，要使用本项目，你需要有自己的一台云服务器～

本项目永久地址：
[https://github.com/zhaoolee/EasyTypora](https://github.com/zhaoolee/EasyTypora)

## 通过这个项目你能得到什么？

- 在2021年，配合Typora使用，即使不买图床，也能获得极致的Markdown写作体验。
- 学会手动安装Node.js的任意版本。
- 体验Node.js神库pkg的跨平台编译,你将获得Windows， macOS, Linux三个平台的可执行文件，配合各个平台的Typora一起使用

## Typora开始收费了,最终的免费版各平台安装包下载(免费版够用了)

Windows 32位安装包 https://github.com/zhaoolee/EasyTypora/raw/main/Typora%E6%9C%80%E7%BB%88%E7%9A%84%E5%85%8D%E8%B4%B9%E7%89%88%E5%90%84%E5%B9%B3%E5%8F%B0%E5%AE%89%E8%A3%85%E5%8C%85%E6%94%B6%E8%97%8F/typora-update-ia32-1117.exe

Windows 64位安装包 https://github.com/zhaoolee/EasyTypora/raw/main/Typora%E6%9C%80%E7%BB%88%E7%9A%84%E5%85%8D%E8%B4%B9%E7%89%88%E5%90%84%E5%B9%B3%E5%8F%B0%E5%AE%89%E8%A3%85%E5%8C%85%E6%94%B6%E8%97%8F/typora-update-x64-1117.exe

macOS安装包 https://github.com/zhaoolee/EasyTypora/raw/main/Typora%E6%9C%80%E7%BB%88%E7%9A%84%E5%85%8D%E8%B4%B9%E7%89%88%E5%90%84%E5%B9%B3%E5%8F%B0%E5%AE%89%E8%A3%85%E5%8C%85%E6%94%B6%E8%97%8F/Typora-0.11.18.dmg

Linux安装包 https://github.com/zhaoolee/EasyTypora/raw/main/Typora%E6%9C%80%E7%BB%88%E7%9A%84%E5%85%8D%E8%B4%B9%E7%89%88%E5%90%84%E5%B9%B3%E5%8F%B0%E5%AE%89%E8%A3%85%E5%8C%85%E6%94%B6%E8%97%8F/typora_0.11.18_amd64.deb

## 最终效果


![](https://raw.githubusercontent.com/zhaoolee/EasyTypora/master/README/1610212776529GNazs3pP.gif)



## 项目特色

- 跨平台！无论你使用macOS, Windows， Linux， 都可以使用本工具
- 开箱即用，部署简单, 本项目不需要复杂的配置项，你可以直接将本项目直接git clone到服务器，npm run build 获取客户端， npm start 开启服务端，然后就可以愉快使用了
- 图床私用化，无需担心被别人白嫖流量，如果你想分享给同伴，可以直接送一个可执行文件的客户端。
- 如果客户端泄露，被人滥用，可以在服务端全自动生成新的可执行文件，旧版本的可执行文件直接作废！
- 可以和Nginx配合使用，不小心Kill掉了图床程序，已上传图片访问不受影响。
- 支持PicGo插件上传图片，开源地址 https://github.com/zhaoolee/pi-picgo/


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


如果你想省略传secret_token字段，那把conf.js里面的secret_token字段， 改成 `secret_token: ""`，就好了!


## 如何部署使用？

本程序分两个部分，客户端和服务端，我们先下载程序到服务器，然后在服务器完成服务端配置，然后编译生成带鉴权秘钥的个性化客户端，使用scp将客户端下载到本地后，无需任何配置，插入Typora即可使用！


#### 安装node.js 环境


```
cd /opt/
wget https://nodejs.org/dist/v14.0.0/node-v14.0.0-linux-x64.tar.xz
tar xvf node-v14.0.0-linux-x64.tar.xz

```

- 将Node.js添加到系统变量 

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

- 服务端的80端口可能已经被nginx占据，如果我们依然想用80端口作为图床对外的服务端口，我们可以配置一层Nginx转发, 比如把server_port 设置为 12800 ,把client_port设置为80, 然后Nginx加上将12800端口的服务转发到80端口即可！

```
server {
    server_name      cdn.fangyuanxiaozhan.com
    listen           80;

    location / {
        proxy_pass http://127.0.0.1:12800;
        proxy_set_header Host $host:80;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

```


#### 启动服务
```
npm start
```

服务启动后，访问对应的域名和端口可以看到提示信息

![](https://raw.githubusercontent.com/zhaoolee/EasyTypora/master/README/161021280880543zwKGJT.png)

添加/info路径，可以除secret_token以外的配置信息

![](https://raw.githubusercontent.com/zhaoolee/EasyTypora/master/README/1610212811697Nnr0a8Wh.png)



#### 关闭服务

```
npm run stop
```

#### 构建客户端二进制包


```
// 同时构建 Linux macOS Windows的二进制包
npm run build
```


构建完成后，项目的根目录的dist文件夹会出现, 三个构建好的文件

| 文件名 | 适用平台 |
| ---   | --- |
|   typora-win.exe |  Windows   |
|  typora-mac.app    |   macOS   |
|   typora-linux.sh    |  linux     |

![](https://raw.githubusercontent.com/zhaoolee/EasyTypora/master/README/1610212815891fPTxkEFj.png)



#### 我们可以通过scp文件传输服务,把生成的文件保存到本地,然后在本地验证服务

![](https://raw.githubusercontent.com/zhaoolee/EasyTypora/master/README/1610212828448a0niFYNs.gif)






#### 如何给图片加https?

我通过Nginx加了https， 唯一需要注意的点是，在conf.js中，如果host配置了https, 那客户端的端口client_port需要设置为443

我在前面http的基础上，给nginx配置做一个http的扩充，以下为参考配置（在`/etc/nginx/conf.d`中新建一个`.conf`后缀的文件即可）


```nginx
server {
    server_name      cdn.fangyuanxiaozhan.com
    listen           80;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host:80;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}


server {
  listen 443 ssl;   #SSL协议访问端口号为443。此处如未添加ssl，可能会造成Nginx无法启动。
  server_name cdn.fangyuanxiaozhan.com;  #将localhost修改为您证书绑定的域名，例如：www.example.com。
  charset  utf-8;
  root /usr/share/nginx/fangyuanxiaozhan.com;
  index index.php index.html index.htm;
  ssl_certificate /etc/nginx/cert/cdn.fangyuanxiaozhan.com/cdn.fangyuanxiaozhan.com.pem;   #将domain name.pem替换成您证书的文件名。
  ssl_certificate_key /etc/nginx/cert/cdn.fangyuanxiaozhan.com/cdn.fangyuanxiaozhan.com.key;   #将domain name.key替换成您证书的密钥文件名。
  ssl_session_timeout 5m;
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;  #使用此加密套件。
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;   #使用该协议进行配置。
  ssl_prefer_server_ciphers on;   
  gzip on;
  gzip_min_length 1k;
  gzip_buffers 4 16k;
  #gzip_http_version 1.0;
  gzip_comp_level 8;
  gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
  gzip_vary off;
  gzip_disable "MSIE [1-6]\."; 

  # 如果程序崩溃，只是上传服务受影响，nginx会从静态目录取图片文件
  location /assets/ {
      alias  /opt/EasyTypora/server/assets/;
  }

  location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host:443;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }


} 

```


## 加Https后，在Linux发行版Deepin中，使用Typory上传图片到私有图床


![](https://raw.githubusercontent.com/zhaoolee/EasyTypora/master/README/1610212843827dwDX07bF.gif)



## 未来的工作



- 做一个带鉴权的网页，可以批量传图


- 多写文章，测试这个工具的稳定性（工具用了不到2天写完，多多少少会有bug），修复BUG


- 以本项目为基础，搞一套WordPress发布程序，这套程序像Hexo一样好用，却又能充分利用WordPress生态的优势


## 相关资源


Typora的Mac,Windows, Linux安装包备份：[https://zhaooolee.cowtransfer.com/s/1fb5b95cf46a4f](https://zhaooolee.cowtransfer.com/s/1fb5b95cf46a4f)


pkg跨平台打包依赖文件备份（希望你的网络环境很好，用不到这玩意儿）： [https://zhaooolee.cowtransfer.com/s/05e7feb42c814d](https://zhaooolee.cowtransfer.com/s/05e7feb42c814d)





## 最后放几张私有图床的图片


![13cf7ac5a8cbafdbc4e70c69d3a42dee](https://raw.githubusercontent.com/zhaoolee/EasyTypora/master/README/1610212863145853JKeJ7.jpeg)

![AttackingGiant](https://raw.githubusercontent.com/zhaoolee/EasyTypora/master/README/1610212868489hE5KJpyP.jpeg)

![GirlInTheRain](https://raw.githubusercontent.com/zhaoolee/EasyTypora/master/README/1610212871543x2YaaaNy.jpeg)

![StarrySkyCastle](https://raw.githubusercontent.com/zhaoolee/EasyTypora/master/README/1610212875153hJpyk0EP.jpeg)

![SuperHero](https://raw.githubusercontent.com/zhaoolee/EasyTypora/master/README/1610212880310wQeBP1aM.jpeg)
