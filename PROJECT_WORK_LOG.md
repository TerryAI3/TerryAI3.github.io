# 佐迪智能家具网站 - 项目工作记录

**最后更新时间**: 2026年1月16日  
**项目版本**: 0eba0b5c  
**项目状态**: 进行中

---

## 📋 项目概述

### 项目目的
为佐迪智能家具公司（成立于2010年）构建一个现代化的B2B营销网站，展示公司的办公家具产品和成功案例，吸引企业客户并促进商业转化。

### 核心目标
1. **品牌展示**：通过高质量的设计展现佐迪的专业形象和品牌价值
2. **产品展示**：完整展示8个产品系列（座椅、办公会议桌、存储、空间支持等）
3. **案例展示**：展示真实的办公空间改造案例，建立客户信任
4. **内容管理**：提供后台管理系统，支持产品和案例的增删改查

### 品牌定位
- **品牌名称**: 佐迪（ZUODI）
- **品牌口号**: "办公空间解决方案专家"
- **品牌理念**: "Inspiring Office Lifestyle - 创造激发灵感的办公生活方式"
- **成立时间**: 2010年

---

## 🎨 设计风格与视觉规范

### 色彩方案
| 颜色名称 | 十六进制值 | 用途 | 备注 |
|---------|-----------|------|------|
| 深蓝色 | #08062B | Logo主色、文字 | 品牌主色，用于logo中的"zuodi"和"佐迪" |
| 青蓝色 | #3E9FFF | 强调色、图标背景 | Logo中i上的点，产品分类图标背景 |
| 橘色 | #FF6B35 | CTA按钮、强调 | 用于"获取报价"等行动按钮 |
| 白色 | #FFFFFF | 文字、背景 | Hero区文字颜色 |
| 浅灰色 | #F5F5F5 | 背景 | 产品区域背景 |

### Logo规范
- **Logo文件**: `/client/public/images/logo-zuodi.png`
- **Logo设计**:
  - 英文"zuodi"：深蓝色#08062B，Montserrat字体
  - 中文"佐迪"：深蓝色#08062B，SimHei/Microsoft YaHei字体
  - "i"上的点：青蓝色#3E9FFF（品牌特色元素）
  - 排版：英文和中文紧密排列，同一行显示
- **Logo尺寸规范**:
  - Hero区：h-10 (lg:h-14 xl:h-18)
  - 导航栏：h-12 (lg:h-16)
  - 其他位置：根据上下文调整

### 字体规范
- **英文字体**: Montserrat（现代无衬线）
- **中文字体**: SimHei / Microsoft YaHei（现代黑体）
- **标题**: 加粗，大号字体
- **正文**: 常规，中等字体大小

### 设计参考
- **参考网站1**: maratti.com.cn（案例管理设计风格）
- **参考网站2**: matsu.cn（Logo大小和导航栏设计）

---

## 🏗️ 技术架构

### 技术栈
- **前端**: React 19 + Tailwind CSS 4 + TypeScript
- **后端**: Express 4 + tRPC 11
- **数据库**: MySQL/TiDB
- **认证**: Manus OAuth
- **文件存储**: AWS S3
- **部署**: Manus 平台

### 项目结构
```
furniture-website/
├── client/                          # 前端代码
│   ├── public/
│   │   └── images/                 # 静态图片
│   │       ├── logo-zuodi.png      # 品牌logo
│   │       ├── hero-1.jpg          # Hero区轮播图1
│   │       ├── hero-2.jpg          # Hero区轮播图2
│   │       ├── hero-3.jpg          # Hero区轮播图3
│   │       └── products/           # 产品图片
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # 首页（包含hero、产品、案例、品牌介绍）
│   │   │   ├── Products.tsx        # 产品中心页面
│   │   │   ├── Cases.tsx           # 案例页面
│   │   │   ├── AdminCases.tsx      # 案例管理后台
│   │   │   ├── AdminProducts.tsx   # 产品管理后台
│   │   │   ├── AdminCategories.tsx # 分类管理后台
│   │   │   ├── AdminSeries.tsx     # 系列管理后台
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── Layout.tsx          # 主布局（导航栏）
│   │   │   └── ...
│   │   ├── App.tsx                 # 路由配置
│   │   └── index.css               # 全局样式
│   └── index.html
├── server/
│   ├── routers.ts                  # tRPC路由定义
│   ├── db.ts                       # 数据库查询助手
│   ├── storage.ts                  # S3存储助手
│   └── _core/                      # 核心框架代码
├── drizzle/
│   ├── schema.ts                   # 数据库schema定义
│   └── migrations/                 # 数据库迁移文件
├── shared/
│   └── types.ts                    # 共享类型定义
└── todo.md                         # 任务清单
```

### 数据库表结构
- **users**: 用户表（Manus OAuth集成）
- **products**: 产品表
- **productCategories**: 产品分类表
- **productSeries**: 产品系列表
- **cases**: 案例表（用于存储办公空间改造案例）

