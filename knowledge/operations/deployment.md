# 部署流程

## 概述
本文档详细描述了佐迪智能家具官网的部署流程，包括环境配置、构建过程、CDN部署和验证步骤。

## 部署架构
### 整体架构
```
开发环境 (本地) → 构建过程 → 生产环境 (GitHub Pages + Cloudflare CDN)
```

### 环境说明
1. **开发环境**
   - 地址: http://localhost:3000
   - 用途: 本地开发测试
   - 配置: vite.config.ts (开发配置)

2. **生产环境**
   - 主站: https://zuodii.com
   - CDN: https://cdn.zuodii.com
   - 用途: 用户访问
   - 配置: vite.config.optimized.ts (优化配置)

## 部署流程
### 1. 准备工作
#### 环境检查
```bash
# 检查Node.js版本
node --version  # 需要 >= 18.0.0

# 检查npm版本
npm --version   # 需要 >= 9.0.0

# 检查Git
git --version

# 检查依赖安装
npm list --depth=0
```

#### 配置检查
```bash
# 检查环境变量
cat .env.production 2>/dev/null || echo "无生产环境变量"

# 检查CDN配置
grep -n "cdn.zuodii.com" vite.config.optimized.ts

# 检查构建配置
npm run check
```

### 2. 构建过程
#### 标准构建
```bash
# 使用优化配置构建
npm run build

# 构建输出示例
# ✓ built in 4.9s
# dist/
# ├── assets/
# │   ├── index-CwRbp4qa.js
# │   ├── vendor-react-abc123.js
# │   └── product-image-xyz789.webp
# └── index.html
```

#### 构建验证
```bash
# 检查构建产物
ls -la dist/

# 检查文件大小
du -sh dist/
du -sh dist/assets/

# 检查HTML文件
head -20 dist/index.html

# 验证CDN路径
grep -n "cdn.zuodii.com" dist/index.html
```

### 3. 部署到GitHub Pages
#### 自动部署脚本
```bash
# 运行部署脚本
./deploy-to-gh-pages.sh

# 脚本执行步骤:
# 1. 切换到gh-pages分支
# 2. 清理旧文件
# 3. 复制dist目录内容
# 4. 提交并推送到GitHub
# 5. 切换回原分支
```

#### 手动部署
```bash
# 构建项目
npm run build

# 部署到gh-pages分支
npx gh-pages -d dist

# 或者使用Git命令
git checkout gh-pages
rm -rf *
cp -r dist/* .
git add .
git commit -m "Deploy: $(date +%Y-%m-%d)"
git push origin gh-pages
git checkout source
```

### 4. CDN配置和部署
#### Cloudflare配置
1. **DNS配置**
   - `zuodii.com` A记录 → GitHub Pages IP
   - `www.zuodii.com` CNAME → `zuodii.com`
   - `cdn.zuodii.com` CNAME → `zuodii.com`
   - 所有记录启用代理（橙色云图标）

2. **SSL/TLS配置**
   - 模式: Full (严格)
   - 启用: Always Use HTTPS
   - 启用: HSTS

3. **缓存配置**
   - 缓存级别: Standard
   - 浏览器缓存TTL: 1 month
   - 边缘缓存TTL: 1 year (静态资源)

4. **性能优化**
   - Auto Minify: JS, CSS, HTML
   - Brotli压缩: 启用
   - Rocket Loader: 谨慎启用

#### CDN部署脚本
```bash
# 运行CDN部署脚本
./deploy-cdn.sh

# 脚本输出:
# 🚀 开始部署佐迪网站到CDN...
# 📦 构建网站...
# ✅ 构建完成，构建产物大小: 2.9M dist/
# 🌐 部署到GitHub Pages...
# 📡 CDN配置说明...
# 🎉 部署完成！
```

### 5. 部署后验证
#### 可用性测试
```bash
# 测试主站可用性
curl -I https://zuodii.com
# 预期: HTTP/2 200

# 测试CDN资源可用性
curl -I https://cdn.zuodii.com/assets/index-*.js
# 预期: HTTP/2 200

# 测试SSL证书
openssl s_client -connect zuodii.com:443 -servername zuodii.com <<< "Q" | grep "Verify"
# 预期: Verify return code: 0 (ok)
```

#### 性能测试
```bash
# 使用监控脚本
./monitor-cdn.sh

# 脚本输出:
# 🔄 检查CDN性能...
# 🌐 可用性测试:
# 检查 主网站 (https://zuodii.com)... ✅ 正常
# 检查 CDN资源 (https://cdn.zuodii.com/assets/index-*.js)... ✅ 正常
# ⏱️  性能测试:
# 主站 访问速度... 245ms
# CDN资源 访问速度... 89ms
```

#### 内容验证
```bash
# 检查页面内容
curl -s https://zuodii.com | grep -o "<title>[^<]*</title>"
# 预期: <title>佐迪智能家具</title>

# 检查资源版本
curl -s https://zuodii.com | grep -o "assets/index-[^.]*\.js"
# 预期: assets/index-CwRbp4qa.js (版本hash)
```

## 自动化部署
### GitHub Actions工作流
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [source]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 部署触发器
1. **手动触发**: 运行部署脚本
2. **代码推送**: 推送到source分支自动部署
3. **定时触发**: 每天自动构建和测试
4. **标签发布**: 创建版本标签时部署

