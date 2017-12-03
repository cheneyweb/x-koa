// 路由相关
const Router = require('koa-router')
// 日志相关
const config = require('config')
const log = require('tracer').colorConsole({ level: config.log.level })
// 初始化路由
const router = new Router()
// 网络请求
const axios = require('axios')
// 加密模块
// const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
// 持久化相关
const ObjectId = require('mongodb').ObjectID
const collection = 'user'
// 缓存服务
// const cache = require(__dirname + '/../util/cache.js')
// 角色权限
// let acl = require('acl')
// acl = new acl(new acl.memoryBackend())
// acl.allow('admin', 'xbatis', 'remove')

/**
 * 认证登录
 */
router.get('/login', async function (ctx, next) {
    try {
        // 获取xnosql设置在全局对象中的数据库连接
        const mongodb = global.mongodb
        // const redis = global.redis
        // let user = await cache.get(redis, ctx.header.token)
        // let user = global[ctx.header.token]
        // TOKEN存在，则用户已登录
        if (ctx.header.token != 'NULL!') {
            const user = await jwt.verify(ctx.header.token, config.jwt.secret)
            log.info('已登录:' + JSON.stringify(user))
            ctx.body = { token: ctx.header.token, user: user }
        } else {
            // 通过微信接口获取OPENID
            const res = await axios.get('https://api.weixin.qq.com/sns/jscode2session?appid=' + config.wxapp.appId + '&secret=' + config.wxapp.appSecret + '&js_code=' + ctx.query.code + '&grant_type=authorization_code')
            if (res.data.openid) {
                // 初始化用户
                let user = { openid: res.data.openid, nickName: null, avatarUrl: null, country: null, province: null, city: null, gender: null }
                // 通过OPENID查询用户
                let r = await mongodb.find(collection, { openid: res.data.openid })
                // 判断是否新注册用户
                if (r.length > 0) {
                    user = r[0]
                    log.info('新登录:' + JSON.stringify(user))
                } else {
                    r = await mongodb.insert(collection, user)
                    log.info('新注册:' + JSON.stringify(user))
                }
                // cache.set(redis, token, user)
                // global[token] = user
                // 获取TOKEN
                // let token = getSha1(res.data.openid)
                const token = await jwt.sign({ ...user, iat: Date.now() }, config.jwt.secret)
                // 返回结果数据
                ctx.body = { token: token, user: user }
            } else {
                ctx.body = '微信登录失败'
            }
        }
    } catch (error) {
        log.error(error)
        ctx.body = '登录服务故障'
    }
})

/**
 * 完善用户信息
 */
router.post('/updateuser', async function (ctx, next) {
    try {
        // 获取xnosql设置在全局对象中的数据库连接
        let mongodb = global.mongodb
        // 从TOKEN中解析用户
        const user = await jwt.verify(ctx.header.token, config.jwt.secret)
        // let user = await cache.get(global.redis, ctx.header.token)
        // let user = global[ctx.header.token]
        if (user) {
            // 更新用户信息
            let user = ctx.request.body.user
            let _id = user._id
            let query = { '_id': ObjectId(_id) }
            delete user._id
            await mongodb.update(collection, query, { $set: user })
            // 重置用户信息
            user._id = _id
            // cache.set(redis, ctx.header.token, user)
            // global[ctx.header.token] = user
            let token = jwt.sign({ ...user, iat: Date.now() }, config.jwt.secret)
            ctx.body = token
        } else {
            ctx.status = 400
            ctx.body = '尚未登录'
        }
    } catch (error) {
        log.error(error)
        ctx.body = '用户服务故障'
    }
})

/**
 * 将字符串SHA1输出
 * @param {字符串} str 
 */
// function getSha1(str) {
//     let sha1 = crypto.createHash("sha1")
//     sha1.update(str)
//     let res = sha1.digest("hex")
//     return res
// }

module.exports = router
