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
    log.info('后置路由处理')
    ctx.body.res.type = 'asd'
})

module.exports = router