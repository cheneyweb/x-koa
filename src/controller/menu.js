// 路由相关
const Router = require('koa-router')
// 日志相关
const log = require('tracer').colorConsole({ level: require('config').get('log').level })
// 初始化路由
const router = new Router()
// 持久化相关
const ObjectId = require('mongodb').ObjectID
const collection = 'menu'
// 时间工具
const moment = require('moment')
// 缓存服务
const cache = require(__dirname + '/../util/cache.js')

/**
 * 新增菜单
 */
router.post('/add', async function (ctx, next) {
	// 获取xnosql设置在全局对象中的数据库连接和用户对象
	let mongodb = global.mongodb
	let user = await cache.get(global.redis, ctx.header.token)
	// let user = global[ctx.header.token]
	if (user) {
		let menu = ctx.request.body.menu
		menu.operatorId = user._id.toString()
		menu.operatorOpenid = user.openid
		menu.operatorName = user.nickName
		menu.operatorImgurl = user.avatarUrl
		if (user.nickName == '宇帅') {
			menu.indexShow = true
		}
		menu.datetimeCreate = moment().format('YYYY-MM-DD HH:mm:ss')
		let r = await mongodb.insert(collection, menu)
		ctx.body = menu
	} else {
		ctx.status = 400
		ctx.body = '尚未登录'
	}
})

/**
 * 删除菜单
 */
router.get('/delete/:id', async function (ctx, next) {
	// 获取xnosql设置在全局对象中的数据库连接和用户对象
	let mongodb = global.mongodb
	let user = await cache.get(global.redis, ctx.header.token)
	// let user = global[ctx.header.token]
	if (user) {
		let query = { operatorId: user._id.toString(), '_id': ObjectId(ctx.params.id) }
		let r = await mongodb.remove(collection, query)
		ctx.body = 'Y'
	} else {
		ctx.status = 400
		ctx.body = '尚未登录'
	}
})

/**
 * 修改菜单
 */
router.post('/update', async function (ctx, next) {
	// 获取xnosql设置在全局对象中的数据库连接和用户对象
	let mongodb = global.mongodb
	let user = await cache.get(global.redis, ctx.header.token)
	// let user = global[ctx.header.token]
	if (user) {
		let menu = ctx.request.body.menu
		menu.datetimeModify = moment().format('YYYY-MM-DD HH:mm:ss')
		let query = { operatorId: user._id.toString(), '_id': ObjectId(menu._id) }
		delete menu._id
		await mongodb.update(collection, query, { $set: menu })
		ctx.body = 'Y'
	} else {
		ctx.status = 400
		ctx.body = '尚未登录'
	}
})

/**
 * 查询菜单详情
 */
router.get('/detail/:id', async function (ctx, next) {
	// 获取xnosql设置在全局对象中的数据库连接和用户对象
	let mongodb = global.mongodb
	let user = await cache.get(global.redis, ctx.header.token)
	// let user = global[ctx.header.token]
	if (user) {
		let query = { operatorId: user._id.toString(), '_id': ObjectId(ctx.params.id) }
		let r = await mongodb.findOne(collection, query)
		ctx.body = r
	} else {
		ctx.status = 400
		ctx.body = '尚未登录'
	}
})

/**
 * 我的菜单
 */
router.get('/my', async function (ctx, next) {
	// 获取xnosql设置在全局对象中的数据库连接和用户对象
	let mongodb = global.mongodb
	let user = await cache.get(global.redis, ctx.header.token)
	// let user = global[ctx.header.token]
	if (user) {
		let query = { operatorId: user._id.toString() }
		let r = await mongodb.findAndSort(collection, query, { datetimeCreate: -1 })
		ctx.body = r
	} else {
		ctx.status = 400
		ctx.body = '尚未登录'
	}
})

/**
 * 首页菜单
 */
router.get('/index', async function (ctx, next) {
	// 获取xnosql设置在全局对象中的数据库连接和用户对象
	let mongodb = global.mongodb
	let query = { indexShow: true }
	let r = await mongodb.findAndSort(collection, query, { datetimeCreate: -1 })
	ctx.body = r
})

module.exports = router