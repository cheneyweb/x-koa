const passport = require('passport')
const LocalStrategy = require('passport-local')
const UserModel = require(__dirname + '/../../src/model/UserModel')
const log = require('tracer').colorConsole({ level: require('config').get('log').level })

// 用户名密码验证策略
passport.use(new LocalStrategy(
    /**
     * @param username 用户输入的用户名
     * @param password 用户输入的密码
     * @param done 验证验证完成后的回调函数，由passport调用
     */
    function(username, password, done) {
        UserModel.findOne({ username: username }).then(function(result) {
            if (result != null) {
                if (result.password == password) {
                    return done(null, result);
                } else {
                    log.error('密码错误');
                    return done(null, false, { message: '密码错误' })
                }
            } else {
                log.error('用户不存在');
                return done(null, false, { message: '用户不存在' })
            }
        }).catch(function(err) {
            log.error(err.message);
            return done(null, false, { message: err.message })
        });
    }
));

// serializeUser 在用户登录验证成功以后将会把用户的数据存储到 session 中
passport.serializeUser(function(user, done) {
    done(null, user);
});

// deserializeUser 在每次请求的时候将从 session 中读取用户对象，并将其封装到 req.user
passport.deserializeUser(function(user, done) {
    return done(null, user);
});

// 这是封装了一个中间件函数到 passport 中，可以在需要拦截未验证的用户的请求的时候调用
passport.authenticateMiddleware = function authenticationMiddleware() {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        // res.redirect('/user/login');
        res.send('非法访问')
    }
};

module.exports = passport
