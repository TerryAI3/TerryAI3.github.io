# 佐迪网站静态部署指南

## 文件说明
此目录包含构建后的静态文件，可直接部署到任何静态托管服务。

## 支持的托管平台

### 1. Vercel (推荐)
1. 访问 https://vercel.com
2. 导入GitHub仓库
3. 配置：
   - Framework Preset: Vite
   - Root Directory: (自动检测)
4. 添加自定义域名: zuodii.com
5. 自动启用HTTPS

### 2. Netlify
1. 访问 https://netlify.com
2. 拖拽此文件夹到部署区域
3. 配置：
   - Build command: (留空，已构建)
   - Publish directory: ./
4. 添加自定义域名
5. 启用HTTPS

### 3. Cloudflare Pages
1. 访问 https://pages.cloudflare.com
2. 连接GitHub仓库
3. 配置：
   - Framework: Vite
   - Build command: npm run build
   - Build output directory: dist/public
4. 添加自定义域名
5. 启用HTTPS

### 4. GitHub Pages (如果支持)
1. 创建 `gh-pages` 分支
2. 推送此文件夹内容
3. 在仓库设置中启用GitHub Pages
4. 设置自定义域名
5. 启用Enforce HTTPS

## 手动部署到服务器
1. 上传此文件夹到服务器
2. 配置Nginx/Apache：
   ```nginx
   server {
       listen 80;
       server_name zuodii.com www.zuodii.com;
       root /path/to/this/folder;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```
3. 配置SSL证书 (Let's Encrypt)

## 域名配置
### DNS记录 (在Namecheap或其他注册商)
```
A记录:
@ → 托管平台提供的IP (如Vercel/Netlify的IP)
www → 托管平台提供的CNAME

或CNAME记录:
@ → your-site.vercel.app
www → your-site.vercel.app
```

## 验证部署
1. 访问 https://zuodii.com
2. 测试所有页面
3. 检查HTTPS是否生效
4. 测试图片加载

## 故障排除
1. **404错误**: 检查路由配置，确保所有路由回退到index.html
2. **HTTPS不生效**: 检查DNS配置和托管平台设置
3. **图片不显示**: 检查图片路径和文件权限
4. **样式丢失**: 检查CSS/JS文件路径

---
*部署时间: $(date)*
