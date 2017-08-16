var config = require('./config')
var options = {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    connectionLimit: config.mysql.maxConnLimit,
    supportBigNumber: true,
    bigNumberStrings: true
}
var mysql = require('mysql')
var pool = mysql.createPool(options)

const execQuery = (sql, params, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('数据库连接异常!')
            throw err;
        }
        var query = connection.query(sql,params, (err, rows) => {
            connection.release();
            if (err) {
                console.log("SQLERROR:" + err)
            } else {
                callback(rows)
            }
        })
        console.log(query.sql)
    })
}
module.exports = {
    execQuery
}