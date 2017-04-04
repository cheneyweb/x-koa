const mount = require('koa-mount')
const fs = require('fs')
const path = require('path')

/**
 * [xcontroller 自动路由加载器]
 * controllerDir 控制器目录路径，默认是{project}/src/controller
 * controllerRoot 控制器访问跟路径，默认是/xserver/
 * app 应用实例对象
 */
let xcontroller = {
    loadController(app, controllerRoot = '/xserver/', controllerDir = __dirname + '/../../src/controller/') {
        controllerRoot = controllerRoot || '/xserver/'
        controllerDir = controllerDir || __dirname + '/../../src/controller/'
        // 加载所有控制器
        fs.readdirSync(controllerDir).forEach(function(filename) {
            let moduleName = `${controllerRoot}${path.basename(filename, '.js')}` // 请求模块名称,user.js就是/user/*的映射
            let router = require(controllerDir + filename) // 模块路由
            app.use(mount(moduleName, router.routes())) // 加载路由
            app.use(mount(moduleName, router.allowedMethods()))
        })
    }
}

module.exports = xcontroller
