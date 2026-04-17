/**
 * 商品控制器
 */
const { Product } = require('../models')
const response = require('../utils/response')
const log = require('../utils/logger')

class ProductController {
  /**
   * 获取商品列表
   * GET /api/products
   */
  static async list(req, res) {
    try {
      const { 
        page = 1, 
        pageSize = 10, 
        categoryId, 
        keyword,
        isRecommend 
      } = req.query

      const where = { status: 1 } // 只查询上架商品

      if (categoryId) {
        where.categoryId = categoryId
      }

      if (keyword) {
        where.name = { [require('sequelize').Op.like]: `%${keyword}%` }
      }

      if (isRecommend !== undefined) {
        where.isRecommend = isRecommend === 'true'
      }

      const result = await Product.findAndCountAll({
        where,
        order: [['sort', 'DESC'], ['id', 'DESC']],
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
      log.error('product list error', { error: error.message })
      return response.error(res, error.message || '获取商品列表失败', 500)
    }
  }

  /**
   * 获取商品详情
   * GET /api/products/:id
   */
  static async detail(req, res) {
    try {
      const { id } = req.params

      const product = await Product.findByPk(id)

      if (!product) {
        return response.error(res, '商品不存在', 404)
      }

      // 增加浏览量（可选）
      // await product.increment('viewCount')

      return response.success(res, product)
    } catch (error) {
      log.error('product detail error', { error: error.message })
      return response.error(res, error.message || '获取商品详情失败', 500)
    }
  }

  /**
   * 获取推荐商品
   * GET /api/products/recommend
   */
  static async recommend(req, res) {
    try {
      const { limit = 10 } = req.query

      const products = await Product.findAll({
        where: { 
          status: 1,
          isRecommend: true 
        },
        order: [['sort', 'DESC'], ['id', 'DESC']],
        limit: parseInt(limit)
      })

      return response.success(res, products)
    } catch (error) {
      log.error('product recommend error', { error: error.message })
      return response.error(res, error.message || '获取推荐商品失败', 500)
    }
  }
}

module.exports = ProductController
