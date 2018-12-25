const Sequelize = require('sequelize')
const sequelize = require(__dirname + '/../sequelize/sequelize.js')

const ExpertModel = sequelize.define('bg_expert_model', {
    headurl: Sequelize.STRING,  // 专家头像
    type: Sequelize.STRING,     // 专家分类
    name: Sequelize.STRING,     // 专家名称
    title: Sequelize.STRING,    // 专家职称
    intro: Sequelize.STRING,    // 专家简介
    show: Sequelize.INTEGER     // 是否首页展示
})

module.exports = ExpertModel