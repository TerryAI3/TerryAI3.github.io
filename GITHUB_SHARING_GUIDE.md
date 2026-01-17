# 佐迪智能家具网站 - GitHub分享与交接指南

**最后更新时间**: 2026年1月17日  
**项目版本**: ef318e30  
**GitHub仓库**: https://github.com/TerryAI3/ZUODII-WEBSITE

---

## 📌 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/TerryAI3/ZUODII-WEBSITE.git
cd ZUODII-WEBSITE
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 启动开发服务器
```bash
pnpm dev
```

访问地址：http://localhost:3000

---

## 📚 项目文档

### 主要文档
- **PROJECT_WORK_LOG.md** - 完整的项目工作记录（必读）
  - 项目概述和品牌定位
  - 完整的设计规范和视觉标准
  - 技术架构和项目结构
  - 核心业务流程说明
  - API接口规范
  - 部署和运行指南

- **todo.md** - 项目任务清单
  - 已完成的功能
  - 未来增强功能

- **GITHUB_SHARING_GUIDE.md** - 本文件
  - GitHub分享指南
  - 快速开始步骤
  - 常见操作

---

## 🎯 核心功能

### 1. 首页（Home）
- Hero区：展示品牌形象和产品轮播
- 产品系列展示：8个产品分类
- 成功案例展示：真实的办公空间改造案例
- 关于我们：品牌介绍和价值主张

### 2. 产品管理后台（/admin/products）
- 产品列表查看
- 产品增加、编辑、删除
- 产品分类管理
- 支持图片上传

### 3. 案例管理后台（/admin/cases）
- 案例列表查看
- 案例增加、编辑、删除
- 支持图片上传

### 4. 用户认证
- 登录/注册功能
- 基于session的用户认证
- 管理后台权限控制

---

## 🛠️ 开发指南

### 项目结构
```
furniture-website/
├── client/                    # 前端代码
│   ├── public/
│   │   └── images/           # 静态图片
│   ├── src/
│   │   ├── pages/            # 页面组件
│   │   ├── components/       # 可复用组件
│   │   ├── App.tsx           # 路由配置
│   │   └── index.css         # 全局样式
├── server/                    # 后端代码
│   ├── routers.ts            # tRPC路由定义
│   ├── db.ts                 # 数据库查询辅助
│   └── storage.ts            # S3文件存储
├── drizzle/                   # 数据库配置
│   ├── schema.ts             # 数据库表定义
│   └── migrations/           # 数据库迁移
├── PROJECT_WORK_LOG.md       # 完整工作记录
└── package.json
```

### 常见操作

#### 添加新页面
1. 在 `client/src/pages/` 创建新组件
2. 在 `client/src/App.tsx` 中添加路由
3. 在导航栏中添加链接（如需要）

#### 修改数据库
1. 编辑 `drizzle/schema.ts`
2. 运行 `pnpm db:push` 进行迁移
3. 在 `server/db.ts` 中添加查询辅助函数

#### 添加新API接口
1. 在 `server/routers.ts` 中定义新的tRPC procedure
2. 在前端使用 `trpc.*.useQuery()` 或 `trpc.*.useMutation()` 调用

#### 上传产品和案例
1. 访问 http://localhost:3000/admin/products
2. 点击"添加产品"按钮
3. 填写产品信息和上传图片
4. 同样的流程适用于案例管理

---

## 🎨 设计规范

### 色彩方案
| 颜色 | 十六进制值 | 用途 |
|------|-----------|------|
| 深蓝色 | #08062B | Logo主色、文字 |
| 青蓝色 | #3E9FFF | 强调色、图标背景 |
| 橘色 | #FF6B35 | CTA按钮 |
| 白色 | #FFFFFF | 文字、背景 |

### Logo规范
- 位置：左上角（Hero区和导航栏）
- 设计：白色文字 + 青色点
- 背景：透明
- 文件：`/client/public/images/logo-zuodi.png`

### 字体规范
- **英文**: Montserrat（现代无衬线）
- **中文**: SimHei / Microsoft YaHei（现代黑体）

---

## 📊 数据库表结构

### users表
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255),
  password_hash VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### products表
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  image_url VARCHAR(500),
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### cases表
```sql
CREATE TABLE cases (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  completion_date DATE,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 部署指南

### 在Manus平台部署
1. 项目已配置在Manus平台
2. 所有环境变量已自动注入
3. 点击"Publish"按钮即可发布

### 自定义域名
1. 访问Manus管理后台
2. 进入"Settings" → "Domains"
3. 购买或绑定自定义域名

---

## 🔑 环境变量

项目使用以下环境变量（已自动注入）：

| 变量名 | 说明 |
|--------|------|
| DATABASE_URL | 数据库连接字符串 |
| JWT_SECRET | Session签名密钥 |
| VITE_APP_ID | Manus OAuth应用ID |
| OAUTH_SERVER_URL | OAuth服务器地址 |
| BUILT_IN_FORGE_API_URL | Manus API地址 |
| BUILT_IN_FORGE_API_KEY | Manus API密钥 |

---

## 🐛 常见问题

### Q: 如何修改网站标题？
A: 编辑 `client/index.html` 中的 `<title>` 标签，或在Manus管理后台修改。

### Q: 如何添加新的产品分类？
A: 
1. 编辑 `drizzle/schema.ts` 中的products表
2. 运行 `pnpm db:push`
3. 更新 `server/routers.ts` 中的API逻辑

### Q: 如何上传产品图片？
A: 
1. 访问 `/admin/products`
2. 在"添加产品"表单中选择图片
3. 图片会自动上传到S3存储

### Q: 如何修改Hero区的图片？
A: 
1. 将新图片放在 `/client/public/images/`
2. 编辑 `client/src/pages/Home.tsx`
3. 修改Hero区的图片路径

---

## 📞 技术支持

### 项目维护者
- 项目名称：佐迪智能家具网站
- 项目版本：ef318e30
- 最后更新：2026年1月17日

### 常用命令
```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 运行测试
pnpm test

# 代码格式化
pnpm format

# 数据库迁移
pnpm db:push

# 查看数据库
pnpm db:studio
```

---

## 📝 更新日志

### 2026年1月17日
- ✅ 代码推送到GitHub
- ✅ 创建PROJECT_WORK_LOG.md文档
- ✅ 完成GitHub分享指南

### 2026年1月16日
- ✅ 完成案例管理功能
- ✅ 优化Logo大小和位置
- ✅ 更新产品分类图标

### 更早期版本
- 详见 PROJECT_WORK_LOG.md

---

## 🎓 学习资源

### 前端框架
- [React 文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [TypeScript 文档](https://www.typescriptlang.org)

### 后端框架
- [tRPC 文档](https://trpc.io)
- [Express 文档](https://expressjs.com)

### 数据库
- [Drizzle ORM 文档](https://orm.drizzle.team)

---

**祝您开发愉快！** 🚀
