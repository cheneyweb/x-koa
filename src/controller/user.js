// 路由相关
const Router = require('koa-router')
// 日志相关
const config = require('config')
const log = require('tracer').colorConsole({ level: config.get('log').level })
// 初始化路由
const router = new Router()
// 网络请求
const axios = require('axios')
// 加密模块
const crypto = require('crypto')
// 持久化相关
const ObjectId = require('mongodb').ObjectID
const collection = 'user'
// 缓存服务
const cache = require(__dirname + '/../util/cache.js')
// 角色权限
// let acl = require('acl')
// acl = new acl(new acl.memoryBackend())
// acl.allow('admin', 'xbatis', 'remove')

/**
 * 认证登录
 */
router.get('/login', async function (ctx, next) {
    // 获取xnosql设置在全局对象中的数据库连接
    let mongodb = global.mongodb
    let redis = global.redis
    let user = await cache.get(redis, ctx.header.token)
    // let user = global[ctx.header.token]
    // 如果从session中获取到用户对象
    if (user) {
        log.info('已登录:' + JSON.stringify(user))
        let result = { token: ctx.header.token, user: user }
        ctx.body = result
    } else {
        // 通过微信接口获取OPENID
        let res = await axios.get('https://api.weixin.qq.com/sns/jscode2session?appid=' + config.wxapp.appId + '&secret=' + config.wxapp.appSecret + '&js_code=' + ctx.query.code + '&grant_type=authorization_code')
        if (res.data.openid) {
            // 通过OPENID查询用户
            let query = { openid: res.data.openid }
            let r = await mongodb.find(collection, query)
            // 获取SESSION_KEY，初始化用户对象
            let token = getSha1(res.data.openid)
            let user = { openid: res.data.openid, nickName: null, avatarUrl: null, country: null, province: null, city: null, gender: null, }
            // 判断是否新注册用户
            if (r.length > 0) {
                user = r[0]
                log.info('新登录:' + JSON.stringify(user))
            } else {
                r = await mongodb.insert(collection, user)
                log.info('新注册:' + JSON.stringify(user))
            }
            // 将用户对象存储在SESSION中
            cache.set(redis, token, user)
            // global[token] = user
            let result = { token: token, user: user }
            // 返回结果数据
            ctx.body = result
        } else {
            ctx.body = '微信登录失败'
        }
    }
})

/**
 * 完善用户信息
 */
router.post('/updateuser', async function (ctx, next) {
    // 获取xnosql设置在全局对象中的数据库连接
    let mongodb = global.mongodb
    // 如果从session中获取到用户对象
    let user = await cache.get(global.redis, ctx.header.token)
    // let user = global[ctx.header.token]
    if (user) {
        // 更新用户信息
        let user = ctx.request.body.user
        let _id = user._id
        let query = { '_id': ObjectId(_id) }
        delete user._id
        await mongodb.update(collection, query, { $set: user })
        // 重置SESSION中的用户信息
        user._id = _id
        cache.set(redis, ctx.header.token, user)
        // global[ctx.header.token] = user
        ctx.body = 'Y'
    } else {
        ctx.status = 400
        ctx.body = '尚未登录'
    }
})

/**
 * 将字符串SHA1输出
 * @param {字符串} str 
 */
function getSha1(str) {
    let sha1 = crypto.createHash("sha1")
    sha1.update(str)
    let res = sha1.digest("hex")
    return res
}

module.exports = router
