// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * 业务认证中间件例子，进行参数校验等处理
 */
router.post('/user/add', async function (ctx, next) {
    let inparam = ctx.request.body
    if (inparam.username.length > 10) {
        ctx.body = { err: true, res: '用户名太长' }
    } else {
        inparam.username = 'cheneyxu'
        return next()
    }
})

module.exports = router