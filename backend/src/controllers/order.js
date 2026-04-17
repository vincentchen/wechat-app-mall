/**
 * 订单控制器
 */
const { Order, User } = require('../models')
const { sequelize } = require('../config/database')
const response = require('../utils/response')
const log = require('../utils/logger')

class OrderController {
  /**
   * 获取订单列表
   * GET /api/orders
   */
  static async list(req, res) {
    try {
      const { 
        page = 1, 
        pageSize = 10, 
        status 
      } = req.query

      const where = { userId: req.user.id }

      if (status !== undefined && status !== '') {
        where.status = parseInt(status)
      }

      const result = await Order.findAndCountAll({
        where,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'nick', 'avatarUrl']
        }],
        order: [['id', 'DESC']],
        limit: parseInt(pageSize),
        offset: (parseInt(page) - 1) * parseInt(pageSize)
      })

      return response.page(
        res,
        result.rows,
        result.count,
        parseInt(page),
        parseInt(pageSize)
      )
    } catch (error) {
      log.error('order list error', { error: error.message })
      return response.error(res, error.message || '获取订单列表失败', 500)
    }
  }

  /**
   * 获取订单详情
   * GET /api/orders/:id
   */
  static async detail(req, res) {
    try {
      const { id } = req.params

      const order = await Order.findOne({
        where: { 
          id,
          userId: req.user.id 
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'nick', 'avatarUrl']
        }]
      })

      if (!order) {
        return response.error(res, '订单不存在', 404)
      }

      return response.success(res, order)
    } catch (error) {
      log.error('order detail error', { error: error.message })
      return response.error(res, error.message || '获取订单详情失败', 500)
    }
  }

  /**
   * 创建订单
   * POST /api/orders
   */
  static async create(req, res) {
    const transaction = await sequelize.transaction()
    
    try {
      const { 
        products, 
        totalAmount, 
        payAmount,
        receiverName,
        receiverMobile,
        receiverAddress,
        remark 
      } = req.body

      if (!products || !Array.isArray(products) || products.length === 0) {
        return response.error(res, '请选择商品', 400)
      }

      // 生成订单号
      const orderNo = this.generateOrderNo()

      // 创建订单
      const order = await Order.create({
        orderNo,
        userId: req.user.id,
        totalAmount,
        payAmount,
        status: 0, // 待支付
        receiverName,
        receiverMobile,
        receiverAddress,
        remark
      }, { transaction })

      // TODO: 创建订单商品明细（需要 OrderItem 模型）
      // await OrderItem.bulkCreate(...)

      await transaction.commit()

      return response.success(res, {
        orderId: order.id,
        orderNo: order.orderNo
      }, '订单创建成功')
    } catch (error) {
      await transaction.rollback()
      log.error('order create error', { error: error.message })
      return response.error(res, error.message || '创建订单失败', 500)
    }
  }

  /**
   * 取消订单
   * PUT /api/orders/:id/cancel
   */
  static async cancel(req, res) {
    try {
      const { id } = req.params
      const { reason } = req.body

      const order = await Order.findOne({
        where: { 
          id,
          userId: req.user.id 
        }
      })

      if (!order) {
        return response.error(res, '订单不存在', 404)
      }

      if (order.status !== 0) {
        return response.error(res, '只能取消待支付订单', 400)
      }

      await order.update({
        status: 4,
        cancelReason: reason || '用户取消'
      })

      return response.success(res, null, '订单已取消')
    } catch (error) {
      log.error('order cancel error', { error: error.message })
      return response.error(res, error.message || '取消订单失败', 500)
    }
  }

  /**
   * 生成订单号
   */
  static generateOrderNo() {
    const date = new Date()
    const timestamp = date.getTime()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${timestamp}${random}`
  }
}

module.exports = OrderController
