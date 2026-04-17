/**
 * 主应用入口
 */
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')

const config = require('./config')
const { testConnection } = require('./config/database')
const log = require('./utils/logger')
const { notFound, errorHandler } = require('./middleware/error')
const routes = require('./routes')

// 初始化模型
const { initModels } = require('./models')

async function bootstrap() {
  const app = express()

  // 安全中间件
  app.use(helmet({
    contentSecurityPolicy: false // 开发环境禁用 CSP
  }))

  // CORS 配置
  app.use(cors(config.cors))

  // 请求日志
  if (config.server.env === 'development') {
    app.use(morgan('dev'))
  } else {
    app.use(log.http)
  }

  // 解析 JSON 请求体
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  // 静态文件服务（上传的文件）
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

  // API 路由
  app.use('/api', routes)

  // 404 处理
  app.use(notFound)

  // 全局错误处理
  app.use(errorHandler)

  // 启动服务器
  try {
    // 测试数据库连接
    await testConnection()
    
    // 同步数据库模型
    await initModels()

    const server = app.listen(config.server.port, () => {
      log.info(`🚀 服务器启动成功`, {
        port: config.server.port,
        env: config.server.env,
        url: `http://localhost:${config.server.port}`
      })
      console.log(`
╔════════════════════════════════════════════╗
║          微信小程序商城后台服务             ║
╠════════════════════════════════════════════╣
║  环境：${config.server.env.padEnd(24)}║
║  端口：${String(config.server.port).padEnd(24)}║
║  地址：http://localhost:${String(config.server.port).padEnd(16)}║
╚════════════════════════════════════════════╝
      `)
    })

    // 优雅关闭
    process.on('SIGTERM', () => {
      log.info('收到 SIGTERM 信号，正在关闭服务器...')
      server.close(() => {
        log.info('服务器已关闭')
        process.exit(0)
      })
    })

    process.on('SIGINT', () => {
      log.info('收到 SIGINT 信号，正在关闭服务器...')
      server.close(() => {
        log.info('服务器已关闭')
        process.exit(0)
      })
    })

  } catch (error) {
    log.error('服务器启动失败', { error: error.message })
    process.exit(1)
  }
}

// 启动应用
bootstrap()

module.exports = bootstrap
