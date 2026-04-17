/**
 * 商品路由
 */
const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/product')
const { optionalAuth } = require('../middleware/auth')

// 所有商品接口都使用可选认证（登录用户可以获取个性化推荐）
router.get('/', optionalAuth, ProductController.list)
router.get('/recommend', optionalAuth, ProductController.recommend)
router.get('/:id', optionalAuth, ProductController.detail)

module.exports = router
