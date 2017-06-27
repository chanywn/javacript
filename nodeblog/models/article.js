var db = require("./mysql.js");
var table = "article";

module.exports = {
    getAll:function(callback){
        sql = 'select * from '+table;
        db.select(sql,callback);
    },
    getOne:function (callback,id) {
        sql = 'select * from '+table+' where id= '+id;
        db.select(sql,callback);
    }
}