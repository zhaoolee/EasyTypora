const process = require('process');

var request = require('request');
const fs = require("fs-extra");

const conf_info = require("../conf");


async function upload_file(local_image_path) {

    // 获取配置信息
    const host = conf_info["host"];
    const client_port = conf_info["client_port"];
    const secret_token = conf_info["secret_token"];
    const url = `${host}:${client_port}/upload_file`;
    const formData = {
        file: fs.createReadStream(local_image_path),
        secret_token: secret_token
        
    };

    return new Promise(async (resolve, reject)=>{
        await request.post({url: url, formData: formData}, function optionalCallback(err, httpResponse, body) {

            if(err){
                // 如果请求出错，则返回一张猫爪图
                console.log("\nerr==>>", err, "\nhttpResponse==>>", httpResponse, "\nbody==>>",body, "\nurl===>>", url);
                resolve("https://www.v2fy.com/wp-content/uploads/2020/05/keycat1000.jpg")
            }else{
                // 如果请求正常，则返回图片地址
                resolve(body);
            }

            
        })
        
    })


}


async function main(){

    // 获取参数列表
    const args = process.argv.slice(2);

    let result = "Upload Success:";
    for(let i =0, args_length = args.length; i<args_length; i++){
        image_url = await upload_file(args[i])
        result = result + "\n"+image_url;
    }
    console.log(result);
    return result;

}





main();