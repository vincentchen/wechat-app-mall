/**
 * 认证路由
 */
const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth')
const { auth, optionalAuth } = require('../middleware/auth')

// 公开路由（无需登录）
router.post('/login', AuthController.login)

// 需要登录的路由
router.get('/me', auth, AuthController.getMe)
router.post('/bind-phone', auth, AuthController.bindPhone)
router.post('/logout', auth, AuthController.logout)

module.exports = router
