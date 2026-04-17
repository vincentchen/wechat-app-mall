# 代码重构说明

## 重构概述

本次重构对微信小程序商城项目进行了模块化改造，主要目标是：
- 提高代码可维护性和可读性
- 统一代码风格和规范
- 增强错误处理机制
- 优化代码结构

## 新增模块

### 1. 常量模块 (`constants/index.js`)
集中管理项目中使用的常量，包括：
- `STORAGE_KEYS`: 本地存储键名
- `RESPONSE_CODE`: API 响应码
- `PAY_TYPE`: 支付类型
- `SUPPLY_TYPE`: 商品供应类型
- `DEFAULT_PAGE`: 默认分页配置

**使用示例：**
```javascript
const { STORAGE_KEYS, RESPONSE_CODE } = require('../../constants/index.js')

// 获取 token
const token = wx.getStorageSync(STORAGE_KEYS.TOKEN)
```

### 2. 存储工具模块 (`utils/storage.js`)
封装微信存储 API，提供统一的存储操作接口：

**主要功能：**
- 基础存储操作：`set`, `get`, `remove`, `clear`
- 用户存储操作：`storage.user.setToken()`, `storage.user.getToken()` 等
- 配置存储操作：`storage.config.setMallName()`, `storage.config.getShopInfo()` 等

**使用示例：**
```javascript
const STORAGE = require('../../utils/storage.js')

// 保存 token
STORAGE.user.setToken('your-token')

// 获取 token
const token = STORAGE.user.getToken()

// 清除登录信息
STORAGE.user.clearLoginInfo()
```

### 3. 网络请求模块 (`utils/request.js`)
封装微信 request API，提供统一的网络请求处理：

**主要功能：**
- 请求拦截器：自动添加 token、默认参数
- 响应拦截器：统一处理响应码、错误提示
- 快捷方法：`http.get()`, `http.post()`, `http.put()`, `http.delete()`

**使用示例：**
```javascript
const { http } = require('../../utils/request.js')

// GET 请求
const res = await http.get('/api/user', { id: 1 })

// POST 请求
const res = await http.post('/api/order', { orderId: 123 })
```

### 4. 认证工具模块 (`utils/auth.js`) - 重构版
优化用户认证相关功能：

**主要功能：**
- `checkHasLogined()`: 检查登录状态
- `login20241025()`: 微信登录并自动注册
- `authorize()`: 授权登录
- `loginOut()`: 退出登录
- `checkAndAuthorize(scope)`: 检查并请求授权
- `bindSeller()`: 绑定推荐人

**改进点：**
- 使用新的 storage 模块管理 token
- 统一的错误处理
- 更清晰的函数命名和注释

**使用示例：**
```javascript
const AUTH = require('../../utils/auth.js')

// 检查登录状态
const isLogined = await AUTH.checkHasLogined()

// 登录
const res = await AUTH.login20241025()

// 退出登录
AUTH.loginOut()
```

### 5. 支付工具模块 (`utils/pay.js`) - 重构版
优化支付相关功能：

**主要功能：**
- `wxpay()`: 通用支付方法
- `payment.payOrder()`: 订单支付
- `payment.recharge()`: 充值
- `payment.payBill()`: 优惠买单
- `payment.buyFxs()`: 购买分销资格
- `payment.payTz()`: 购买团长

**改进点：**
- 使用常量定义支付类型
- 参数构建逻辑分离
- 统一的错误处理
- 返回 Promise 便于异步处理

**使用示例：**
```javascript
const PAY = require('../../utils/pay.js')

// 订单支付
await PAY.payment.payOrder(orderId, money, redirectUrl)

// 充值
await PAY.payment.recharge(amount, redirectUrl, '充值备注')
```

### 6. 通用工具模块 (`utils/tools.js`) - 重构版
提供常用业务工具函数：

**主要功能：**
- `showTabBarBadge()`: 显示购物车 tabBar 角标
- `formatDate()`: 格式化日期时间
- `formatMoney()`: 格式化金额
- `debounce()`: 防抖函数
- `throttle()`: 节流函数
- `validatePhone()`: 验证手机号

**改进点：**
- 增加常用工具函数
- 改进错误处理
- 添加详细注释

**使用示例：**
```javascript
const TOOLS = require('../../utils/tools.js')

// 更新购物车角标
await TOOLS.showTabBarBadge()

// 格式化日期
const dateStr = TOOLS.formatDate(new Date(), 'YYYY-MM-DD')

// 格式化金额
const moneyStr = TOOLS.formatMoney(99.9)
```

## 代码规范建议

### 1. 文件组织
```
/workspace
├── constants/          # 常量定义
│   └── index.js
├── utils/             # 工具模块
│   ├── storage.js     # 存储工具
│   ├── request.js     # 网络请求
│   ├── auth.js        # 认证工具
│   ├── pay.js         # 支付工具
│   └── tools.js       # 通用工具
├── pages/             # 页面文件
└── components/        # 组件文件
```

### 2. 命名规范
- 常量：大写字母 + 下划线，如 `STORAGE_KEYS`
- 函数：小驼峰命名，如 `checkHasLogined`
- 文件：小写字母 + 下划线，如 `address_parse.js`

### 3. 注释规范
- 每个模块文件顶部添加文件说明
- 函数添加 JSDoc 风格注释
- 复杂逻辑添加行内注释

### 4. 错误处理
- 使用 try-catch 处理异步错误
- 统一错误提示格式
- 记录错误日志便于调试

## 迁移指南

### 从旧代码迁移到新代码

#### 1. 存储操作迁移
**旧代码：**
```javascript
wx.setStorageSync('token', res.data.token)
const token = wx.getStorageSync('token')
wx.removeStorageSync('token')
```

**新代码：**
```javascript
STORAGE.user.setToken(res.data.token)
const token = STORAGE.user.getToken()
STORAGE.user.removeToken()
```

#### 2. 登录检查迁移
**旧代码：**
```javascript
AUTH.checkHasLogined().then(isLogined => {
  if (isLogined) {
    // 已登录逻辑
  }
})
```

**新代码：**
```javascript
const isLogined = await AUTH.checkHasLogined()
if (isLogined) {
  // 已登录逻辑
}
```

#### 3. 支付迁移
**旧代码：**
```javascript
PAY.wxpay('order', money, orderId, redirectUrl)
```

**新代码：**
```javascript
await PAY.payment.payOrder(orderId, money, redirectUrl)
```

## 后续优化建议

1. **TypeScript 迁移**: 考虑使用 TypeScript 增强类型安全
2. **单元测试**: 为工具模块添加单元测试
3. **性能优化**: 对频繁调用的函数进行缓存优化
4. **代码分割**: 进一步拆分大型工具模块
5. **文档完善**: 补充 API 文档和使用示例

## 注意事项

1. 新代码使用了 async/await，确保运行环境支持 ES2017+
2. 部分 API 依赖微信开发者工具的基础库版本
3. 建议在开发环境充分测试后再上线
4. 保持向后兼容，旧代码仍可正常使用

## 联系方式

如有问题或建议，请联系开发团队。
