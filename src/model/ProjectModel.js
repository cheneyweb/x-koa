const Sequelize = require('sequelize')
const sequelize = require(__dirname + '/../sequelize/sequelize.js')

const ProjectModel = sequelize.define('bg_project_model', {
    imgurls: Sequelize.STRING,  // 项目图片
    name: Sequelize.STRING,     // 项目名称
    yield: Sequelize.DOUBLE,    // 预期年化收益率
    period: Sequelize.STRING,   // 投资周期
    amount: Sequelize.DOUBLE,   // 可投金额
    intro: Sequelize.STRING     // 项目简介
})

module.exports = ProjectModel