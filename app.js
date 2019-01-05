// 系统配置参数
const config = require('config')											// 配置文件
const port = config.server.port												// 系统端口
const staticRoot = config.server.staticRoot									// 静态根目录
// 应用服务相关
const Koa = require('koa')													// KOA应用框架
const cors = require('@koa/cors')                                           // 跨域中间件
const koaBody = require('koa-body')								            // 入参JSON解析中间件
const staticServer = require('koa-static')									// 静态资源服务中间件
const mount = require('koa-mount')											// 挂载点中间件
// 应用中间件
const xcontroller = require('koa-xcontroller')								// koa-xcontroller，自动路由中间件
const xmodel = require('koa-xmodel')										// koa-xmodel，自动实体中间件
const xbatis = require('koa-xbatis')										// koa-xbatis，自动SQL中间件
const xnosql = require('koa-xnosql')										// koa-xnosql，自动NOSQL中间件
const xerror = require('koa-xerror')                                        // koa-xerror，自动异常捕获中间件
const xauth = require('koa-xauth')                                          // koa-xauth，自动身份认证中间件
const xlog = require('koa-xlog')                                            // koa-xlog，自动日志中间件
// 持久层相关
const redis = require("redis")                                              // 缓存服务
const nodebatis = require(__dirname + '/src/nodebatis/nodebatis.js')        // SQL应用框架
const sequelize = require(__dirname + '/src/sequelize/sequelize.js')		// ORM应用框架
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })     // 日志服务

// 认证相关（passport已弃用，目前采用koa-xauth中间件替代，基于JWT身份令牌识别）
// const session = require("koa-session2")										// SESSION中间件
// const passport = require(__dirname + '/src/auth/passport_config.js')		    // PASSPORT认证中间件
// const xauth_router = require(__dirname + '/src/auth/xauth_router.js')		// 认证路由

// REDIS缓存服务
// global.redis = redis.createClient()
// global.redis.on('connect',function(){
//     global.redis.set('REDIS_TEST', 'REDIS存储测试',redis.print)
//     global.redis.get('REDIS_TEST', redis.print)
// })

// 初始化应用服务
const app = new Koa()
// 启用静态资源服务
app.use(mount(staticRoot, staticServer(__dirname + '/static')))

// 启用认证路由（passport已弃用，目前采用koa-xauth中间件替代，基于JWT身份令牌识别）
// app.proxy = true
// app.use(session({ key: "SESSIONID" }))
// app.use(passport.initialize())
// app.use(passport.session())
// app.use(mount('/', xauth_router.routes()))
app.use(mount('/', cors()))             // 跨域中间件
app.use(xerror(config.error))           // 全局错误捕获中间件，必须第一位使用，参数1：错误配置
app.use(koaBody())                      // 入参JSON解析中间件
app.use(xlog(config.log, (ctx) => { log.info('异步日志处理', ctx.request.body) }))    //日志中间件，参数1：日志配置，参数2：额外日志处理
app.use(xauth(config.auth, (v) => v))   // TOKEN身份认证中间件，，参数1：认证配置，参数2：额外自定义TOKEN解析规则

// 1,加载koa-xcontroller中间件
xcontroller.init(app, config.server)            // 应用实例，可选配置：访问根路径，控制器目录路径

// 2,加载koa-xmodel中间件
xmodel.init(app, sequelize, config.server)      // 初始化mysql连接

// 3,加载koa-xbatis中间件
xbatis.init(app, nodebatis, config.server)      // 初始化mysql连接

// 4,加载koa-xnosql中间件
xnosql.init(app, config.server)                 // 初始化mongodb连接

// 启动应用服务
app.listen(port)
log.info(`XServer应用启动【执行环境:${process.env.NODE_ENV},端口:${port}】`)
log.warn(`模拟用户登录路径【localhost:${port}${config.server.controllerRoot}/auth/login】`)
log.warn(`静态资源访问路径【localhost:${port}${staticRoot}*】`)
log.warn(`RESTful  API路径【localhost:${port}${config.server.controllerRoot}/MODULE_NAME/*】`)
log.info(`===============================================================`)
log.warn(`XModel服务已启动`)
log.info(`[POST]http://localhost:${port}/xmodel/MODEL/create`)
log.info(`[POST]http://localhost:${port}/xmodel/MODEL/update`)
log.info(`[POST]http://localhost:${port}/xmodel/MODEL/query`)
log.info(`[GET ]http://localhost:${port}/xmodel/MODEL/get/:id`)
log.info(`[GET ]http://localhost:${port}/xmodel/MODEL/destroy/:id`)
log.info(`===============================================================`)
log.warn(`XBatis服务已启动`)
log.info(`[POST]http://localhost:${port}/xbatis/MODEL_NAME/METHOD_NAME`)
log.info(`===============================================================`)
log.warn(`XNosql服务已启动`)
log.info(`[POST]http://localhost:${port}/xnosql/MODEL/insert`)
log.info(`[POST]http://localhost:${port}/xnosql/MODEL/update`)
log.info(`[POST]http://localhost:${port}/xnosql/MODEL/query`)
log.info(`[POST]http://localhost:${port}/xnosql/MODEL/page`)
log.info(`[GET ]http://localhost:${port}/xnosql/MODEL/get/:id`)
log.info(`[GET ]http://localhost:${port}/xnosql/MODEL/delete/:id`)