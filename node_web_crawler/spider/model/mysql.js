var mysql = require('mysql');

var db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'www'
    }
);

exports.Save = function(model) {
    db.query('insert article set ?', model, function (error, result) {
        if (error) throw error;
        if (!!result) {
            console.log('insert success id:' + result.insertId);
        } else {
            console.log('insert fail');
        }
    });
}