/**
 * 微信服务
 * 处理微信小程序相关 API 调用
 */
const axios = require('axios')
const crypto = require('crypto')
const config = require('../config')
const log = require('../utils/logger')

class WechatService {
  /**
   * 获取微信 access_token
   */
  static async getAccessToken() {
    try {
      const url = 'https://api.weixin.qq.com/cgi-bin/token'
      const params = {
        grant_type: 'client_credential',
        appid: config.wechat.appId,
        secret: config.wechat.appSecret
      }

      const response = await axios.get(url, { params })
      
      if (response.data.errcode) {
        log.error('获取 access_token 失败', response.data)
        throw new Error(response.data.errmsg)
      }

      return response.data.access_token
    } catch (error) {
      log.error('getAccessToken error', { error: error.message })
      throw error
    }
  }

  /**
   * 微信登录 - 通过 code 获取 openid 和 session_key
   * @param {string} code - 小程序登录 code
   */
  static async codeToSession(code) {
    try {
      const url = 'https://api.weixin.qq.com/sns/jscode2session'
      const params = {
        appid: config.wechat.appId,
        secret: config.wechat.appSecret,
        js_code: code,
        grant_type: 'authorization_code'
      }

      const response = await axios.get(url, { params })
      
      if (response.data.errcode) {
        log.error('code2Session 失败', response.data)
        throw new Error(response.data.errmsg)
      }

      return {
        openId: response.data.openid,
        unionId: response.data.unionid || null,
        sessionKey: response.data.session_key
      }
    } catch (error) {
      log.error('codeToSession error', { error: error.message })
      throw error
    }
  }

  /**
   * 获取用户手机号（需要用户授权）
   * @param {string} code - 获取手机号的 code
   */
  static async getPhoneNumber(code) {
    try {
      const accessToken = await this.getAccessToken()
      const url = 'https://api.weixin.qq.com/wxa/business/getuserphonenumber'
      
      const response = await axios.post(url, {
        code
      }, {
        params: {
          access_token: accessToken
        }
      })

      if (response.data.errcode) {
        log.error('获取手机号失败', response.data)
        throw new Error(response.data.errmsg)
      }

      return response.data.phone_info
    } catch (error) {
      log.error('getPhoneNumber error', { error: error.message })
      throw error
    }
  }

  /**
   * 生成签名
   * @param {Object} data - 需要签名的数据
   * @param {string} sessionKey - 会话密钥
   */
  static generateSignature(data, sessionKey) {
    const sortedKeys = Object.keys(data).sort()
    const stringArray = sortedKeys.map(key => `${key}=${data[key]}`)
    const stringToSign = stringArray.join('&') + sessionKey
    return crypto.createHash('sha1').update(stringToSign).digest('hex')
  }

  /**
   * 发送模板消息
   * @param {string} openId - 用户 openid
   * @param {string} templateId - 模板 ID
   * @param {Object} data - 模板数据
   * @param {string} page - 跳转页面
   */
  static async sendTemplateMessage(openId, templateId, data, page = '') {
    try {
      const accessToken = await this.getAccessToken()
      const url = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send'

      const response = await axios.post(url, {
        touser: openId,
        template_id: templateId,
        page: page,
        miniprogram_state: 'trial',
        lang: 'zh_CN',
        data
      }, {
        params: {
          access_token: accessToken
        }
      })

      if (response.data.errcode) {
        log.error('发送模板消息失败', response.data)
        throw new Error(response.data.errmsg)
      }

      return true
    } catch (error) {
      log.error('sendTemplateMessage error', { error: error.message })
      throw error
    }
  }
}

module.exports = WechatService
