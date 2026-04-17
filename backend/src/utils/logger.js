/**
 * 日志工具模块
 * 使用 winston 进行日志记录
 */
const winston = require('winston')
const path = require('path')
const config = require('../config')

// 定义日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
)

// 创建日志实例
const logger = winston.createLogger({
  level: config.log.level,
  format: logFormat,
  defaultMeta: { service: 'wechat-mall-backend' },
  transports: [
    // 错误日志
    new winston.transports.File({
      filename: path.join(config.log.path, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    // 所有日志
    new winston.transports.File({
      filename: path.join(config.log.path, 'combined.log'),
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
})

// 开发环境下输出到控制台
if (config.server.env === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }))
}

// 快捷方法
const log = {
  info: (message, meta = {}) => logger.info(message, meta),
  warn: (message, meta = {}) => logger.warn(message, meta),
  error: (message, meta = {}) => logger.error(message, meta),
  debug: (message, meta = {}) => logger.debug(message, meta),
  
  // HTTP 请求日志
  http: (req, res, next) => {
    const { method, url, headers } = req
    const startTime = Date.now()
    
    res.on('finish', () => {
      const duration = Date.now() - startTime
      logger.info('HTTP Request', {
        method,
        url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: headers['user-agent'],
        ip: req.ip
      })
    })
    
    next()
  }
}

module.exports = log
