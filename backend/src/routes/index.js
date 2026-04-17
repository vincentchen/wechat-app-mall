/**
 * 路由配置文件
 */
const express = require('express')
const authRoutes = require('./auth')
const productRoutes = require('./product')
const orderRoutes = require('./order')

const router = express.Router()

// 健康检查
router.get('/health', (req, res) => {
  res.json({ 
    code: 0, 
    msg: 'ok',
    data: {
      status: 'running',
      timestamp: Date.now()
    }
  })
})

// 认证相关路由
router.use('/auth', authRoutes)

// 商品相关路由
router.use('/products', productRoutes)

// 订单相关路由
router.use('/orders', orderRoutes)

module.exports = router
