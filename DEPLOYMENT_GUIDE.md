# 🚀 zuodii.com 部署指南

## 当前状态
- ✅ 代码已提交到 `source` 分支
- ✅ 生产构建已完成 (dist目录)
- 🌐 网站地址: https://zuodii.com

## 部署选项

### 选项1: GitHub Pages自动部署
1. **配置GitHub Pages**
   - 进入仓库设置 → Pages
   - 分支: `gh-pages` 或 `main`
   - 目录: `/ (root)` 或 `/dist`

2. **创建gh-pages分支**
```bash
# 切换到构建目录
cd dist

# 初始化git
git init
git add .
git commit -m "Deploy zuodii.com"

# 添加远程仓库
git remote add origin https://github.com/TerryAI3/TerryAI3.github.io.git

# 推送到gh-pages分支
git push -f origin main:gh-pages
```

### 选项2: 手动部署到现有网站
1. **备份当前网站**
```bash
# 备份当前网站
cp -r /var/www/zuodii.com /var/www/zuodii.com.backup-$(date +%Y%m%d)
```

2. **部署新网站**
```bash
# 复制构建文件到网站目录
cp -r dist/* /var/www/zuodii.com/

# 设置权限
chown -R www-data:www-data /var/www/zuodii.com
chmod -R 755 /var/www/zuodii.com
```

### 选项3: 使用CI/CD自动部署
1. **创建GitHub Actions工作流**
```yaml
# .github/workflows/deploy.yml
name: Deploy to zuodii.com

on:
  push:
    branches: [source]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 网站功能验证

### 部署后测试
1. **访问网站**: https://zuodii.com
2. **检查功能**:
   - ✅ 首页加载正常
   - ✅ 产品中心可访问
   - ✅ 智能筛选工作正常
   - ✅ 响应式设计正常
   - ✅ 品牌展示完整

### 性能测试
1. **页面速度**: Google PageSpeed Insights
2. **移动端测试**: 响应式设计检查
3. **SEO检查**: 元标签和结构化数据

## 故障排除

### 常见问题
1. **404错误**
   - 检查GitHub Pages配置
   - 验证dist目录结构
   - 检查路由配置

2. **样式丢失**
   - 检查CSS文件路径
   - 验证构建过程
   - 清除浏览器缓存

3. **功能异常**
   - 检查JavaScript控制台错误
   - 验证API端点
   - 测试不同浏览器

## 维护指南

### 日常维护
1. **内容更新**
   - 产品数据更新: `client/src/data/enhanced-products.ts`
   - 页面内容更新: `client/src/pages/`
   - 设计系统更新: `client/src/design-system/`

2. **性能监控**
   - 定期检查页面速度
   - 监控用户访问统计
   - 优化图片和资源

3. **安全更新**
   - 定期更新依赖包
   - 安全漏洞扫描
   - 备份网站数据

### 扩展计划
1. **短期 (1个月)**
   - 添加产品详情页面
   - 创建案例展示页面
   - 优化移动端体验

2. **中期 (3个月)**
   - 对接产品API
   - 实现用户系统
   - 添加在线咨询

3. **长期 (6个月)**
   - 多语言支持
   - 电商功能
   - 客户管理系统

## 联系支持
- **技术问题**: GitHub Issues
- **内容更新**: 提交Pull Request
- **紧急问题**: 直接部署回滚

**网站已准备就绪，可以部署上线！** 🚀
