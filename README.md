# x-koa
xserver应用中间件组件服务koa版本

[传送门：XServer官网文档](http://www.xserver.top)

框架目录结构
>
	├── app.js
	├── config
	│   ├── default.json
	│   ├── develop.json
	│   └── production.json
	├── dist
	│   ├── index.html
	│   └── static
	├── node_modules
	├── package.json
	├── src
	│   ├── auth（已弃用，不再支持passport集成，现使用基于JWT的身份令牌识别替换）
	│   ├── controller
	│   ├── middleware
	│   ├── model
	│   ├── nodebatis
	│   ├── sequelize
	│   └── yaml
	└── static
	    └── scanlogin.html

帮助联系
>
	作者:cheneyxu
	邮箱:457299596@qq.com
	QQ:457299596

更新日志
>
	2017.05.08:集成passport认证中间件
	2017.05.09:集成redis缓存服务，集成acl角色权限控制服务
	2017.12.03:升级所有依赖包
	2017.12.05:升级所有中间件
	2017.12.12:集成包括日志，异常，认证等基础服务在内的多钟中间件，弃用passport，使用基于JWT的身份令牌认证替代
	2018.01.07:更新koa-xauth
	2018.01.10:更新koa-xauth
	2018.01.28:升级所有依赖包
	2018.01.29:更新koa-xlog/koa-xerror/koa-xauth中间件
	2018.02.03:更新koa-xmodel中间件至1.0版本，支持业务层AOP开发
	2018.02.04:更新koa-xbatis/koa-xnosql/koa-xcontroller中间件至1.0版本，支持业务层AOP开发
	2018.02.09:更新koa-xnosql以支持自动分页路由
	2018.03.07:更新koa-xauth和koa-xerror
	2018.10.15:升级所有依赖包
	2019.01.05:升级所有依赖包，使用dayjs替换moment，精简部分模块
	2019.01.13:升级所有依赖包
	2019.01.15:升级所有依赖包
	2019.07.10:升级所有依赖包


	