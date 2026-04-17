/**
 * 通用工具模块
 * 提供常用的业务工具函数
 */

const WXAPI = require('apifm-wxapi')

/**
 * 显示购物车 tabBar Badge
 * @param {boolean} noTabBarPage - 当前页面是否为无 tabBar 页面
 * @returns {Promise<number>} 购物车商品总数
 */
async function showTabBarBadge(noTabBarPage) {
  const token = wx.getStorageSync('token')
  if (!token) {
    return 0
  }
  
  let totalNumber = 0
  
  try {
    // 自营商品购物车
    const res1 = await WXAPI.shippingCarInfo(token)
    if (res1.code === 0) {
      totalNumber += res1.data.number
    }
    
    // VOP 购物车
    const shoppingCartVopOpen = wx.getStorageSync('shopping_cart_vop_open')
    if (shoppingCartVopOpen === '1') {
      const res2 = await WXAPI.jdvopCartInfoV2(token)
      if (res2.code === 0) {
        totalNumber += res2.data.number
      }
    }
    
    // 更新 tabBar badge
    if (!noTabBarPage) {
      if (totalNumber === 0) {
        wx.removeTabBarBadge({
          index: 3,
          fail: console.error
        })
      } else {
        wx.setTabBarBadge({
          index: 3,
          text: String(totalNumber),
          fail: console.error
        })
      }
    }
    
    return totalNumber
  } catch (error) {
    console.error('获取购物车数量失败:', error)
    return 0
  }
}

/**
 * 格式化日期时间
 * @param {Date|string|number} date - 日期对象/字符串/时间戳
 * @param {string} format - 格式模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {number} decimals - 小数位数，默认 2
 * @returns {string} 格式化后的金额字符串
 */
function formatMoney(amount, decimals = 2) {
  if (amount === null || amount === undefined) return '0.00'
  return Number(amount).toFixed(decimals)
}

/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间，默认 300ms
 * @returns {Function} 防抖后的函数
 */
function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn - 需要节流的函数
 * @param {number} interval - 间隔时间，默认 300ms
 * @returns {Function} 节流后的函数
 */
function throttle(fn, interval = 300) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
function validatePhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

module.exports = {
  showTabBarBadge,
  formatDate,
  formatMoney,
  debounce,
  throttle,
  validatePhone
}
