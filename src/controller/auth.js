// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 认证相关
const jwt = require('jsonwebtoken')
// 工具相关
const _ = require('lodash')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * 用户认证中间件例子，‘/auth’已经配置白名单，‘/test’路由受保护
 */

// 1、模拟用户登录，生成加密TOKEN令牌
router.use('/login', function (ctx, next) {
    if (true) {
        const user = { userId: '123', role: 'admin' }
        const tokenSign = jwt.sign({ ...user, iat: Date.now(), exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) }, config.auth.secret)
        ctx.tokenSign = tokenSign   // 向后面的路由传递TOKEN加密令牌
        return next()
    } else {
        ctx.status = 401
        ctx.body = '用户名或密码错误'
    }
})

// 2、向前端传递TOKEN加密令牌
router.get('/login', function (ctx, next) {
    ctx.body = ctx.tokenSign
})

// 3、下次其余路由需要在请求时在header中加上token参数，如果没有token或者token错误，xauth中间件会提示错误
router.get('/test', function (ctx, next) {
    ctx.body = ctx.tokenVerify  // 获取TOKEN解析结果
})
router.post('/test', function (ctx, next) {
    ctx.body = ctx.request.body
})

// 路由角色控制
router.get('/financial/test1', async function (ctx, next) {
    ctx.body = ctx.tokenVerify
})
router.post('/financial/test1', async function (ctx, next) {
    ctx.body = ctx.tokenVerify
})
router.get('/financial/test2', async function (ctx, next) {
    ctx.body = ctx.tokenVerify
})

module.exports = router