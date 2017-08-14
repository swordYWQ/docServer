var api = require('../api/index')
var route = (app) => {
    app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1')
        res.header("Content-Type", "application/json;charset=utf-8");
        next();
    });
    app.all('/user/login', api.user.loginIn);
    app.all('/user/logout', api.user.loginOut);
    app.all('/doc/getDocList', api.doc.getDocList)
};
module.exports = route;