const express = require("express")
const router = express.Router()
const {MusicDb,genid} = require("../../db/Dbutils")
const fs = require("fs")

// 列表接口
router.get("/list",async (req,res) =>{
    const search_sql = "SELECT * FROM `music_list`";
    let {err,rows} = await MusicDb.async.all(search_sql,[]);

    if(err == null){
        res.send({
            code:200,
            msg:"查询成功",
            rows
        })
    }
    else {
        res.send({
            code:500,
            msg:"查询失败"
        }
        )
    }
})

// 添加接口
router.post("/_token/add",async (req,res) =>{
    let {name,intro,music_set} = req.body;
    intro = intro == null ? "" : intro;
    const insert_sql = "INSERT INTO `music_list` ('id','name','intro','music_set','create_time','cover') VALUES (?,?,?,?,?,?)";
    let create_time = new Date().getTime();

    let params = [genid.NextId(),name,intro,music_set,create_time]
    
    if(req.files[0] != null)
    {
        let upload_cover = req.files[0];
        //封面文件位置记录
        let file_ext = upload_cover.originalname.substring(upload_cover.originalname.lastIndexOf(".")+1)
        let file_name = name + "." + file_ext

        params.push("/music_list/" + file_name)

        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + upload_cover.filename,
            process.cwd() + "/public/music_list/" + file_name
        )
    }
    else params.push(null)

    let {err,rows} = await MusicDb.async.run(insert_sql,params)

    if(err == null){
        res.send({
            code:200,
            msg:"添加成功"
        })
    }
    else {
        res.send({
            code:500,
            msg:"添加失败"
        }
        )
    }
})

// 修改接口
router.put("/_token/update",async (req,res) =>{

    let {id,name,music_set,intro,cover} = req.body;
    const update_sql = "UPDATE `music_list` SET `name` = ?,`music_set` = ?,`intro` = ?,`cover` = ? WHERE `id` = ?";

    let params = [name,music_set,intro]
    
    if(req.files[0] != null)
    {
        let upload_cover = req.files[0];
        //封面文件位置记录
        let file_ext = upload_cover.originalname.substring(upload_cover.originalname.lastIndexOf(".")+1)
        let file_name = name + "." + file_ext

        params.push("/music_list/" + file_name)

        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + upload_cover.filename,
            process.cwd() + "/public/music_list/" + file_name
        )
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

// 删除歌单接口  /music_list/delete?id=XXX
router.delete("/_token/delete",async (req,res) =>{
    let id = req.query.id;
    const delete_sql = "DELETE FROM `music_list` WHERE `id` = ?";
    let {err,rows} = await MusicDb.async.run(delete_sql,[id])
    let file_err = null

    if(req.body.cover_url != null ) fs.unlink("./public" + req.body.cover_url,(err) =>{ file_err = err })

    if(err == null){
        res.send({
            code:200,
            msg:"删除成功"
        })
    }
    else {
        res.send({
            code:500,
            msg:"删除失败"
        }
        )
    }
})


module.exports = router