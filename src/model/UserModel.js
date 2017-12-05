const Sequelize = require('sequelize')
const sequelize = require(__dirname + '/../sequelize/sequelize.js')

const UserModel = sequelize.define('test_user_model', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
})

module.exports = UserModel