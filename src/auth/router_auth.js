// 路由相关
const express = require('express')
const router = express.Router()
// 认证相关
const passport = require(__dirname + '/passport_config.js')

// 登录认证
router.post('/user/login', passport.authenticate('local', { failureFlash: true }), function(req, res) {
    // log.info(req.user);
    res.send("success")
})

// 认证测试
router.get('/user/testauth', passport.authenticateMiddleware(), function(req, res) {
    res.send('允许访问')
})