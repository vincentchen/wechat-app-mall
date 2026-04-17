/**
 * 订单路由
 */
const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/order')
const { auth } = require('../middleware/auth')

// 所有订单接口都需要登录
router.use(auth)

router.get('/', OrderController.list)
router.get('/:id', OrderController.detail)
router.post('/', OrderController.create)
router.put('/:id/cancel', OrderController.cancel)

module.exports = router
