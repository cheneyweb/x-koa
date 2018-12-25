// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 工具相关
const _ = require('lodash')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * 业务认证中间件例子，进行参数校验等处理
 */
router.post('/NewsModel/create', async function (ctx, next) {
    let inparam = ctx.request.body
    if (inparam.distributeAt.length != 19) {
        ctx.body = { err: true, res: '发布时间格式不正确' }
    } else {
        inparam.distributeAt = '2018-02-01 23:59:58'
        return next()
    }
})

module.exports = router