/**
 * JWT 认证中间件
 */
const jwt = require('jsonwebtoken')
const config = require('../config')
const response = require('../utils/response')
const log = require('../utils/logger')

/**
 * 验证 JWT token
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - 下一个中间件
 */
async function auth(req, res, next) {
  try {
    // 从 header 获取 token
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.error(res, '未提供授权令牌', 401)
    }

    const token = authHeader.split(' ')[1]

    // 验证 token
    const decoded = jwt.verify(token, config.jwt.secret)
    
    // 将用户信息附加到请求对象
    req.user = decoded
    
    next()
  } catch (error) {
    log.error('JWT 验证失败', { error: error.message })
    
    if (error.name === 'TokenExpiredError') {
      return response.error(res, '令牌已过期', 401)
    }
    
    if (error.name === 'JsonWebTokenError') {
      return response.error(res, '无效的令牌', 401)
    }
    
    return response.error(res, '认证失败', 401)
  }
}

/**
 * 可选的认证中间件（token 存在则验证，不存在则跳过）
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, config.jwt.secret)
      req.user = decoded
    }
    next()
  } catch (error) {
    // token 无效时不影响后续处理
    next()
  }
}

module.exports = {
  auth,
  optionalAuth
}
