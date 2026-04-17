/**
 * 网络请求工具模块
 * 封装 wx.request，统一处理请求响应和错误
 */

const CONFIG = require('../config.js')

/**
 * 默认请求配置
 */
const DEFAULT_OPTIONS = {
  method: 'GET',
  timeout: 10000,
  showLoading: true,
  loadingTitle: '加载中...'
}

/**
 * 请求拦截器
 * @param {Object} options - 请求配置
 * @returns {Object} 处理后的请求配置
 */
function requestInterceptor(options) {
  // 添加 token
  const token = wx.getStorageSync('token')
  if (token) {
    options.header = options.header || {}
    options.header['Authorization'] = `Bearer ${token}`
  }
  
  // 添加默认参数
  options.data = options.data || {}
  
  return options
}

/**
 * 响应拦截器
 * @param {Object} response - 响应数据
 * @returns {Promise} 处理后的响应
 */
function responseInterceptor(response) {
  return new Promise((resolve, reject) => {
    const { data, statusCode } = response
    
    // HTTP 状态码检查
    if (statusCode !== 200) {
      console.error('HTTP 错误:', statusCode)
      reject({ code: statusCode, msg: '网络请求失败' })
      return
    }
    
    // 业务状态码检查
    if (data.code === undefined) {
      resolve(data)
      return
    }
    
    // 根据业务码处理
    switch (data.code) {
      case 0:
        // 成功
        resolve(data)
        break
      case 10000:
        // 需要注册
        resolve(data)
        break
      case 401:
        // 未授权，清除登录状态
        wx.removeStorageSync('token')
        wx.removeStorageSync('uid')
        reject(data)
        break
      default:
        // 其他错误
        if (data.msg) {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        reject(data)
        break
    }
  })
}

/**
 * 封装的 request 方法
 * @param {Object} options - 请求配置
 * @returns {Promise} 请求结果
 */
function request(options) {
  return new Promise((resolve, reject) => {
    // 合并默认配置
    const finalOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      header: {
        'Content-Type': 'application/json',
        ...(options.header || {})
      }
    }
    
    // 请求拦截
    const interceptedOptions = requestInterceptor(finalOptions)
    
    // 显示加载提示
    if (interceptedOptions.showLoading) {
      wx.showLoading({
        title: interceptedOptions.loadingTitle,
        mask: true
      })
    }
    
    wx.request({
      ...interceptedOptions,
      success: async (response) => {
        // 隐藏加载提示
        if (interceptedOptions.showLoading) {
          wx.hideLoading()
        }
        
        try {
          // 响应拦截
          const result = await responseInterceptor(response)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      },
      fail: (error) => {
        // 隐藏加载提示
        if (interceptedOptions.showLoading) {
          wx.hideLoading()
        }
        
        console.error('请求失败:', error)
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
          duration: 2000
        })
        reject({ code: -1, msg: error.errMsg || '网络请求失败' })
      }
    })
  })
}

/**
 * 快捷请求方法
 */
const http = {
  get(url, data, options = {}) {
    return request({ url, data, method: 'GET', ...options })
  },
  
  post(url, data, options = {}) {
    return request({ url, data, method: 'POST', ...options })
  },
  
  put(url, data, options = {}) {
    return request({ url, data, method: 'PUT', ...options })
  },
  
  delete(url, data, options = {}) {
    return request({ url, data, method: 'DELETE', ...options })
  }
}

module.exports = {
  request,
  http,
  requestInterceptor,
  responseInterceptor
}
