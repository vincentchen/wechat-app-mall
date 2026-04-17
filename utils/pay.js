/**
 * 支付工具模块
 * 处理各种支付场景
 */

const WXAPI = require('apifm-wxapi')

// 支付类型常量
const PAY_TYPE = {
  ORDER: 'order',       // 订单支付
  RECHARGE: 'recharge', // 充值
  PAYBILL: 'paybill',   // 优惠买单
  FXS_BUY: 'fxsBuy',    // 购买分销资格
  PAY_TZ: 'payTz'       // 购买团长
}

/**
 * 构建支付参数
 * @param {string} type - 支付类型
 * @param {number} money - 金额
 * @param {string|number} orderId - 订单 ID
 * @param {Object} data - 扩展数据
 * @param {string} content - 备注内容
 * @returns {Object} 支付参数对象
 */
function buildPayParams(type, money, orderId, data, content) {
  const params = {
    token: wx.getStorageSync('token'),
    money: money,
    remark: '在线充值',
    content: content || '',
    payName: ''
  }
  
  switch (type) {
    case PAY_TYPE.ORDER:
      params.remark = `支付订单：${orderId}`
      params.nextAction = JSON.stringify({
        type: 0,
        id: orderId
      })
      break
      
    case PAY_TYPE.PAYBILL:
      params.remark = `优惠买单：${data.money}`
      params.nextAction = JSON.stringify({
        type: 4,
        uid: wx.getStorageSync('uid'),
        money: data.money
      })
      break
      
    case PAY_TYPE.FXS_BUY:
      params.remark = '购买分销资格'
      params.nextAction = JSON.stringify({
        type: 13
      })
      break
      
    case PAY_TYPE.PAY_TZ:
      params.remark = `购买团长：${money}`
      params.nextAction = JSON.stringify({
        type: 14
      })
      break
      
    default:
      params.remark = '在线充值'
      break
  }
  
  params.payName = params.remark
  
  return params
}

/**
 * 发起微信支付
 * @param {string} type - 支付类型
 * @param {number} money - 金额
 * @param {string|number} orderId - 订单 ID
 * @param {string} redirectUrl - 支付成功跳转地址
 * @param {Object} data - 扩展数据
 * @param {string} content - 备注内容
 * @returns {Promise<Object>} 支付结果
 */
async function wxpay(type, money, orderId, redirectUrl, data, content) {
  try {
    const params = buildPayParams(type, money, orderId, data, content)
    
    // 获取支付 API URL
    const payApiUrl = wx.getStorageSync('wxpay_api_url') || '/pay/wx/wxapp'
    
    // 调用支付接口
    const res = await WXAPI.payVariableUrl(payApiUrl, params)
    
    if (res.code !== 0) {
      throw new Error(res.msg || '支付失败')
    }
    
    // 发起微信支付
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        success() {
          wx.showToast({
            title: '支付成功',
            icon: 'success'
          })
          
          // 跳转页面
          if (redirectUrl) {
            wx.redirectTo({
              url: redirectUrl
            })
          }
          
          resolve({ success: true, message: '支付成功' })
        },
        fail(err) {
          console.error('支付失败:', err)
          wx.showToast({
            title: '支付失败：' + (err.errMsg || '未知错误'),
            icon: 'none'
          })
          reject({ success: false, message: err.errMsg || '支付失败' })
        }
      })
    })
  } catch (error) {
    console.error('支付异常:', error)
    wx.showModal({
      title: '出错了',
      content: error.message || JSON.stringify(error),
      showCancel: false
    })
    throw error
  }
}

/**
 * 快捷支付方法
 */
const payment = {
  // 订单支付
  payOrder(orderId, money, redirectUrl) {
    return wxpay(PAY_TYPE.ORDER, money, orderId, redirectUrl)
  },
  
  // 充值
  recharge(money, redirectUrl, content) {
    return wxpay(PAY_TYPE.RECHARGE, money, null, redirectUrl, null, content)
  },
  
  // 优惠买单
  payBill(money, redirectUrl) {
    return wxpay(PAY_TYPE.PAYBILL, money, null, redirectUrl, { money })
  },
  
  // 购买分销资格
  buyFxs(money, redirectUrl) {
    return wxpay(PAY_TYPE.FXS_BUY, money, null, redirectUrl)
  },
  
  // 购买团长
  payTz(money, redirectUrl) {
    return wxpay(PAY_TYPE.PAY_TZ, money, null, redirectUrl)
  }
}

module.exports = {
  wxpay,
  payment,
  PAY_TYPE,
  buildPayParams
}
