/**
 * 错误处理中间件
 */
const log = require('../utils/logger')
const response = require('../utils/response')

/**
 * 404 处理中间件
 */
function notFound(req, res, next) {
  return response.error(res, '接口不存在', 404)
}

/**
 * 全局错误处理中间件
 */
function errorHandler(err, req, res, next) {
  // 记录错误日志
  log.error('服务器错误', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  })

  // 根据错误类型返回不同响应
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }))
    return response.error(res, '参数验证失败', 400, { errors })
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return response.error(res, '数据已存在', 409)
  }

  if (err.name === 'JsonWebTokenError') {
    return response.error(res, '无效的令牌', 401)
  }

  if (err.name === 'TokenExpiredError') {
    return response.error(res, '令牌已过期', 401)
  }

  // 默认错误响应
  const statusCode = err.statusCode || err.status || 500
  const message = err.message || '服务器内部错误'
  
  return response.error(res, message, statusCode)
}

module.exports = {
  notFound,
  errorHandler
}
