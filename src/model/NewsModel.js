const Sequelize = require('sequelize')
const sequelize = require(__dirname + '/../sequelize/sequelize.js')

const NewsModel = sequelize.define('bg_news_model', {
    type: Sequelize.STRING,         // 新闻类别
    title: Sequelize.STRING,        // 新闻标题
    source: Sequelize.STRING,       // 新闻来源
    author: Sequelize.STRING,       // 新闻作者
    title: Sequelize.STRING,        // 新闻标题
    distributeAt: Sequelize.DATE    // 发布时间
})

module.exports = NewsModel