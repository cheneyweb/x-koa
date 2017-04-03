// 系统配置参数
const config = require('config')
const port = config.get('server').port
const staticRoot = config.get('server').staticRoot
const controllerRoot = config.get('server').controllerRoot
const controllerDir = __dirname + config.get('server').controllerDir
// 应用服务相关
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const staticServer = require('koa-static')
const mount = require('koa-mount')
// 文件读取
const fs = require('fs')
const path = require('path')
// 日志相关
const log = require('tracer').colorConsole({ level: config.get('log').level })

// 初始化应用服务
const app = new Koa()
// 加载中间件
app.use(async function (ctx, next) {
	log.info('进入权限控制');
	if(true){
		await next();
	}else{
		ctx.body = '权限校验失败';
	}
})
app.use(mount(staticRoot, staticServer(__dirname + '/static')))				// 静态资源服务
app.use(bodyParser())														// 入参JSON解析
// 加载所有控制器
fs.readdirSync(controllerDir).forEach(function (filename) {
	let moduleName = `${controllerRoot}${path.basename(filename, '.js')}`	// 请求模块名称,user.js就是/user/*的映射
	let router = require(controllerDir + filename)							// 模块路由
	app.use(mount(moduleName, router.routes()))								// 加载路由
	app.use(mount(moduleName, router.allowedMethods()))
})

// 启动应用服务
app.listen(port)
log.info(`应用已启动,执行环境:${process.env.NODE_ENV},端口:${port}...`)
log.info(`静态资源访问路径【host:${port}${staticRoot}*】`)
log.info(`RESTfulApi访问路径【host:${port}${controllerRoot}MODULE_NAME/*】`)
