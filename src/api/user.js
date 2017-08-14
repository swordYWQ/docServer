var dbConnection = require('../db/index')
var log = require('../util/log')
var resDataUtil = require('../util/resDataUtil')
/**
 * 登录
 * @param {*} req 
 * @param {*} res 
 */
const loginIn = (req, res) => {
    var param = req.query;
    if (param.username && param.password) {
        var sql = "select * from docSystem.user where username = ? and password = ?"
        var params = [param.username, param.password]
        dbConnection.mysqlDB.execQuery(sql, params, (rows) => {
            if (rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    if (param.username == rows[i].username && param.password == rows[i].password) {
                        var user = {
                            id: rows[i].id,
                            username: param.username,
                            password: param.password
                        };
                        req.session.user = user;
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
                log.warn("登录IP:" + req._remoteAddress + " 用户名不存在!")
                res.end(resDataUtil.error([], '用户名不存在!'));
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
    req.session.destroy();
    res.end(resDataUtil.success("success"));
}

module.exports = {
    loginIn,
    loginOut
}