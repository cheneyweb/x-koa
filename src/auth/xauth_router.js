// 路由相关
const Router = require('koa-router')
// 日志相关
const log = require('tracer').colorConsole({ level: require('config').get('log').level })
// 初始化路由
const router = new Router()
// 认证相关
const passport = require(__dirname + '/passport_config.js')

// 角色权限
let acl = require('acl')
acl = new acl(new acl.memoryBackend())
acl.allow('admin', 'xbatis', 'remove')

/**
 * 认证登录
 */
router.post('/xauth/login', function (ctx, next) {
    return passport.authenticate('local', function (err, user, info, status) {
        if (user) {
            ctx.body = 'Y'
            acl.addUserRoles(user.id, 'admin')// 添加用户与其角色，这里模拟使用admin
            return ctx.login(user)
        } else {
            ctx.body = info
        }
    })(ctx, next)
})

/**
 * 认证登出
 */
router.get('/xauth/logout', function (ctx, next) {
    ctx.logout()
    ctx.body = 'Y'
})

// 以下为自定义需要身份认证的路由
router.post('/xauth/test', function (ctx, next) {
    if (ctx.isAuthenticated()) {
        ctx.body = '认证通过'
    } else {
        ctx.throw(401)
        ctx.body = '非法访问'
    }
})

router.post('/xbatis/*/remove', async function (ctx, next) {
    // 登录认证判断
    if (ctx.isAuthenticated()) {
        // 权限判断
        let aclResult = await acl.isAllowed(ctx.session.passport.user.id, 'xbatis', 'remove')
        // 根据权限认证结果返回
        if(aclResult){
            await next()
        }else{
            ctx.throw(401)
        }
    } else {
        ctx.throw(401)
    }
})

module.exports = router
