/**
 * 商品模型
 */
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '商品名称'
  },
  description: {
    type: DataTypes.TEXT,
    comment: '商品描述'
  },
  categoryId: {
    type: DataTypes.INTEGER,
    comment: '分类 ID'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '售价（分）'
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    comment: '原价（分）'
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '库存数量'
  },
  sales: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '销量'
  },
  images: {
    type: DataTypes.TEXT,
    comment: '商品图片 JSON 数组'
  },
  detail: {
    type: DataTypes.TEXT,
    comment: '商品详情 HTML'
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '状态 1-上架 0-下架'
  },
  isRecommend: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否推荐'
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序值'
  }
}, {
  tableName: 'products',
  comment: '商品表',
  indexes: [
    { fields: ['categoryId'] },
    { fields: ['status'] },
    { fields: ['isRecommend'] }
  ]
})

module.exports = Product
