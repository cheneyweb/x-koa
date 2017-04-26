// 系统配置参数
const config = require('config')											// 配置文件
const port = config.get('server').port										// 系统端口
const staticRoot = config.get('server').staticRoot							// 静态根目录
const controllerRoot = config.get('server').controllerRoot					// 控制根目录
const controllerDir = __dirname + config.get('server').controllerDir		// 控制文件目录
// 应用服务相关
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const staticServer = require('koa-static')
const mount = require('koa-mount')
// 应用中间件
const xcontroller = require('koa-xcontroller')
const xmodel = require('koa-xmodel')
const xbatis = require('koa-xbatis')
const xnosql = require('koa-xnosql')
// 持久层相关
const fs = require('fs')
const sequelize = require(__dirname + '/src/sequelize/sequelize.js')
let modelDir = __dirname + config.get('server').modelDir					// 模型文件目录
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

// 首先同步所有实体和数据库
fs.readdirSync(modelDir).forEach(function (filename) {
	require(modelDir + filename)
})
sequelize.sync().then(function () {
	log.info('xmodel所有实体已同步数据库')
})

// 1,引入koa-xcontroller中间件
xcontroller.loadController(app,controllerRoot,controllerDir)				// 应用实例,访问根路径,控制器目录路径

// 2,引入koa-xmodel中间件
xmodel.modelDir = modelDir
app.use(mount('/xmodel', xmodel.routes()))

// 3,引入koa-xbatis中间件
app.use(mount('/xbatis', xbatis.routes()))

// 4,引入koa-xnosql中间件
xnosql.dburl = config.db.url
app.use(mount('/xnosql', xnosql.routes()))

// 启动应用服务
app.listen(port)
log.info(`XServer应用已启动,执行环境:${process.env.NODE_ENV},端口:${port}...`)
log.info(`静态资源访问路径【host:${port}${staticRoot}*】`)
log.info(`RESTfulApi访问路径【host:${port}${controllerRoot}MODULE_NAME/*】`)
log.info(`===============================================================`)
log.info(`XModel服务已启动`)
log.info(`[POST]http://host:${port}/xmodel/MODEL/create`)
log.info(`[POST]http://host:${port}/xmodel/MODEL/update`)
log.info(`[POST]http://host:${port}/xmodel/MODEL/query`)
log.info(`[GET]http://host:${port}/xmodel/MODEL/get/:id`)
log.info(`[GET]http://host:${port}/xmodel/MODEL/destroy/:id`)
log.info(`===============================================================`)
log.info(`XBatis服务已启动`)
log.info(`[POST]http://host:${port}/xbatis/MODEL_NAME/METHOD_NAME`)
log.info(`===============================================================`)
log.info(`XNosql服务已启动`)
log.info(`[POST]http://host:${port}/xnosql/MODEL/create`)
log.info(`[POST]http://host:${port}/xnosql/MODEL/update`)
log.info(`[POST]http://host:${port}/xnosql/MODEL/query`)
log.info(`[GET]http://host:${port}/xnosql/MODEL/get/:id`)
log.info(`[GET]http://host:${port}/xnosql/MODEL/destroy/:id`)