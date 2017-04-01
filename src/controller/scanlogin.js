// 路由相关
const Router = require('koa-router')
// 日志相关
const log = require('tracer').colorConsole({ level: require('config').get('log').level })
// 初始化路由
const router = new Router()

router.get('/cb', function (ctx, next) {
	log.info(ctx.request.query)
	ctx.body = 'Y'
})

module.exports = router;