var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();

//setup
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//route
app.get('/', function (req, res) {
    getBySql('select * from article', function (data) {
        res.render('index', {
            title: '首页',
            models: data
        });
    });
});
app.get('/blog/:id', function (req, res) {
    var id = req.params.id;
    getBySql('select * from article where id=' + id, function (data) {
        res.render('detail', {
            model: data[0]
        });
    });
})

app.get('/manage/create', function (req, res) {
    res.render('manage/create', { title: '添加文章' });
});

app.post('/manage/create', function (req, res) {
    var _title = req.body.title;
    var _content = req.body.content;
    var model = {
        title: _title,
        content: _content
    };
    createArticle('article', model);
    res.redirect('/manage/list');
});

app.get('/manage/delete/:id', function (req, res) {
    var id = req.params.id;
    deleteArticle("DELETE FROM `article` WHERE `article`.`id` = " + id, function (status) {
        if (status) {
            console.log('delete success id' + id);
            res.redirect('/manage/list');
        } else {
            console.log('delete fail');
            res.redirect('/manage/list');
        }
    })
});

app.get('/manage/list', function (req, res) {
    getBySql('select * from article', function (data) {
        res.render('manage/list', {
            title: '文章列表',
            models: data
        });
    });
});

//mysql
var db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'nodeblog_db'
    }
);

function createArticle(table, model) {
    db.query('insert ' + table + ' set ?', model, function (err, rows) {
        if (err) throw err;

        console.log('insert success id:' + rows.insertId);

    });
}

function getBySql(sql, callback) {
    db.query(sql, function (err, rows, fields) {
        if (!err) {
            callback && callback(rows);
        } else {
            console.log('error');
        }
    });
}

function deleteArticle(sql, callback) {
    var status = false;
    db.query(sql, function (err, rows, fields) {
        if (!err) {
            status = true;
            callback && callback(true);
        } else {
            console.log('error');
        }
    });
}

app.listen('3000', function () {
    console.log('Example app listening at http://127.0.0.1:3000');
});