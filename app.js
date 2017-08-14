var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redisStore = require('connect-redis')(session);
var redisConfig = require('./src/db/config').redisConfig;
var routes = require('./src/router/index');

var app = express();
app.set('port', 8888);

app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'secret',
    // store: new redisStore(redisConfig),
    cookie: {
        maxAge: 30 * 1000 // 有效期，单位是毫秒
    }
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
// app.use(function (req, res, next) {
//     if (req.session) {
//         next();
//     } else {
//         return next(new Error('session已过期!')) // handle error
//     }
// })
app.use(express.static(path.join(__dirname, 'public')));

routes(app)

var server = require('http').createServer(app)
var ip = '0.0.0.0';
var port = app.get('port')
server.listen(port, ip, function () {
    console.log(ip + ',Express server listening on port ' + port);
});

global.app = app;