const express = require("express")
const router = express.Router()
const {BasicDb,genid} = require("../db/Dbutils")

// 查询接口
router.post("/search",async (req,res) =>{
    let {id} = req.body;
    const insert_sql = "SELECT * FROM `notication` WHERE `id` = ?";
    let {err,rows} = await BasicDb.async.all(insert_sql,[id])

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
    let {name} = req.body;
    const insert_sql = "INSERT INTO `notication` ('id','name') VALUES (?,?)";
    let {err,rows} = await BasicDb.async.run(insert_sql,[genid.NextId(),name])

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

    let {id,content,name} = req.body;
    const update_sql = "UPDATE `notication` SET `name` = ?,`content` = ? WHERE `id` = ?";
    let {err,rows} = await BasicDb.async.run(update_sql,[name,content,id])

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

// 删除接口 
router.delete("/_token/delete",async (req,res) =>{
    let id = req.query.id;
    const delete_sql = "DELETE FROM `notication` WHERE `id` = ?";
    let {err,rows} = await BasicDb.async.run(delete_sql,[id])

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