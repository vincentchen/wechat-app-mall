# 微信小程序商城 - 前后端完整项目

本项目包含微信小程序商城的前端和后台服务，提供完整的电商解决方案。

## 📦 项目结构

```
wechat-app-mall/
├── backend/              # 后台服务项目（Node.js + Express）
│   ├── src/
│   │   ├── config/      # 配置文件
│   │   ├── controllers/ # 控制器层
│   │   ├── middleware/  # 中间件
│   │   ├── models/      # 数据模型
│   │   ├── routes/      # 路由配置
│   │   ├── services/    # 业务服务层
│   │   ├── utils/       # 工具函数
│   │   └── app.js       # 应用入口
│   ├── uploads/         # 上传文件目录
│   ├── logs/            # 日志文件目录
│   ├── .env.example     # 环境变量示例
│   ├── package.json
│   └── README.md        # 后台服务文档
├── pages/               # 小程序页面
├── components/          # 小程序组件
├── utils/               # 小程序工具函数
├── constants/           # 常量定义
├── config.js            # 小程序配置
├── app.js               # 小程序入口
└── README.md            # 本文档
```

## 🚀 快速开始

### 前端项目（微信小程序）

1. 使用微信开发者工具打开项目根目录
2. 修改 `config.js` 中的配置项
3. 编译并预览

### 后台项目（Node.js）

详细启动步骤请查看 [backend/README.md](backend/README.md)

简要步骤：

```bash
# 进入后台目录
cd backend

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env

# 编辑 .env 配置数据库和微信信息

# 启动服务
npm run dev
```

## 🔗 前后端对接

### 1. 配置前端 API 地址

修改前端 `config.js`：

```javascript
module.exports = {
  // ...其他配置
  apiBaseUrl: 'http://localhost:3000/api'  // 后台服务地址
}
```

### 2. 配置后台环境变量

修改后台 `.env`：

```env
# 微信小程序配置（与前端对应）
WECHAT_APP_ID=你的小程序 AppID
WECHAT_APP_SECRET=你的小程序 AppSecret

# 商户配置（与前端 config.js 对应）
MERCHANT_ID=951
SUB_DOMAIN=tz
```

## 📋 功能模块

### 前端功能
- ✅ 商品展示与搜索
- ✅ 购物车管理
- ✅ 订单创建与支付
- ✅ 用户中心
- ✅ 地址管理
- ✅ 优惠券系统
- ✅ 拼团/砍价活动
- ✅ 直播带货
- ✅ CMS 内容管理

### 后台功能
- ✅ 用户认证（微信登录）
- ✅ JWT Token 管理
- ✅ 商品 CRUD
- ✅ 订单管理
- ✅ 微信 API 集成
- ✅ 统一响应格式
- ✅ 错误处理
- ✅ 日志记录

## 🛠️ 技术栈

### 前端
- 微信小程序原生开发
- ES6+ JavaScript
- Vant Weapp 组件库

### 后台
- Node.js 14+
- Express 框架
- Sequelize ORM
- MySQL 数据库
- JWT 认证
- Winston 日志

## 📖 API 文档

后台服务启动后，访问健康检查接口测试：

```bash
GET http://localhost:3000/api/health
```

完整 API 文档请查看 [backend/README.md](backend/README.md#api-接口文档)

## ⚙️ 环境要求

- Node.js >= 14.0.0
- MySQL >= 5.7
- 微信开发者工具
- Redis（可选）

## 📝 开发流程

1. **需求分析** - 确定功能模块
2. **数据库设计** - 创建对应的 Model
3. **后端开发** - Service → Controller → Route
4. **前端开发** - 页面 → 组件 → 接口调用
5. **联调测试** - 前后端接口对接
6. **部署上线** - 生产环境配置

## 🔒 安全建议

1. 生产环境必须修改默认密钥
2. 开启 HTTPS
3. 配置 CORS 白名单
4. 定期更新依赖包
5. 使用环境变量管理敏感信息

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 License

ISC
