/**
 * 模型索引文件
 * 统一管理所有模型并建立关联
 */
const User = require('./User')
const Product = require('./Product')
const Order = require('./Order')

// 定义模型关联关系
// User 和 Order 的一对多关系
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' })
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// 可以在这里添加更多模型关联
// Product 和 OrderItem 的关联等

module.exports = {
  User,
  Product,
  Order,
  // 导出 sequelize 实例用于同步数据库
  initModels: async () => {
    const { sequelize } = require('../config/database')
    try {
      await sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
      console.log('✅ 数据库模型同步成功')
    } catch (error) {
      console.error('❌ 数据库模型同步失败:', error)
      throw error
    }
  }
}
