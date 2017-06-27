var mysql = require('mysql');

var db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'usatvdb'
    }
);

exports.Save = function(model) {
    db.query('insert tv set ?', model, function (error, result) {
        if (error) throw error;
        if (!!result) {
            console.log('insert success id ' + result.insertId);
        } else {
            console.log('insert fail');
        }
    });
}