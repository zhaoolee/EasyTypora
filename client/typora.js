const process = require('process');

var request = require('request');
const fs = require("fs-extra");
const { argv } = require('process');


// 请求的接口

const upload_api = "http://localhost:8080/upload_file"

async function upload_img(local_image_path) {

    const FormData = {
        file: fs.createReadStream(local_image_path)
    };

    // console.log("FormData==>", FormData);

    return new Promise(async (resolve, reject)=>{
        await request.post({url: upload_api,formData: FormData}, function optionalCallback(err, httpResponse, body) {

            // console.log("===body=>>", body)
            resolve(body);
        })
        
    })


}


async function main(){
    // 获取参数列表
    const args = process.argv.slice(2);

    let result = "Upload Success:";

    for(let i =0, args_length = args.length; i<args_length; i++){
        image_url = await upload_img(args[i])
        result = result + "\n"+image_url;
    }
    console.log(result);

    return result;

}





main();