const express = require("express")
const router = express.Router()
const {BasicDb,genid} = require("../db/Dbutils")

router.get("/test",async (req,res) =>{
    BasicDb.all("select * from `admin`",[],(err,rows) =>{
        console.log(rows)
    })

    BasicDb.async.all("select * from `admin`",[]).then((res) => {
        console.log(res)
    })

    let out = await BasicDb.async.all("select * from `admin`",[]);

    res.send({
        id:genid.NextId(),
        out
    })
})

module.exports = router