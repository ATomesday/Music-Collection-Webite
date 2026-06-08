const express = require("express")
const router = express.Router()
const {MusicDb,genid} = require("../../db/Dbutils")    
const fs = require("fs")
const jsmediatags = require("jsmediatags");

//添加音乐  
router.post("/_token/add",async (req,res) =>{
    let { name,category_id,singer_id,introduction } = req.body;
    let id =genid.NextId();
    let create_time = new Date().getTime();

    let singer_res = await MusicDb.async.all("SELECT * FROM `singer` WHERE `id` = ?",[singer_id])
    singer = singer_res.rows[0].name
    
    const insert_sql = "INSERT INTO `music` (`id`,`name`,`category_id`,`singer_id`,`introduction`,`singer`,`create_time`,'music_FV',`cover`,'lrc') VALUES (?,?,?,?,?,?,?,?,?,?)"
    let params = [id,name,category_id,singer_id,introduction,singer,create_time]
    let lrc = null
    let cover = null

    if(req.files[0] != null)
    {
        let music_FV = req.files[0];
        //音源文件位置记录
        let file_ext = music_FV.originalname.substring(music_FV.originalname.lastIndexOf(".")+1)
        let file_name = name + "." + file_ext
        let singer = await MusicDb.async.all("SELECT * FROM `singer` WHERE `id` = ?",[singer_id])
        if(!fs.existsSync("./public/music/" + singer.rows[0].name)) fs.mkdirSync("./public/music/" + singer.rows[0].name)

            fs.renameSync(
                process.cwd() + "/public/upload/temp/" + music_FV.filename,
                process.cwd() + "/public/music/" + singer.rows[0].name + "/" + file_name
            )

        params.push("/music/" + singer.rows[0].name + "/" + file_name)
        params.push("/music/" + singer.rows[0].name + "/" + name + '.png')
        params.push("/music/" + singer.rows[0].name + "/" + name + '.lrc')
            
        new jsmediatags.Reader("./public/music/" + singer.rows[0].name + "/" + file_name)
        .setTagsToRead(["picture", "lyrics"]) 
        .read({
            onSuccess: function(tag) {
                if(tag.tags.picture.data){
                    const buffer = Buffer.from(tag.tags.picture.data);
                    fs.writeFile("./public/music/" + singer.rows[0].name + "/" + name + '.png', buffer, err => {});
                }
                if(tag.tags.lyrics.lyrics){
                    fs.writeFile("./public/music/" + singer.rows[0].name + "/" + name + '.lrc', tag.tags.lyrics.lyrics, err => {});
                }
            },
        });

    }
    else params.push([null,null,null])

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

//修改音乐
router.put("/_token/update",async (req,res) =>{
    let { id,name,category_id,singer_id,introduction,singer,lrc } = req.body;

    const update_sql = "UPDATE `music` SET `name` = ?,`category_id` = ?,`singer_id` = ?,`singer` = ?,`introduction` = ?,`lrc` = ? WHERE `id` = ?"
    
    let singer_res = await MusicDb.async.all("SELECT * FROM `singer` WHERE `id` = ?",[singer_id])
    singer = singer_res.rows[0].name
    
    let params = [name,category_id,singer_id,singer,introduction]
    
    if(req.files[0] != null)
    {
        let lrc = req.files[0];
        //歌词文件位置记录
        let file_ext = lrc.originalname.substring(lrc.originalname.lastIndexOf(".")+1)
        let file_name = name + "." + file_ext
        if(!fs.existsSync("./public/music/" + singer)) fs.mkdirSync("./public/music/" + singer)

        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + lrc.filename,
            process.cwd() + "/public/music/" + singer + "/" + file_name
        )
        params.push("/music/" + singer + "/" + file_name)
    }
    else params.push(lrc)

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

//删除音乐  /music/delete?id=XXX
router.delete("/_token/delete",async (req,res) =>{
    let id = req.query.id;
    const delete_sql = "DELETE FROM `music` WHERE `id` = ?";    
    let file_err = null

    if(req.body.url != null ) fs.unlink("./public" + req.body.url,(err) =>{ file_err = err })
    if(req.body.cover_url != null ) fs.unlink("./public" + req.body.cover_url,(err) =>{ file_err = err })
    if(req.body.lrc_url != null ) fs.unlink("./public" + req.body.lrc_url,(err) =>{ file_err = err })

    let {err,rows} = await MusicDb.async.run(delete_sql,[id])

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


//查询音乐  
router.get("/search",async (req,res) =>{
    let { keyword,category_id,page,pagesize } = req.query

    page = page == null ? 1 : page;
    pagesize = pagesize == null ? 10 : pagesize;
    category_id = category_id == null ? 0 : category_id;
    keyword = keyword == null ? "" : keyword;

    let params = []
    let whereSqls = []

    if (category_id != 0){
        whereSqls.push(" `category_id` = ? ")
        params.push(category_id);
    }

    if (keyword != ""){
        whereSqls.push(" ((`name` LIKE ? OR `introduction` LIKE ?) OR `singer` LIKE ?) ")
        params.push("%" + keyword + "%")
        params.push("%" + keyword + "%")
        params.push("%" + keyword + "%")
    }

    let whereSqlsStr = ""
    if (whereSqls.length > 0){
        whereSqlsStr = " WHERE " + whereSqls.join(" AND ")
    }

    //page function
    let search_sql = " SELECT * FROM `music` " + whereSqlsStr + " ORDER BY `create_time` DESC LIMIT ?,?"
    let search_sql_params = params.concat([(page-1)*pagesize,pagesize])

    //the amount of page
    let search_count_sql = " SELECT count(*) FROM `music` " + whereSqlsStr
    let search_count_sql_params = params

    //page data
    let searchResult = await MusicDb.async.all(search_sql,search_sql_params)
    let countResult = await MusicDb.async.all(search_count_sql,search_count_sql_params)
  
    if (searchResult.err == null && countResult.err == null ){
        res.send({
            code:200,
            msg:"查询成功",
            data: {
                keyword,
                category_id,
                page,
                pagesize,
                rows:searchResult.rows,
                count:countResult.rows[0]["count(*)"]
            }
        })
    }
    else {
        res.send({
            code:500,
            msg:"查询失败"
        })
    }
})

//统计音乐
router.post("/statics",async (req,res) =>{
    let { category_id,singer_id} = req.body

    if(category_id != null)
    {
        let statics_sql = "SELECT count(*) FROM `music` WHERE `category_id` = ?"
        let statics_result = await MusicDb.async.all(statics_sql,[category_id])
        if(statics_result.err == null){
            res.send({
                code:200,
                msg:"查询成功",
                count:statics_result.rows[0]["count(*)"]
            })
        }
        else {
            res.send({
                code:500,
                msg:"查询失败"
            })
        }
    }

    if(singer_id != null)
        {
            let statics_sql = "SELECT count(*) FROM `music` WHERE `singer_id` = ?"
            let statics_result = await MusicDb.async.all(statics_sql,[singer_id])
            if(statics_result.err == null){
                res.send({
                    code:200,
                    msg:"查询成功",
                    count:statics_result.rows[0]["count(*)"]
                })
            }
            else {
                res.send({
                    code:500,
                    msg:"查询失败"
                })
            }
        }
})


module.exports = router