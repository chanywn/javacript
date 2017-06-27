var mysql = require("mysql");
var conf = require('../config');

var db = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    database: conf.database
});

function openConnection() {
    db.open();
}

function claseConnection() {
    db.end();
}

module.exports = {
    insert: function (sql, model, callback) {
        db.query(sql, model, function (err, rows, fields) {
            if (!err) {
                callback && callback(rows.insertId);
            } else {
                callback && callback(false);
            }
        });
    },
    delete: function (sql, params, callback) {
        db.query(sql, params, function (err, rows, fields) {
            if (!err) {
                callback && callback(true);
            } else {
                callback && callback(false);
            }
        });
    },
    select: function (sql, callback) {
        db.query(sql, function (err, rows, fields) {
            if (!err) {
                callback && callback(true, rows);
            } else {
                callback && callback(false, null);
            }
        });
    },
    update: function (sql, params, callback) {
        db.query(sql, params, function (err, rows, fields) {
            if (!err) {
                callback && callback(true);
            } else {
                callback && callback(false);
            }
        });
    }
};