---

## 🔄 核心业务流程

### 1. 首页流程
```
访问首页
  ↓
加载Hero区（轮播3张办公空间图片）
  ↓
显示品牌介绍（SINCE 2010）
  ↓
显示产品分类（4个几何图形图标）
  ↓
显示精选产品（4个产品卡片）
  ↓
显示成功案例（从cases表读取真实数据，如无数据显示默认项目）
  ↓
显示CTA（获取报价按钮）
```

### 2. 产品管理流程
```
管理员访问 /admin/products
  ↓
查看产品列表
  ↓
可执行操作：
  - 添加新产品
  - 编辑现有产品
  - 删除产品
  - 批量导入产品
  ↓
数据保存到products表
  ↓
前端自动更新
```

### 3. 案例管理流程
```
管理员访问 /admin/cases
  ↓
查看案例列表
  ↓
可执行操作：
  - 添加新案例（标题、分类、地点、完成日期、主图、描述）
  - 编辑现有案例
  - 删除案例
  ↓
数据保存到cases表
  ↓
首页案例区自动更新（显示最新案例）
```

### 4. 用户认证流程
```
用户点击登录
  ↓
重定向到Manus OAuth
  ↓
用户授权
  ↓
回调到 /api/oauth/callback
  ↓
创建session cookie
  ↓
用户可访问受保护的管理页面
```

---

## 📊 页面结构与功能

### 首页 (Home.tsx)
**路由**: `/`

**主要区域**:
1. **Hero区** (600px高度)
   - 轮播3张办公空间图片（hero-1.jpg, hero-2.jpg, hero-3.jpg）
   - 自动轮播，间隔5秒
   - 左上角：品牌logo（h-10 lg:h-14 xl:h-18）
   - 左下角：品牌口号"办公空间解决方案专家"（白色文字）
   - 右上角：NEW PRODUCT标签（橘色背景）
   - 底部：轮播指示器（可点击）

2. **品牌介绍区**
   - 【SINCE 2010】标题
   - 品牌故事文本（2段）
   - 右侧："Inspiring Office Lifestyle"标题 + 中文翻译

3. **产品分类区**
   - 4个产品分类卡片：
     - 座椅（椅子几何图形）
     - 办公会议桌（桌子几何图形）
     - 存储（柜子几何图形）
     - 空间支持（多边形几何图形）
   - 每个图标：青蓝色圆形背景#3E9FFF + 白色线条
   - 显示中英文名称

4. **精选产品区**
   - 4个产品卡片（黎明、杰瑞、光芒、诺拉）
   - 显示产品图片、中文名、英文名

5. **成功案例区**
   - 显示cases表中的真实案例数据
   - 如无案例数据，显示默认项目列表
   - 每个案例卡片显示：项目图片 + 项目名称
   - 支持hover效果（图片放大）

6. **CTA区**
   - 标题："准备升级您的办公空间？"
   - 副文本："联系我们的专业团队..."
   - 按钮："获取报价"（白色文字，橘色背景）

### 导航栏 (Layout.tsx)
**位置**: 所有页面顶部

**布局**:
- 左侧：品牌logo（h-12 lg:h-16）
- 右侧：导航菜单 + 管理按钮
- 导航项：产品、案例、关于我们、联系我们
- 管理按钮：仅管理员可见（需要user.role === 'admin'）

### 案例管理页面 (AdminCases.tsx)
**路由**: `/admin/cases`  
**权限**: 仅管理员可访问

**功能**:
1. **案例列表显示**
   - 显示所有案例的卡片
   - 每个卡片显示：标题、分类、地点、描述、主图、创建日期

2. **添加案例**
   - 点击"新增案例"按钮
   - 弹出表单，包含字段：
     - 案例标题 *（必填）
     - URL Slug *（必填）
     - 分类 *（必填）
     - 项目地点
     - 完成日期
     - 案例描述
     - 主图URL
     - 其他图片URLs（JSON数组）
     - 使用的产品（JSON）
   - 提交后保存到cases表

3. **编辑案例**
   - 点击案例卡片上的"编辑"按钮
   - 预填表单数据
   - 修改后提交更新

4. **删除案例**
   - 点击案例卡片上的"删除"按钮
   - 确认后从cases表删除

---

## 🔌 API接口规范

### Cases API (tRPC)
```typescript
// 获取所有案例
trpc.cases.list.useQuery()

// 创建案例
trpc.cases.create.useMutation({
  title: string,
  slug: string,
  category: string,
  description?: string,
  location?: string,
  completedDate?: string,
  mainImage?: string,
  images?: string,
  products?: string
})

// 更新案例
trpc.cases.update.useMutation({
  id: number,
  title: string,
  slug: string,
  category: string,
  ...
})

// 删除案例
trpc.cases.delete.useMutation(id: number)
```

