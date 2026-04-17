/**
 * 订单模型
 */
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderNo: {
    type: DataTypes.STRING(32),
    unique: true,
    allowNull: false,
    comment: '订单编号'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户 ID'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '订单总金额（分）'
  },
  payAmount: {
    type: DataTypes.DECIMAL(10, 2),
    comment: '实付金额（分）'
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '订单状态 0-待支付 1-已支付 2-已发货 3-已完成 4-已取消 -1-已退款'
  },
  payType: {
    type: DataTypes.STRING(20),
    comment: '支付方式 wechat alipay balance'
  },
  payTime: {
    type: DataTypes.DATE,
    comment: '支付时间'
  },
  deliveryType: {
    type: DataTypes.STRING(20),
    comment: '配送方式 express pickup'
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: '运费（分）'
  },
  receiverName: {
    type: DataTypes.STRING(50),
    comment: '收货人姓名'
  },
  receiverMobile: {
    type: DataTypes.STRING(20),
    comment: '收货人电话'
  },
  receiverAddress: {
    type: DataTypes.STRING(500),
    comment: '收货地址'
  },
  remark: {
    type: DataTypes.STRING(500),
    comment: '订单备注'
  },
  cancelReason: {
    type: DataTypes.STRING(200),
    comment: '取消原因'
  }
}, {
  tableName: 'orders',
  comment: '订单表',
  indexes: [
    { fields: ['orderNo'] },
    { fields: ['userId'] },
    { fields: ['status'] }
  ]
})

module.exports = Order
