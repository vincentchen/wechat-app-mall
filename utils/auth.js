/**
 * 认证工具模块
 * 处理用户登录、授权、token 管理等
 */

const WXAPI = require('apifm-wxapi')
const CONFIG = require('../config.js')
const STORAGE = require('./storage.js')

/**
 * 检查微信 session 是否有效
 * @returns {Promise<boolean>}
 */
async function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success() {
        resolve(true)
      },
      fail() {
        resolve(false)
      }
    })
  })
}

/**
 * 获取微信登录 code
 * @returns {Promise<string>}
 */
async function getWxCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res.code)
        } else {
          reject(new Error('获取 code 失败：' + res.errMsg))
        }
      },
      fail(err) {
        reject(new Error('登录失败：' + err.errMsg))
      }
    })
  })
}

/**
 * 绑定推荐人
 */
async function bindSeller() {
  const token = STORAGE.user.getToken()
  const referrer = STORAGE.user.getReferrer()
  
  if (!token || !referrer) {
    return
  }
  
  try {
    await WXAPI.bindSeller({ token, uid: referrer })
  } catch (error) {
    console.error('绑定推荐人失败:', error)
  }
}

/**
 * 检测登录状态
 * @returns {Promise<boolean>} true-已登录，false-未登录
 */
async function checkHasLogined() {
  const token = STORAGE.user.getToken()
  if (!token) {
    return false
  }
  
  // 检查微信 session
  const sessionValid = await checkSession()
  if (!sessionValid) {
    STORAGE.user.clearLoginInfo()
    return false
  }
  
  // 检查 token 有效性
  try {
    const res = await WXAPI.checkToken(token)
    if (res.code !== 0) {
      STORAGE.user.clearLoginInfo()
      return false
    }
    return true
  } catch (error) {
    console.error('检查 token 失败:', error)
    STORAGE.user.clearLoginInfo()
    return false
  }
}

/**
 * 微信登录并自动注册
 * @returns {Promise<Object>} 登录结果
 */
async function login20241025() {
  try {
    const code = await getWxCode()
    const extConfigSync = wx.getExtConfigSync()
    let res
    
    if (extConfigSync.subDomain) {
      // 服务商模式
      res = await WXAPI.wxappServiceLogin({ code })
    } else {
      // 普通模式
      res = await WXAPI.login_wx(code)
    }
    
    // 处理响应
    if (res.code === 10000) {
      // 需要注册
      return res
    }
    
    if (res.code !== 0) {
      // 登录失败
      wx.showModal({
        content: res.msg,
        showCancel: false
      })
      return res
    }
    
    // 保存登录信息
    STORAGE.user.setLoginInfo({
      token: res.data.token,
      uid: res.data.uid,
      openid: res.data.openid,
      mobile: res.data.mobile
    })
    
    // 绑定推荐人
    if (CONFIG.bindSeller) {
      await bindSeller()
    }
    
    return res
  } catch (error) {
    console.error('登录失败:', error)
    wx.showToast({
      title: '登录失败',
      icon: 'none'
    })
    throw error
  }
}

/**
 * 授权登录（用于获取用户信息）
 * @returns {Promise<Object>} 授权结果
 */
async function authorize() {
  try {
    const code = await getWxCode()
    const referrer = STORAGE.user.getReferrer() || ''
    const extConfigSync = wx.getExtConfigSync()
    
    return new Promise((resolve, reject) => {
      const apiMethod = extConfigSync.subDomain 
        ? WXAPI.wxappServiceAuthorize 
        : WXAPI.authorize
      
      apiMethod({ code, referrer }).then((res) => {
        if (res.code === 0) {
          STORAGE.user.setLoginInfo({
            token: res.data.token,
            uid: res.data.uid
          })
          resolve(res)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
          reject(new Error(res.msg))
        }
      }).catch(reject)
    })
  } catch (error) {
    console.error('授权失败:', error)
    throw error
  }
}

/**
 * 退出登录
 */
function loginOut() {
  STORAGE.user.clearLoginInfo()
}

/**
 * 检查并请求授权
 * @param {string} scope - 授权范围
 * @returns {Promise<void>}
 */
async function checkAndAuthorize(scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          // 未授权，请求授权
          wx.authorize({
            scope: scope,
            success() {
              resolve()
            },
            fail(e) {
              console.error('授权失败:', e)
              wx.showModal({
                title: '无权操作',
                content: '需要获得您的授权',
                showCancel: false,
                confirmText: '立即授权',
                confirmColor: '#e64340',
                success() {
                  wx.openSetting()
                },
                fail(err) {
                  reject(err)
                }
              })
            }
          })
        } else {
          // 已授权
          resolve()
        }
      },
      fail(err) {
        console.error('获取设置失败:', err)
        reject(err)
      }
    })
  })
}

module.exports = {
  checkSession,
  getWxCode,
  checkHasLogined,
  login20241025,
  authorize,
  loginOut,
  checkAndAuthorize,
  bindSeller
}
