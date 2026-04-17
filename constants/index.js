/**
 * 常量定义模块
 * 集中管理项目中使用的常量
 */

// 存储键名常量
const STORAGE_KEYS = {
  TOKEN: 'token',
  UID: 'uid',
  OPENID: 'openid',
  MOBILE: 'mobile',
  REFERRER: 'referrer',
  SHOP_INFO: 'shopInfo',
  MALL_NAME: 'mallName'
}

// API 响应码常量
const RESPONSE_CODE = {
  SUCCESS: 0,
  NEED_REGISTER: 10000,
  NOT_FOUND: 404,
  ERROR: 700
}

// 业务类型常量
const PAY_TYPE = {
  ORDER: 'order',
  RECHARGE: 'recharge',
  PAYBILL: 'paybill',
  FXS_BUY: 'fxsBuy',
  PAY_TZ: 'payTz'
}

// 商品供应类型
const SUPPLY_TYPE = {
  JD_CPS: 'cps_jd',
  JD_VOP: 'vop_jd',
  PDD_CPS: 'cps_pdd',
  TAOBAO_CPS: 'cps_taobao'
}

// 默认分页配置
const DEFAULT_PAGE = {
  NUM: 1,
  SIZE: 20
}

module.exports = {
  STORAGE_KEYS,
  RESPONSE_CODE,
  PAY_TYPE,
  SUPPLY_TYPE,
  DEFAULT_PAGE
}
