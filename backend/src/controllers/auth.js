/**
 * 认证控制器
 */
const AuthService = require('../services/AuthService')
const response = require('../utils/response')
const log = require('../utils/logger')

class AuthController {
  /**
   * 微信小程序登录
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const { code, userInfo } = req.body

      if (!code) {
        return response.error(res, '缺少微信登录 code', 400)
      }

      const result = await AuthService.login(code, userInfo)

      return response.success(res, result, '登录成功')
    } catch (error) {
      log.error('login controller error', { error: error.message })
      return response.error(res, error.message || '登录失败', 500)
    }
  }

  /**
   * 绑定手机号
   * POST /api/auth/bind-phone
   */
  static async bindPhone(req, res) {
    try {
      const { encryptedData, iv } = req.body
      const userId = req.user.id

      if (!encryptedData || !iv) {
        return response.error(res, '参数不完整', 400)
      }

      // TODO: 需要从 sessionKey，这里需要从 Redis 获取
      // const sessionKey = await redis.get(`session:${userId}`)
      
      await AuthService.bindPhone(userId, encryptedData, iv, '')

      return response.success(res, null, '绑定成功')
    } catch (error) {
      log.error('bindPhone controller error', { error: error.message })
      return response.error(res, error.message || '绑定失败', 500)
    }
  }

  /**
   * 获取当前用户信息
   * GET /api/auth/me
   */
  static async getMe(req, res) {
    try {
      const { User } = require('../models')
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['wxOpenId', 'unionId'] }
      })

      if (!user) {
        return response.error(res, '用户不存在', 404)
      }

      return response.success(res, user, 'success')
    } catch (error) {
      log.error('getMe controller error', { error: error.message })
      return response.error(res, error.message || '获取失败', 500)
    }
  }

  /**
   * 退出登录
   * POST /api/auth/logout
   */
  static async logout(req, res) {
    try {
      await AuthService.logout(req.headers.authorization?.split(' ')[1])
      return response.success(res, null, '退出成功')
    } catch (error) {
      log.error('logout controller error', { error: error.message })
      return response.error(res, error.message || '退出失败', 500)
    }
  }
}

module.exports = AuthController
