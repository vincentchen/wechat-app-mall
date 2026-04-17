/**
 * 统一响应处理工具
 */

/**
 * 成功响应
 * @param {Object} res - Express 响应对象
 * @param {*} data - 响应数据
 * @param {string} message - 成功消息
 * @param {number} code - 状态码
 */
function success(res, data = null, message = 'success', code = 0) {
  return res.json({
    code,
    msg: message,
    data,
    timestamp: Date.now()
  })
}

/**
 * 错误响应
 * @param {Object} res - Express 响应对象
 * @param {string} message - 错误消息
 * @param {number} code - 错误码
 * @param {*} data - 附加数据
 */
function error(res, message = 'error', code = -1, data = null) {
  return res.json({
    code,
    msg: message,
    data,
    timestamp: Date.now()
  })
}

/**
 * 分页响应
 * @param {Object} res - Express 响应对象
 * @param {Array} list - 数据列表
 * @param {number} total - 总数
 * @param {number} page - 当前页
 * @param {number} pageSize - 每页数量
 * @param {string} message - 成功消息
 */
function page(res, list = [], total = 0, page = 1, pageSize = 10, message = 'success') {
  return res.json({
    code: 0,
    msg: message,
    data: {
      list,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    },
    timestamp: Date.now()
  })
}

module.exports = {
  success,
  error,
  page
}
