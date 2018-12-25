const Sequelize = require('sequelize')
const sequelize = require(__dirname + '/../sequelize/sequelize.js')

const ProductModel = sequelize.define('bg_product_model', {
    imgurls: Sequelize.STRING,  // 项目图片
    name: Sequelize.STRING,     // 项目名称
    company: Sequelize.STRING,  // 所属企业
    intro: Sequelize.STRING     // 项目简介
})

module.exports = ProductModel