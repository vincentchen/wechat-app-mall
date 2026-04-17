/**
 * 用户模型
 */
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  wxOpenId: {
    type: DataTypes.STRING(64),
    unique: true,
    comment: '微信 openid'
  },
  unionId: {
    type: DataTypes.STRING(64),
    comment: '微信 unionid'
  },
  nick: {
    type: DataTypes.STRING(100),
    comment: '昵称'
  },
  avatarUrl: {
    type: DataTypes.STRING(500),
    comment: '头像 URL'
  },
  mobile: {
    type: DataTypes.STRING(20),
    comment: '手机号'
  },
  gender: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '性别 0-未知 1-男 2-女'
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: '状态 1-正常 0-禁用'
  },
  lastLoginTime: {
    type: DataTypes.DATE,
    comment: '最后登录时间'
  },
  registerSource: {
    type: DataTypes.STRING(50),
    defaultValue: 'miniprogram',
    comment: '注册来源'
  }
}, {
  tableName: 'users',
  comment: '用户表',
  indexes: [
    { fields: ['wxOpenId'] },
    { fields: ['mobile'] },
    { fields: ['status'] }
  ]
})

module.exports = User
