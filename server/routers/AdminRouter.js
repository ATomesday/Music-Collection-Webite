const express = require("express")
const router = express.Router()
const {v4:uuidv4} = require("uuid")
const {BasicDb,genid} = require("../db/Dbutils")

router.post("/login", async (req,res)=>{

    let { account,password } = req.body ;
    let { err,rows } = await BasicDb.async.all("select * from `admin` where `account` = ? AND `password` = ?",[account,password])
    
    if(err == null && rows.length > 0){

        let login_token = uuidv4();
        let update_token_sql = "UPDATE `admin` SET `token` = ? where `id` = ?"

        await BasicDb.async.run(update_token_sql,[login_token,rows[0].id])

        let admit_info = rows[0]
        admit_info.token = login_token
        admit_info.password = ""

        res.send({
            code:200,
            msg:"登陆成功",
            data:admit_info
        })
    }
    else{
        res.send({
            code:500,
            msg:"登陆失败"
        })
    }

})

module.exports = router