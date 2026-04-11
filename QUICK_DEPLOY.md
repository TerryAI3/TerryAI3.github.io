# ⚡ zuodii.com 快速部署指南

## 最简单的方法
```bash
# 1. 进入项目目录
cd /root/.openclaw/workspace/terryai-website

# 2. 运行部署脚本
./deploy-ssh.sh
```

## 如果SSH失败，使用HTTPS
```bash
# 1. 设置Git凭据
git config --global credential.helper store

# 2. 第一次需要输入用户名密码
git push origin source

# 3. 然后运行部署
./deploy-to-gh-pages.sh
```

## 最快速的方法 (手动)
1. **构建网站**
```bash
cd /root/.openclaw/workspace/terryai-website
npm run build
```

2. **手动上传到GitHub**
   - 访问: https://github.com/TerryAI3/TerryAI3.github.io/tree/gh-pages
   - 点击"Add file" → "Upload files"
   - 上传 `dist/public` 目录所有文件
   - 提交更改

## 部署验证命令
```bash
# 等待1分钟后检查
sleep 60
curl -s https://zuodii.com | grep -o "四大品牌" && echo "✅ 更新成功" || echo "❌ 更新失败"
```

## 紧急联系方式
- **部署失败**: 使用手动上传方案
- **网站异常**: 检查GitHub Pages状态
- **功能问题**: 查看浏览器控制台

**立即部署，立即生效!** 🚀
