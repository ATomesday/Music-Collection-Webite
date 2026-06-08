const express = require("express")
const router = express.Router()
const fs = require("fs")
const {genid} = require("../db/Dbutils")

router.post("/rich_editor_upload",async (req,res) =>{

    if (!req.files) {
        res.send({
            "errno":1,
            "message":"文件为空"
        })
        return ;
    }

    let files = req.files ;
    let ret_files = [] ;

    for (let file of files){
        //获取文件名字后缀
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".")+1)
        //随机文件名字
        let file_name = genid.NextId() + "." + file_ext

        //修改名字+移动文件
        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + file.filename,
            process.cwd() + "/public/upload/photo" + file_name
        )

        ret_files.push("/upload/photo" + file_name)
    }

    res.send({
        "errno":0,
        "data":{
            "url":ret_files[0]
        }
    })
})

module.exports = router