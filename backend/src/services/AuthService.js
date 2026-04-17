/**
 * 认证服务
 * 处理用户登录、注册、token 生成等
 */
const jwt = require('jsonwebtoken')
const WechatService = require('./WechatService')
const { User } = require('../models')
const config = require('../config')
const log = require('../utils/logger')

class AuthService {
  /**
   * 微信小程序登录
   * @param {string} code - 微信登录 code
   * @param {Object} userInfo - 用户信息（可选）
   */
  static async login(code, userInfo = null) {
    try {
      // 1. 通过 code 获取 openid
      const session = await WechatService.codeToSession(code)
      const { openId, unionId, sessionKey } = session

      // 2. 查找或创建用户
      let user = await User.findOne({ where: { wxOpenId: openId } })

      if (!user) {
        // 用户不存在，创建新用户
        user = await User.create({
          wxOpenId: openId,
          unionId: unionId,
          nick: userInfo?.nickName || '微信用户',
          avatarUrl: userInfo?.avatarUrl || '',
          gender: userInfo?.gender || 0,
          registerSource: 'miniprogram'
        })
        log.info('新用户注册', { userId: user.id, openId })
      } else {
        // 更新用户信息
        if (userInfo) {
          await user.update({
            nick: userInfo.nickName || user.nick,
            avatarUrl: userInfo.avatarUrl || user.avatarUrl,
            gender: userInfo.gender !== undefined ? userInfo.gender : user.gender,
            unionId: unionId || user.unionId,
            lastLoginTime: new Date()
          })
        } else {
          await user.update({ lastLoginTime: new Date() })
        }
      }

      // 3. 检查用户状态
      if (user.status === 0) {
        throw new Error('用户已被禁用')
      }

      // 4. 生成 JWT token
      const token = this.generateToken({
        id: user.id,
        openId: user.wxOpenId,
        unionId: user.unionId
      })

      return {
        token,
        user: {
          id: user.id,
          nick: user.nick,
          avatarUrl: user.avatarUrl,
          mobile: user.mobile,
          gender: user.gender
        }
      }
    } catch (error) {
      log.error('login error', { error: error.message, code })
      throw error
    }
  }

  /**
   * 绑定手机号
   * @param {number} userId - 用户 ID
   * @param {string} encryptedData - 加密数据
   * @param {string} iv - 初始向量
   * @param {string} sessionKey - 会话密钥
   */
  static async bindPhone(userId, encryptedData, iv, sessionKey) {
    try {
      // TODO: 解密手机号并保存
      // 这里需要使用微信的解密算法
      
      const user = await User.findByPk(userId)
      if (!user) {
        throw new Error('用户不存在')
      }

      // 模拟解密后的手机号（实际需要从 encryptedData 解密）
      // const phoneInfo = decryptPhoneNumber(encryptedData, sessionKey, iv)
      
      return true
    } catch (error) {
      log.error('bindPhone error', { error: error.message, userId })
      throw error
    }
  }

  /**
   * 生成 JWT token
   * @param {Object} payload - token 负载
   */
  static generateToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    })
  }

  /**
   * 验证 token
   * @param {string} token - JWT token
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret)
    } catch (error) {
      log.error('verifyToken error', { error: error.message })
      throw error
    }
  }

  /**
   * 退出登录
   * @param {string} token - 要注销的 token
   * 注意：JWT 是无状态的，通常需要在客户端删除 token
   * 如果需要服务端注销，可以使用 Redis 存储黑名单
   */
  static async logout(token) {
    // TODO: 将 token 加入黑名单（使用 Redis）
    log.info('用户退出登录')
    return true
  }
}

module.exports = AuthService
