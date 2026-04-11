# 🔄 zuodii.com 替代部署方案

## 方案1: 使用GitHub Token (推荐)
```bash
# 1. 创建GitHub Token
# 访问: https://github.com/settings/tokens
# 权限: repo (全部仓库权限)

# 2. 设置环境变量
export GITHUB_TOKEN=your_token_here

# 3. 使用Token部署
cd /root/.openclaw/workspace/terryai-website
git remote set-url origin https://${GITHUB_TOKEN}@github.com/TerryAI3/TerryAI3.github.io.git
./deploy-to-gh-pages.sh
```

## 方案2: 使用GitHub CLI
```bash
# 1. 安装GitHub CLI
# Ubuntu: sudo apt install gh
# macOS: brew install gh

# 2. 登录GitHub
gh auth login

# 3. 部署网站
cd /root/.openclaw/workspace/terryai-website
npm run build
cd dist/public
gh repo view TerryAI3/TerryAI3.github.io --web
# 在GitHub网站手动上传文件
```

## 方案3: 手动文件上传
1. **访问GitHub仓库**: https://github.com/TerryAI3/TerryAI3.github.io
2. **切换到gh-pages分支**
3. **上传文件**:
   - 删除所有现有文件
   - 上传dist/public目录所有文件
   - 提交更改

## 方案4: 使用GitHub Actions自动部署
1. **创建工作流文件** `.github/workflows/deploy.yml`:
```yaml
name: Deploy zuodii.com

on:
  push:
    branches: [source]

jobs:
  deploy:
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
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
```

## 方案5: 使用其他静态托管
### Vercel
```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 部署
cd /root/.openclaw/workspace/terryai-website
vercel --prod
```

### Netlify
```bash
# 1. 安装Netlify CLI
npm i -g netlify-cli

# 2. 部署
cd /root/.openclaw/workspace/terryai-website
netlify deploy --prod
```

## 紧急方案: 直接服务器部署
如果GitHub Pages有问题，可以直接部署到服务器:
```bash
# 1. 构建网站
npm run build

# 2. 复制到网站目录
sudo cp -r dist/public/* /var/www/zuodii.com/

# 3. 设置权限
sudo chown -R www-data:www-data /var/www/zuodii.com
sudo chmod -R 755 /var/www/zuodii.com

# 4. 重启Web服务器
sudo systemctl restart nginx
```

## 验证部署
无论使用哪种方案，部署后都需要验证:

### 基础验证
```bash
# 检查网站状态
curl -I https://zuodii.com

# 检查内容更新
curl -s https://zuodii.com | grep -o "<title>[^<]*</title>"
```

### 功能验证
1. **首页**: https://zuodii.com
2. **产品中心**: 检查筛选功能
3. **移动端**: 调整浏览器大小测试
4. **性能**: 使用PageSpeed Insights

## 技术支持
- **部署问题**: 检查错误日志
- **功能问题**: 浏览器开发者工具
- **紧急恢复**: 回滚到之前版本

**选择最适合的方案部署!** 🚀
