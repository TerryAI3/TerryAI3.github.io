# 🚀 手动部署zuodii.com指南

## 前提条件
1. 已安装Git
2. 有GitHub仓库访问权限
3. 已构建网站 (npm run build)

## 部署步骤

### 方法1: 使用部署脚本 (推荐)
```bash
# 进入项目目录
cd /root/.openclaw/workspace/terryai-website

# 运行部署脚本
./deploy-to-gh-pages.sh
```

### 方法2: 手动部署
```bash
# 1. 进入项目目录
cd /root/.openclaw/workspace/terryai-website

# 2. 构建网站
npm run build

# 3. 进入构建目录
cd dist/public

# 4. 初始化Git仓库
git init
git checkout -b gh-pages

# 5. 添加所有文件
git add .

# 6. 提交更改
git commit -m "部署zuodii.com四大品牌整合网站"

# 7. 添加远程仓库
git remote add origin https://github.com/TerryAI3/TerryAI3.github.io.git

# 8. 强制推送到gh-pages分支
git push -f origin gh-pages
```

### 方法3: 使用GitHub CLI
```bash
# 1. 构建网站
npm run build

# 2. 部署到GitHub Pages
gh repo view TerryAI3/TerryAI3.github.io --web
# 然后在GitHub网站设置Pages部署
```

## 部署验证

### 立即检查
1. **访问网站**: https://zuodii.com
2. **检查功能**:
   - ✅ 首页加载正常
   - ✅ 产品中心可访问
   - ✅ 智能筛选工作正常
   - ✅ 响应式设计正常

### GitHub Pages设置
1. 访问: https://github.com/TerryAI3/TerryAI3.github.io/settings/pages
2. 配置:
   - 分支: `gh-pages`
   - 目录: `/ (root)`
   - 自定义域名: `zuodii.com` (已配置)

### DNS验证
```
zuodii.com → GitHub Pages IP
CNAME记录指向: TerryAI3.github.io
```

## 故障排除

### 常见问题
1. **404错误**
   ```bash
   # 检查部署分支
   git branch -a
   
   # 检查GitHub Pages设置
   # 确保使用gh-pages分支
   ```

2. **样式丢失**
   ```bash
   # 清除浏览器缓存
   # 或使用隐私模式访问
   
   # 检查CSS文件路径
   # 确保.nojekyll文件存在
   ```

3. **部署失败**
   ```bash
   # 检查Git权限
   git remote -v
   
   # 检查构建过程
   npm run build
   ```

## 回滚部署

### 回滚到之前版本
```bash
# 1. 查看提交历史
git log --oneline

# 2. 回滚到指定版本
git reset --hard <commit-hash>

# 3. 强制推送
git push -f origin gh-pages
```

### 使用GitHub网站回滚
1. 访问仓库的Actions标签
2. 找到之前的部署
3. 点击"Re-run workflow"

## 维护建议

### 日常维护
1. **定期更新**
   - 每周检查网站状态
   - 每月更新产品数据
   - 每季度优化性能

2. **监控分析**
   - 使用Google Analytics
   - 监控页面速度
   - 跟踪用户行为

3. **安全维护**
   - 定期更新依赖
   - 安全漏洞扫描
   - 备份网站数据

### 扩展计划
1. **内容扩展**
   - 添加更多产品
   - 创建案例研究
   - 发布行业资讯

2. **功能扩展**
   - 在线咨询系统
   - 产品对比功能
   - 用户评价系统

## 技术支持
- **紧急问题**: 直接回滚到之前版本
- **技术咨询**: 查看部署日志
- **功能请求**: 提交GitHub Issue

**部署准备就绪！** 🚀
