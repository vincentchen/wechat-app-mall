# 微信小程序商城后台管理系统

配套前端项目 `wechat-app-mall` 的 Node.js 后台服务，提供完整的 API 接口支持。

## 📋 功能特性

- ✅ **用户认证** - 微信小程序登录、JWT Token 认证
- ✅ **商品管理** - 商品列表、详情、推荐商品
- ✅ **订单管理** - 订单创建、查询、取消
- ✅ **微信集成** - 微信登录、手机号获取、模板消息
- ✅ **数据安全** - JWT 认证、CORS、Helmet 安全中间件
- ✅ **日志记录** - Winston 日志系统
- ✅ **数据库 ORM** - Sequelize + MySQL

## 🚀 快速开始

### 1. 环境要求

- Node.js >= 14.0.0
- MySQL >= 5.7
- Redis (可选，用于 session 存储)

### 2. 安装依赖

```bash
cd backend
npm install
```

### 3. 配置环境变量

复制环境变量示例文件并修改：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下关键参数：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wechat_mall
DB_USER=root
DB_PASSWORD=your_password

# 微信小程序配置
WECHAT_APP_ID=your_app_id
WECHAT_APP_SECRET=your_app_secret

# JWT 配置
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

### 4. 创建数据库

```sql
CREATE DATABASE wechat_mall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. 启动服务

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## 📁 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件
│   │   ├── index.js     # 主配置
│   │   └── database.js  # 数据库配置
│   ├── controllers/     # 控制器层
│   │   ├── auth.js      # 认证控制器
│   │   ├── product.js   # 商品控制器
│   │   └── order.js     # 订单控制器
│   ├── middleware/      # 中间件
│   │   ├── auth.js      # JWT 认证中间件
│   │   └── error.js     # 错误处理中间件
│   ├── models/          # 数据模型
│   │   ├── User.js      # 用户模型
│   │   ├── Product.js   # 商品模型
│   │   ├── Order.js     # 订单模型
│   │   └── index.js     # 模型索引
│   ├── routes/          # 路由配置
│   │   ├── index.js     # 主路由
│   │   ├── auth.js      # 认证路由
│   │   ├── product.js   # 商品路由
│   │   └── order.js     # 订单路由
│   ├── services/        # 业务服务层
│   │   ├── AuthService.js    # 认证服务
│   │   └── WechatService.js  # 微信服务
│   ├── utils/           # 工具函数
│   │   ├── logger.js    # 日志工具
│   │   └── response.js  # 响应工具
│   └── app.js           # 应用入口
├── uploads/             # 上传文件目录
├── logs/                # 日志文件目录
├── .env.example         # 环境变量示例
├── package.json
└── README.md
```

## 🔌 API 接口文档

### 基础 URL
```
http://localhost:3000/api
```

### 认证接口

#### 1. 微信登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "code": "微信登录 code",
  "userInfo": {
    "nickName": "用户昵称",
    "avatarUrl": "头像 URL",
    "gender": 1
  }
}
```

响应：
```json
{
  "code": 0,
  "msg": "登录成功",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": 1,
      "nick": "用户昵称",
      "avatarUrl": "头像 URL",
      "mobile": "13800138000",
      "gender": 1
    }
  }
}
```

#### 2. 获取当前用户信息
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### 3. 退出登录
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### 商品接口

#### 1. 获取商品列表
```http
GET /api/products?page=1&pageSize=10&categoryId=1&keyword=手机
```

#### 2. 获取商品详情
```http
GET /api/products/:id
```

#### 3. 获取推荐商品
```http
GET /api/products/recommend?limit=10
```

### 订单接口

#### 1. 获取订单列表
```http
GET /api/orders?page=1&pageSize=10&status=1
Authorization: Bearer {token}
```

#### 2. 获取订单详情
```http
GET /api/orders/:id
Authorization: Bearer {token}
```

#### 3. 创建订单
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "products": [
    {"productId": 1, "quantity": 2}
  ],
  "totalAmount": 9900,
  "payAmount": 9900,
  "receiverName": "张三",
  "receiverMobile": "13800138000",
  "receiverAddress": "北京市朝阳区 xxx",
  "remark": "请尽快发货"
}
```

#### 4. 取消订单
```http
PUT /api/orders/:id/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "不想要了"
}
```

### 健康检查
```http
GET /api/health
```

## 🔐 响应格式

所有接口统一返回格式：

**成功响应：**
```json
{
  "code": 0,
  "msg": "success",
  "data": {},
  "timestamp": 1234567890
}
```

**错误响应：**
```json
{
  "code": 400,
  "msg": "错误信息",
  "data": null,
  "timestamp": 1234567890
}
```

**分页响应：**
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 10,
      "totalPages": 10
    }
  },
  "timestamp": 1234567890
}
```

## 🛠️ 开发指南

### 添加新的 API 接口

1. 在 `src/models/` 创建数据模型
2. 在 `src/services/` 编写业务逻辑
3. 在 `src/controllers/` 创建控制器
4. 在 `src/routes/` 配置路由

### 数据库迁移

开发环境下会自动同步数据库结构（`alter` 模式）。

生产环境建议使用 Sequelize migrations：

```bash
npx sequelize-cli migration:generate --name create_table_name
npx sequelize-cli db:migrate
```

## 📝 注意事项

1. **生产环境**务必修改 `.env` 中的默认密钥
2. **微信小程序配置**需要填写正确的 AppID 和 AppSecret
3. **数据库连接**请确保 MySQL 服务已启动
4. **跨域配置**在生产环境需要修改为实际域名

## 🔄 与前端项目对接

前端项目需要修改 `config.js` 中的 API 地址：

```javascript
module.exports = {
  // ...其他配置
  apiBaseUrl: 'http://localhost:3000/api'
}
```

并在 `utils/request.js` 中配置正确的请求地址。

## 📄 License

ISC
