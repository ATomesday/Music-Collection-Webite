const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const GenId = require("../utils/SnowFlake");

var MusicDb = new sqlite3.Database(path.join(__dirname,"music.sqlite3"));
var BasicDb = new sqlite3.Database(path.join(__dirname,"basic.sqlite3"));
const genid = new GenId({WorkerId:1});

MusicDb.async = {}

MusicDb.async.all = (sql,params) =>{

    return new Promise((resolve,reject) =>{
        MusicDb.all(sql,params,(err,rows) =>{
            resolve({err,rows})
        })
    })
}

MusicDb.async.run = (sql,params) =>{

    return new Promise((resolve,reject) =>{
        MusicDb.run(sql,params,(err,rows) =>{
            resolve({err,rows})
        })
    })
}

BasicDb.async = {}

BasicDb.async.all = (sql,params) =>{

    return new Promise((resolve,reject) =>{
        BasicDb.all(sql,params,(err,rows) =>{
            resolve({err,rows})
        })
    })
}

BasicDb.async.run = (sql,params) =>{

    return new Promise((resolve,reject) =>{
        BasicDb.run(sql,params,(err,rows) =>{
            resolve({err,rows})
        })
    })
}


module.exports = {BasicDb,MusicDb,genid};