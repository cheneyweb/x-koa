// 路由相关
const Router = require('koa-router')
// 日志相关
const log = require('tracer').colorConsole({ level: require('config').get('log').level })
// 初始化路由
const router = new Router()
// 七牛上传工具
const qiniu = require('qiniu')
qiniu.conf.ACCESS_KEY = 'Access_Key'
qiniu.conf.SECRET_KEY = 'Secret_Key'
const bucket = 'image'

/**
 * 获取七牛云上传TOKEN
 */
router.get('/token', function (ctx, next) {
    // let key = ctx.request.query.key
    let putPolicy = new qiniu.rs.PutPolicy(bucket)
    let data = { uptoken: putPolicy.token() }
    ctx.body = data
})

module.exports = router