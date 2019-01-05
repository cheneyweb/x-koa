// 路由相关
const Router = require('koa-router')
// 日志相关
const config = require('config')
const log = require('tracer').colorConsole({ level: config.log.level })
// 初始化路由
const router = new Router()
// 持久化相关
const ObjectId = require('mongodb').ObjectID
const collection = 'menu'
// 时间工具
const dayjs = require('dayjs')
// 加密模块
const jwt = require('jsonwebtoken')
// 缓存服务
// const cache = require(__dirname + '/../util/cache.js')

/**
 * 新增菜单
 */
router.post('/add', async function (ctx, next) {
	try {
		// 获取xnosql设置在全局对象中的数据库连接和用户对象
		const mongodb = global.mongodb
		const user = await jwt.verify(ctx.header.token, config.auth.secret)
		// let user = await cache.get(global.redis, ctx.header.token)
		// let user = global[ctx.header.token]
		if (user) {
			const menu = ctx.request.body.menu
			menu.operatorId = user._id.toString()
			menu.operatorOpenid = user.openid
			menu.operatorName = user.nickName
			menu.operatorImgurl = user.avatarUrl
			if (user.nickName == '宇帅') {
				menu.indexShow = true
			}
			menu.datetimeCreate = dayjs().format('YYYY-MM-DD HH:mm:ss')
			const r = await mongodb.insert(collection, menu)
			ctx.body = menu
		} else {
			ctx.status = 400
			ctx.body = '尚未登录'
		}
	} catch (error) {
		log.error(error)
		ctx.body = '菜单服务故障'
	}
})

/**
 * 删除菜单
 */
router.get('/delete/:id', async function (ctx, next) {
	try {
		// 获取xnosql设置在全局对象中的数据库连接和用户对象
		const mongodb = global.mongodb
		const user = await jwt.verify(ctx.header.token, config.auth.secret)
		// let user = await cache.get(global.redis, ctx.header.token)
		// let user = global[ctx.header.token]
		if (user) {
			const query = { operatorId: user._id.toString(), '_id': ObjectId(ctx.params.id) }
			const r = await mongodb.remove(collection, query)
			ctx.body = 'Y'
		} else {
			ctx.status = 400
			ctx.body = '尚未登录'
		}
	} catch (error) {
		log.error(error)
		ctx.body = '菜单服务故障'
	}
})

/**
 * 修改菜单
 */
router.post('/update', async function (ctx, next) {
	try {
		// 获取xnosql设置在全局对象中的数据库连接和用户对象
		const mongodb = global.mongodb
		const user = await jwt.verify(ctx.header.token, config.auth.secret)
		// let user = await cache.get(global.redis, ctx.header.token)
		// let user = global[ctx.header.token]
		if (user) {
			const menu = ctx.request.body.menu
			menu.datetimeModify = dayjs().format('YYYY-MM-DD HH:mm:ss')
			const query = { operatorId: user._id.toString(), '_id': ObjectId(menu._id) }
			delete menu._id
			await mongodb.update(collection, query, { $set: menu })
			ctx.body = 'Y'
		} else {
			ctx.status = 400
			ctx.body = '尚未登录'
		}
	} catch (error) {
		log.error(error)
		ctx.body = '菜单服务故障'
	}
})

/**
 * 查询菜单详情
 */
router.get('/detail/:id', async function (ctx, next) {
	try {
		// 获取xnosql设置在全局对象中的数据库连接和用户对象
		const mongodb = global.mongodb
		const user = await jwt.verify(ctx.header.token, config.auth.secret)
		// let user = await cache.get(global.redis, ctx.header.token)
		// let user = global[ctx.header.token]
		if (user) {
			const query = { operatorId: user._id.toString(), '_id': ObjectId(ctx.params.id) }
			const r = await mongodb.findOne(collection, query)
			ctx.body = r
		} else {
			ctx.status = 400
			ctx.body = '尚未登录'
		}
	} catch (error) {
		log.error(error)
		ctx.body = '菜单服务故障'
	}
})

/**
 * 我的菜单
 */
router.get('/my', async function (ctx, next) {
	try {
		// 获取xnosql设置在全局对象中的数据库连接和用户对象
		const mongodb = global.mongodb
		const user = await jwt.verify(ctx.header.token, config.auth.secret)
		// let user = await cache.get(global.redis, ctx.header.token)
		// let user = global[ctx.header.token]
		if (user) {
			const query = { operatorId: user._id.toString() }
			const r = await mongodb.findAndSort(collection, query, { datetimeCreate: -1 })
			ctx.body = r
		} else {
			ctx.status = 400
			ctx.body = '尚未登录'
		}
	} catch (error) {
		log.error(error)
		ctx.body = '菜单服务故障'
	}
})

/**
 * 首页菜单
 */
router.get('/index', async function (ctx, next) {
	try {
		// 获取xnosql设置在全局对象中的数据库连接和用户对象
		const mongodb = global.mongodb
		const query = { indexShow: true }
		const r = await mongodb.findAndSort(collection, query, { datetimeCreate: -1 })
		ctx.body = r
	} catch (error) {
		log.error(error)
		ctx.body = '菜单服务故障'
	}
})

module.exports = router