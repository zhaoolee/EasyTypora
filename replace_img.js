const request = require("request");
const fs = require("fs-extra");
const path = require("path");

// 读取用户输入
async function readline_sync() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return new Promise((resolve, reject) => {
        readline.question(``, data => {
            readline.close();
            resolve(data)
        })
    });
}

async function get_github_username_repositories_name() {

    // 查看.git文件夹是否存在

    let exist = fs.existsSync(path.join(__dirname, ".git", "config"));

    // 如果.git存在则读取username和repositories_name

    let username = "";

    let repositories_name = "";

    let url = "";

    if (exist) {
        let config_content = String(fs.readFileSync(path.join(__dirname, ".git", "config")))

        let re_n_t = /\n|\t/;
        let config_content_list = config_content.split(re_n_t)

        for (let i = 0, config_content_list_length = config_content_list.length; i < config_content_list_length; i++) {

            if (config_content_list[i].indexOf("url") === 0) {

                url = config_content_list[i].split("url = ")[1];



                url = url.split(".git")[0]

                let url_info = url.split("/");
                // console.log(url_info);
                url_info.reverse();
                username = url_info[1];
                repositories_name = url_info[0];

            }
        }


    }







    // 如果.git不存在则要求输入username和repositories_name

    if (exist === false) {
        console.log("请输入github用户名：");
        username = await readline_sync();

        console.log("请输入仓库名：");
        repositories_name = await readline_sync();
    }

    console.log(username, repositories_name);

    return new Promise((resolve, reject) => {
        resolve({ username: username, repositories_name: repositories_name })
    })



}


function get_img_url_list_in_md(md_path) {
    const md_content = String(fs.readFileSync(md_path));

    re_md_img = /\!\[(.*)\]\((.*)\)/g

    let md_img_list = md_content.match(re_md_img);

    let img_url_list = [];

    for (let i = 0, md_img_list_length = md_img_list.length; i < md_img_list_length; i++) {

        img_url = md_img_list[i].match(/http(.*)(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)/)[0];

        img_url_list.push(img_url);
    }



    return img_url_list;


}

// 创建随机数函数
//  随机产生字符串
function randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz012345678",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

function download_img_to_readme_dir(img_url, pre_image_url){

    let new_img_url = "";

    return new Promise((resolve, reject)=>{

        try {
            let img_url_info = img_url.split(".")
            img_url_info.reverse();
            let ext = img_url_info[0];
            let new_img_name = Date.now() + randomString(8) + "." + ext;
            request.get(img_url).pipe(fs.createWriteStream(path.join(__dirname, "README", new_img_name))).on("close", function(err){
                new_img_url = pre_image_url + new_img_name;

                resolve(new_img_url);
            });
            

            
    
        }catch(e){

            console.log(e);
            
            new_img_url = img_url;

            resolve(new_img_url);
        }




    })





}

function replace_readme_info ( src_text, dest_text) {

    // 获取README.md原始信息


    let readme_content = String(fs.readFileSync(path.join(__dirname, "README.md")));

    let  new_readme_content = readme_content.replace(src_text, dest_text);

    fs.writeFileSync(path.join(__dirname, "README.md"), new_readme_content);


}



async function main() {

    // 获取仓库的用户名和仓库名

    let { username, repositories_name } = await get_github_username_repositories_name();
    // console.log(username_repositories_name);
    // username = username_repositories_name.username;
    // repositories_name = username_repositories_name.repositories_name;

    console.log(username, repositories_name);

    // 备份README.md为README_BEFORE.md

    fs.copyFileSync(path.join(__dirname, "README.md"), path.join(__dirname, "README_BEFORE.md"))

    // 拼接README图片前缀

    let pre_image_url = "https://raw.githubusercontent.com/" + username + "/" + repositories_name + "/master/README/"

    // 获取README.md里面的所有图片地址列表

    let img_url_list = get_img_url_list_in_md(path.join(__dirname, "README.md"));

    // 如果README文件夹不存在，则创建README文件夹
    if ((fs.existsSync(path.join(__dirname, "README"))) === false) {
        fs.mkdirSync(path.join(__dirname, "README"))
    }

    for (let i = 0, img_url_list_length = img_url_list.length; i < img_url_list_length; i++) {

        // 如果图片以pre_image_url开头，则跳过
        if (img_url_list[i].indexOf(pre_image_url) === -1) {


            // 将图片下载到README文件夹，并生成图片github地址
            let new_img_url = await download_img_to_readme_dir(img_url_list[i], pre_image_url);
            // 替换README.md内图片地址为github地址
            replace_readme_info(img_url_list[i], new_img_url);

            console.log("将==》",img_url_list[i] ,"替换为==》",new_img_url);


        }



    }





}



main();