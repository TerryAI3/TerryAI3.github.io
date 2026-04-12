# 🏗️ 佐迪网站维护指南

## 📋 项目概况
- **项目名称**: 佐迪智能家具官网
- **主域名**: zuodii.com
- **GitHub仓库**: TerryAI3.github.io (开发仓库)
- **当前分支**: source (开发分支)
- **部署分支**: gh-pages (生产分支)
- **技术栈**: React + TypeScript + Vite + TailwindCSS

## 🚀 快速开始

### 开发环境
```bash
# 安装依赖
npm install --legacy-peer-deps

# 启动开发服务器 (客户端)
npm run dev:client

# 启动开发服务器 (全栈)
npm run dev

# 使用优化配置开发
npm run dev:optimized
```

### 构建部署
```bash
# 生产构建 (优化配置)
npm run build

# 传统构建 (原配置)
npm run build:legacy

# 分析构建产物
npm run analyze

# 一键CDN部署
./deploy-cdn.sh
```

## 🏗️ 架构优化总结

### 1. 构建优化 (已完成)
- **构建时间**: 4.9秒 (优化前: 6.3秒，提升22%)
- **构建产物**: 2.9MB (包含图片)
- **代码分割**: 动态vendor chunk策略
- **压缩优化**: Terser + 移除console.log

### 2. Vite配置优化
- **配置文件**: `vite.config.optimized.ts`
- **主要优化**:
  - 生产环境移除console.log
  - 智能代码分割
  - 长期缓存支持
  - CDN基础路径配置
  - Tree shaking强化

### 3. CDN准备就绪
- **CDN配置**: 已集成到构建配置
- **基础URL**: `https://cdn.zuodii.com` (生产环境)
- **缓存策略**: 静态资源1年缓存
- **备用方案**: Cloudflare + 阿里云混合

## 📁 项目结构
```
TerryAI3.github.io/
├── client/                 # 前端代码
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   └── Intelligence.tsx  # 数字情报面板
│   │   ├── components/    # 通用组件
│   │   └── App.tsx        # 主应用
├── server/                # 后端代码
├── dist/                  # 构建产物
├── vite.config.ts         # 原始配置
├── vite.config.optimized.ts # 优化配置
├── deploy-cdn.sh          # CDN部署脚本
└── WEBSITE_MAINTENANCE_GUIDE.md # 本文件
```

## 🔧 维护任务

### 日常维护
1. **依赖更新**
   ```bash
   # 检查过时依赖
   npm outdated
   
   # 安全更新
   npm audit fix
   
   # 更新所有依赖
   npm update
   ```

2. **性能监控**
   ```bash
   # 运行监控脚本
   ./monitor-cdn.sh
   
   # 构建分析
   npm run analyze
   ```

3. **代码质量**
   ```bash
   # 代码格式化
   npm run format
   
   # 类型检查
   npm run check
   
   # 运行测试
   npm run test
   ```

### 内容更新
1. **产品信息更新**: 修改 `client/src/pages/ProductsPage.tsx`
2. **情报面板更新**: 修改 `client/src/pages/Intelligence.tsx`
3. **图片资源更新**: 替换 `client/public/images/` 中的图片
4. **配置更新**: 修改对应的配置文件

## 🎯 数字情报面板功能
Intelligence.tsx 展示了多智能体系统的状态：
- **东来哥**: 主控枢纽 (Gemini 3 Flash)
- **极客**: 技术架构 (DeepSeek Chat)
- **伙伴**: 商务情报 (DeepSeek Chat)
- **孔奇塔**: 网球执教 (Gemini Flash)

**功能**:
- 实时显示智能体状态
- HKMU 8099学业进度跟踪
- 全球时事与行业情报
- 关键节点提醒

## ⚡ 性能优化建议

### 已实施优化
✅ 代码分割和懒加载
✅ 图片WebP格式优化
✅ 构建配置优化
✅ CDN基础配置
✅ 长期缓存策略

### 待优化项
🔲 图片进一步压缩 (目标: <1MB)
🔲 PWA支持
🔲 服务端渲染 (SSR)
🔲 更精细的CDN路由
🔲 性能监控仪表板

## 🚨 故障排除

### 常见问题
1. **构建失败**
   ```bash
   # 清理node_modules重新安装
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

2. **依赖冲突**
   ```bash
   # 使用legacy模式安装
   npm install --legacy-peer-deps
   ```

3. **CDN资源404**
   - 检查 `vite.config.optimized.ts` 中的base配置
   - 确认CDN域名已正确配置
   - 检查构建产物的文件hash

4. **类型错误**
   ```bash
   # 运行类型检查
   npm run check
   
   # 如果tsc未安装
   npm install -D typescript
   ```

### 紧急回滚
```bash
# 切换到传统构建
npm run build:legacy

# 手动部署到GitHub Pages
npm run build:legacy
npx gh-pages -d dist
```

## 📈 监控指标

### 性能指标
- **构建时间**: < 10秒
- **首屏加载**: < 2秒
- **LCP**: < 2.5秒
- **CLS**: < 0.1

### 业务指标
- **CDN命中率**: > 90%
- **可用性**: > 99.9%
- **用户访问**: 监控关键页面
- **错误率**: < 0.1%

## 🔄 更新流程

### 小更新 (内容更新)
1. 修改对应页面组件
2. 本地测试: `npm run dev:client`
3. 构建测试: `npm run build`
4. 部署: `./deploy-cdn.sh`

### 大更新 (功能更新)
1. 创建功能分支
2. 开发测试
3. 性能测试
4. 代码审查
5. 合并到source分支
6. 生产部署

### 紧急修复
1. 直接在生产分支修复
2. 快速测试
3. 立即部署
4. 事后同步到开发分支

## 📚 相关文档

### 项目文档
- `PROJECT_WORK_LOG.md` - 项目工作日志
- `DEPLOYMENT_GUIDE.md` - 部署指南
- `PERFORMANCE.md` - 性能记录

### 优化报告 (Obsidian)
- `website-product-roadmap.md` - 产品路线图
- `night-2-progress-report.md` - 技术优化报告
- `cdn-research-report.md` - CDN研究报告
- `build-optimization-analysis.md` - 构建优化分析

### 配置档案
- `System/credentials.md` - API密钥和配置
- `SOUL.md` - 智能体行为准则

## 🆘 紧急联系人

### 技术支持
- **极客 (Geek)**: 技术架构和优化
- **东来哥**: 统筹协调和决策

### 业务支持
- **伙伴 (老马)**: 商务内容和行业分析
- **用户本人**: 最终决策和内容审核

---

**最后更新**: 2026年4月12日  
**维护团队**: 数字化特种部队 (多智能体系统)  
**状态**: ✅ 生产就绪，优化完成