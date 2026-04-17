/**
 * 存储工具模块
 * 封装 wx 存储 API，统一管理本地存储操作
 */

const STORAGE_KEYS = {
  TOKEN: 'token',
  UID: 'uid',
  OPENID: 'openid',
  MOBILE: 'mobile',
  REFERRER: 'referrer',
  SHOP_INFO: 'shopInfo',
  MALL_NAME: 'mallName'
}

/**
 * 设置存储
 * @param {string} key - 键名
 * @param {any} value - 值
 */
function set(key, value) {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (error) {
    console.error('存储失败:', key, error)
    return false
  }
}

/**
 * 获取存储
 * @param {string} key - 键名
 * @returns {any} 存储的值
 */
function get(key) {
  try {
    return wx.getStorageSync(key)
  } catch (error) {
    console.error('获取存储失败:', key, error)
    return null
  }
}

/**
 * 删除存储
 * @param {string} key - 键名
 */
function remove(key) {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (error) {
    console.error('删除存储失败:', key, error)
    return false
  }
}

/**
 * 清空所有存储
 */
function clear() {
  try {
    wx.clearStorageSync()
    return true
  } catch (error) {
    console.error('清空存储失败:', error)
    return false
  }
}

/**
 * 用户相关存储方法
 */
const user = {
  setToken(token) {
    return set(STORAGE_KEYS.TOKEN, token)
  },
  getToken() {
    return get(STORAGE_KEYS.TOKEN)
  },
  removeToken() {
    return remove(STORAGE_KEYS.TOKEN)
  },
  
  setUid(uid) {
    return set(STORAGE_KEYS.UID, uid)
  },
  getUid() {
    return get(STORAGE_KEYS.UID)
  },
  
  setOpenid(openid) {
    return set(STORAGE_KEYS.OPENID, openid)
  },
  getOpenid() {
    return get(STORAGE_KEYS.OPENID)
  },
  
  setMobile(mobile) {
    return set(STORAGE_KEYS.MOBILE, mobile)
  },
  getMobile() {
    return get(STORAGE_KEYS.MOBILE)
  },
  
  setReferrer(referrer) {
    return set(STORAGE_KEYS.REFERRER, referrer)
  },
  getReferrer() {
    return get(STORAGE_KEYS.REFERRER)
  },
  
  // 保存用户登录信息
  setLoginInfo({ token, uid, openid, mobile }) {
    const results = []
    if (token !== undefined) results.push(this.setToken(token))
    if (uid !== undefined) results.push(this.setUid(uid))
    if (openid !== undefined) results.push(this.setOpenid(openid))
    if (mobile !== undefined) results.push(this.setMobile(mobile))
    return results.every(r => r)
  },
  
  // 清除用户登录信息
  clearLoginInfo() {
    this.removeToken()
    this.remove(STORAGE_KEYS.UID)
    this.remove(STORAGE_KEYS.OPENID)
    this.remove(STORAGE_KEYS.MOBILE)
  }
}

/**
 * 配置相关存储方法
 */
const config = {
  setMallName(name) {
    return set(STORAGE_KEYS.MALL_NAME, name)
  },
  getMallName() {
    return get(STORAGE_KEYS.MALL_NAME)
  },
  
  setShopInfo(info) {
    return set(STORAGE_KEYS.SHOP_INFO, info)
  },
  getShopInfo() {
    return get(STORAGE_KEYS.SHOP_INFO)
  },
  
  removeShopInfo() {
    return remove(STORAGE_KEYS.SHOP_INFO)
  }
}

module.exports = {
  STORAGE_KEYS,
  set,
  get,
  remove,
  clear,
  user,
  config
}
