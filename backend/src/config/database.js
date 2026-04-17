/**
 * 数据库连接配置
 * 使用 Sequelize ORM
 */
const { Sequelize } = require('sequelize')
const config = require('./index')

const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    charset: 'utf8mb4',
    pool: config.database.pool,
    logging: config.server.env === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
)

// 测试数据库连接
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功!')
  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
    process.exit(1)
  }
}

module.exports = {
  sequelize,
  testConnection
}