### Products API (tRPC)
```typescript
// 获取所有产品
trpc.products.list.useQuery()

// 创建产品
trpc.products.create.useMutation({...})

// 更新产品
trpc.products.update.useMutation({...})

// 删除产品
trpc.products.delete.useMutation(id: number)
```

---

## 📝 当前完成状态

### ✅ 已完成功能
- [x] 基础网站架构（React + Express + MySQL）
- [x] 首页设计与实现
- [x] 导航栏设计与实现
- [x] Hero区轮播功能
- [x] 产品分类（4个几何图形图标）
- [x] 产品管理后台
- [x] 案例管理后台（CRUD）
- [x] 首页案例展示（使用真实数据）
- [x] Logo设计与集成
- [x] 色彩方案定义
- [x] 用户认证（Manus OAuth）
- [x] 数据库集成

### 🔄 进行中
- [ ] 上传真实案例数据（5-10个）
- [ ] 上传真实产品数据（8个系列）
- [ ] 产品详情页优化
- [ ] 在线咨询表单

### 📋 待实现功能
- [ ] 客户评价区域
- [ ] 产品图片库（多图轮播）
- [ ] 订单管理系统
- [ ] 新闻/博客模块
- [ ] SEO优化
- [ ] 性能优化

---

## 🚀 部署与运行

### 本地开发
```bash
# 安装依赖
pnpm install

# 运行开发服务器
pnpm dev

# 数据库迁移
pnpm db:push

# 运行测试
pnpm test
```

### 项目配置
- **数据库**: 自动配置（DATABASE_URL环境变量）
- **认证**: Manus OAuth（自动配置）
- **文件存储**: AWS S3（自动配置）
- **前端URL**: https://3000-i0bc6wg7rdxsmtqfwja32-1442c790.sg1.manus.computer

### 环境变量
- `DATABASE_URL`: MySQL连接字符串
- `JWT_SECRET`: Session签名密钥
- `VITE_APP_ID`: Manus OAuth应用ID
- `OAUTH_SERVER_URL`: OAuth服务器URL
- 其他自动注入的环境变量见template README

---

## 📌 重要规则与约定

### 命名规范
- **文件名**: PascalCase（React组件），kebab-case（其他文件）
- **变量名**: camelCase
- **数据库表**: 复数形式（users, products, cases）
- **URL路由**: 小写，用斜杠分隔

### 代码规范
- **React**: 使用函数式组件 + Hooks
- **样式**: Tailwind CSS优先，避免自定义CSS
- **类型**: 使用TypeScript，避免any类型
- **导入**: 使用@别名（@/components, @/lib等）

### 数据规范
- **日期**: 存储为ISO 8601格式或Unix时间戳
- **图片URL**: 完整的HTTPS URL
- **JSON字段**: 存储为JSON字符串，需要时手动parse

### 管理员权限
- **管理员标识**: user.role === 'admin'
- **受保护页面**: /admin/* 路由
- **权限检查**: 在页面顶部检查，无权限显示"您没有权限访问此页面"

---

## 🔧 常见操作指南

### 如何添加新案例
1. 访问 `/admin/cases`
2. 点击"新增案例"按钮
3. 填写表单：
   - 案例标题（必填）：如"某某企业办公空间改造"
   - URL Slug（必填）：如"company-office-renovation"
   - 分类（必填）：如"办公空间"
   - 项目地点：如"北京市朝阳区"
   - 完成日期：如"2024-01"
   - 案例描述：详细描述
   - 主图URL：高质量办公空间图片
4. 提交，首页案例区会自动更新

### 如何修改Logo
1. 替换 `/client/public/images/logo-zuodi.png` 文件
2. 确保新logo包含：
   - 英文"zuodi"（深蓝色）
   - 中文"佐迪"（深蓝色）
   - "i"上的青蓝色点
3. 重启开发服务器

### 如何修改Hero区图片
1. 替换以下文件：
   - `/client/public/images/hero-1.jpg`
   - `/client/public/images/hero-2.jpg`
   - `/client/public/images/hero-3.jpg`
2. 建议尺寸：1920x600px（16:9比例）
3. 重启开发服务器

### 如何添加新导航菜单项
1. 编辑 `/client/src/components/Layout.tsx`
2. 在导航数组中添加新项
3. 在 `/client/src/App.tsx` 中添加对应路由
4. 创建新页面组件

---

## 📞 联系与支持

### 项目维护者
- 项目启动时间：2026年1月15日
- 最后更新：2026年1月16日
- 当前版本：0eba0b5c

### 快速参考
- **项目路径**: `/home/ubuntu/furniture-website`
- **GitHub**: 可通过Management UI导出到GitHub
- **数据库**: MySQL/TiDB（自动管理）
- **文件存储**: AWS S3（自动配置）

---

## 📚 相关文档

- **项目TODO**: 见 `todo.md`
- **模板README**: 见 `README.md`（框架文档）
- **设计参考**: maratti.com.cn, matsu.cn

---

**本文档应定期更新，确保信息准确性。任何新的功能、规则变更都应及时记录。**
