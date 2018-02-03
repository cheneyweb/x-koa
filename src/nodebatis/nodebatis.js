const NodeBatis = require('nodebatis')
const config = require('config')
const dbConfig = config.get('db')
const Types = NodeBatis.Types

const nodebatis = new NodeBatis(`${process.cwd()}${config.server.mapperDir || '/src/yaml/'}`, {
    debug: true,
    dialect: 'mysql',
    host: dbConfig.host,
    port: 3306,
    database: dbConfig.dbname,
    user: dbConfig.username,
    password: dbConfig.password,
    pool: {
        minSize: 5,
        maxSize: 20,
        acquireIncrement: 5
    }
})

// nodebatis.define(/^test.findAll$/, {
//     name: /^\d+/,
//     age: Types.INT
// })

module.exports = nodebatis