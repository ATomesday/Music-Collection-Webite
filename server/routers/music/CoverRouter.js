const express = require("express")
const router = express.Router()
const {MusicDb,genid} = require("../../db/Dbutils")    
const fs = require("fs")

//Update Cover
router.put("/_token/update",async (req,res) =>{
    let { id,name,singer,cover } = req.body;

    const update_sql = "UPDATE `music` SET `cover` = ? WHERE `id` = ?"

    let params = []
    
    if(req.files[0] != null)
    {
        let upload_cover = req.files[0];
        //封面文件位置记录
        let file_ext = upload_cover.originalname.substring(upload_cover.originalname.lastIndexOf(".")+1)
        let file_name = name + "." + file_ext
        if(!fs.existsSync("./public/music/" + singer)) fs.mkdirSync("./public/music/" + singer)

        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + upload_cover.filename,
            process.cwd() + "/public/music/" + singer + "/" + file_name
        )
        params.push("/music/" + singer + "/" + file_name)
    }
    else params.push(cover)

    params.push(id)

    let {err,rows} = await MusicDb.async.run(update_sql,params)
    
    if(err == null){
        res.send({
            code:200,
            msg:"修改成功"
        })
   
    }
    else {
        res.send({
            code:500,
            msg:"修改失败"
        }
        )
    }
})

module.exports = router