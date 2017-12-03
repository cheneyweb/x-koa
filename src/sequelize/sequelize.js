const Sequelize = require('sequelize')
const config = require('config')
const dbConfig = config.db

/**
 * [sequelize 数据库连接]
 * export NODE_ENV=production
 * @type {Sequelize}
 */
var sequelize = new Sequelize(dbConfig.dbname, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'mysql',
    operatorsAliases: false
})

module.exports = sequelize
