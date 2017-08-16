var dbConnection = require('../db/index')
var log = require('../utils/log')
var resDataUtil = require('../utils/resDataUtil')
/**
 * 登录
 * @param {*} req 
 * @param {*} res 
 */
const loginIn = (req, res) => {
    var param = req.query;
    if (param.username && param.password) {
        var sql = "select * from docSystem.user where username = ? and password = ?"
        var sqlData = [param.username, param.password]
        dbConnection.mysqlDB.execQuery(sql, sqlData, (rows) => {
            console.log(rows)
            if (rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    if (param.username == rows[i].username && param.password == rows[i].password) {
                        var user = {
                            id: rows[i].id,
                            username: param.username,
                            password: param.password
                        };
                        req.session.user = user;
                        console.log(req)
                        // res.header("Set-Cookie", "SESSIONID=" + req.sessionID);
                        log.info("登录IP:" + req._remoteAddress + " 登陆成功!")
                        res.end(resDataUtil.success({
                            username: param.username
                        }));
                    } else {
                        log.warn("登录IP:" + req._remoteAddress + "用户名或密码错误!")
                        res.end(resDataUtil.error([], ' 用户名或密码错误!'));
                    }
                }
            } else {
                log.warn("登录IP:" + req._remoteAddress + " 用户名或密码错误!")
                res.end(resDataUtil.error([], '用户名或密码错误!'));
            }
        })
    } else {
        log.warn("登录IP:" + req._remoteAddress + " 参数错误!")
        res.end(resDataUtil.error([], '参数错误!'));
    }
}

/**
 * 登出
 * @param {*} req 
 * @param {*} res 
 */
const loginOut = (req, res) => {
    // req.session.user = null;
    // var cookie=req.headers.cookie.split('=')[1];
    console.log(req.session)
    req.session.destroy();
    res.end(resDataUtil.success(req.sessionStore))//"success"));
}

module.exports = {
    loginIn,
    loginOut
}