## 回滚流程
### 紧急回滚
#### 情况1: 构建问题
```bash
# 切换到传统构建
npm run build:legacy

# 手动部署
npx gh-pages -d dist

# 清除Cloudflare缓存
# 登录Cloudflare控制台 → Caching → Configuration → Purge Cache
```

#### 情况2: CDN配置问题
```bash
# 临时禁用Cloudflare代理
# 登录Cloudflare控制台 → DNS → 将代理状态改为灰色（仅DNS）

# 直接访问源站
# 修改本地hosts指向GitHub Pages IP

# 修复配置后重新启用代理
```

#### 情况3: 内容错误
```bash
# 恢复到上一个版本
git checkout gh-pages
git log --oneline -5
git checkout <previous-commit-hash>
git push -f origin gh-pages

# 清除浏览器和CDN缓存
```

### 回滚检查清单
1. ✅ 确认问题原因
2. ✅ 评估影响范围
3. ✅ 选择回滚策略
4. ✅ 执行回滚操作
5. ✅ 验证回滚效果
6. ✅ 记录回滚过程
7. ✅ 制定修复计划

## 监控和告警
### 监控指标
1. **可用性监控**
   - HTTP状态码
   - 响应时间
   - SSL证书状态
   - DNS解析状态

2. **性能监控**
   - 页面加载时间
   - CDN命中率
   - 资源加载时间
   - 首字节时间

3. **业务监控**
   - 访问量
   - 用户地理位置
   - 浏览器分布
   - 错误率

### 告警配置
1. **紧急告警**（立即通知）
   - 网站完全不可用
   - SSL证书过期
   - 安全攻击检测

2. **重要告警**（1小时内处理）
   - 性能严重下降
   - 错误率升高
   - CDN命中率下降

3. **一般告警**（24小时内处理）
   - 资源加载缓慢
   - 缓存配置问题
   - 构建失败

## 最佳实践
### 部署最佳实践
1. **时间选择**
   - 在低流量时段部署
   - 避免业务高峰期
   - 考虑用户时区分布

2. **版本管理**
   - 每次部署都有版本标签
   - 保留历史版本便于回滚
   - 记录部署日志

3. **渐进式发布**
   - 先小范围测试
   - 逐步扩大范围
   - 监控关键指标

### 安全最佳实践
1. **访问控制**
   - 限制部署权限
   - 使用密钥管理
   - 审计部署操作

2. **数据保护**
   - 不包含敏感信息
   - 加密配置文件
   - 定期轮换密钥

3. **审计跟踪**
   - 记录所有部署操作
   - 跟踪配置变更
   - 定期安全审查

## 故障排除
### 常见问题
#### 问题1: 构建失败
```bash
# 解决方案:
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

#### 问题2: CDN资源404
```bash
# 检查步骤:
# 1. 确认CDN域名解析正确
dig cdn.zuodii.com

# 2. 确认文件存在于dist目录
ls -la dist/assets/

# 3. 检查HTML中的资源路径
grep -n "assets/" dist/index.html

# 4. 清除Cloudflare缓存
```

#### 问题3: SSL证书错误
```bash
# 检查步骤:
# 1. 检查证书状态
openssl s_client -connect zuodii.com:443 -servername zuodii.com

# 2. 检查Cloudflare SSL配置
# 登录Cloudflare → SSL/TLS → Overview

# 3. 检查源站SSL配置
# 确保源站支持HTTPS
```

#### 问题4: 部署后样式错乱
```bash
# 解决方案:
# 1. 清除浏览器缓存
# 2. 清除CDN缓存
# 3. 检查CSS文件hash是否更新
# 4. 检查资源路径是否正确
```

### 调试工具
```bash
# 网络调试
curl -v https://zuodii.com
curl --resolve zuodii.com:443:1.1.1.1 https://zuodii.com

# 性能分析
npx lighthouse https://zuodii.com --view

# 安全扫描
npx sslscan zuodii.com
```

## 部署检查清单
### 部署前检查
- [ ] 代码已通过测试
- [ ] 类型检查通过
- [ ] 构建配置正确
- [ ] 环境变量已设置
- [ ] 备份当前版本

### 部署中检查
- [ ] 构建过程无错误
- [ ] 构建产物完整
- [ ] CDN配置正确
- [ ] 部署日志记录

### 部署后检查
- [ ] 网站可正常访问
- [ ] CDN资源可访问
- [ ] SSL证书有效
- [ ] 性能指标正常
- [ ] 监控告警正常

## 文档和记录
### 部署日志
```markdown
## 部署记录: 2026-04-12

### 基本信息
- **版本**: v1.2.0
- **部署时间**: 2026-04-12 14:30
- **部署人**: 极客
- **环境**: 生产环境

### 变更内容
1. 优化Vite构建配置
2. 集成Cloudflare CDN
3. 添加性能监控脚本

### 构建信息
- **构建时间**: 4.9秒
- **构建大小**: 2.9MB
- **构建hash**: abc123def456

### 验证结果
- ✅ 主站访问正常
- ✅ CDN资源正常
- ✅ SSL证书有效
- ✅ 性能指标达标

### 备注
首次CDN部署，需要监控国内访问速度
```

---

**最后更新**: 2026年4月12日  
**文档版本**: v1.0  
**维护者**: 极客 (Geek)  
**状态**: ✅ 已完成