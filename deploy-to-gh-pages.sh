#!/bin/bash

# 部署zuodii.com到GitHub Pages

echo "🚀 开始部署zuodii.com..."

# 1. 构建网站
echo "1. 🏗️ 构建网站..."
npm run build

# 2. 进入构建目录
cd dist/public

# 3. 初始化git仓库
echo "2. 📦 初始化Git..."
git init
git checkout -b gh-pages
git add .

# 4. 提交更改
echo "3. 💾 提交更改..."
git commit -m "🚀 部署zuodii.com四大品牌整合网站 - $(date '+%Y-%m-%d %H:%M:%S')

✅ 功能更新:
• 四大品牌整合展示
• 智能产品筛选系统
• 响应式设计优化
• 现代化用户体验
• 专业品牌形象建立

📊 技术特性:
• React + TypeScript架构
• 统一设计系统
• 智能产品数据模型
• 多维度筛选功能
• 移动端优先设计"

# 5. 添加远程仓库
echo "4. 🔗 添加远程仓库..."
git remote add origin https://github.com/TerryAI3/TerryAI3.github.io.git

# 6. 强制推送到gh-pages分支
echo "5. 📤 推送到GitHub Pages..."
git push -f origin gh-pages

echo ""
echo "🎉 部署完成!"
echo "🌐 网站地址: https://zuodii.com"
echo ""
echo "📋 部署验证:"
echo "1. 等待1-2分钟让GitHub Pages更新"
echo "2. 访问 https://zuodii.com"
echo "3. 检查所有功能是否正常工作"
echo "4. 测试移动端响应式设计"
echo ""
echo "🔧 故障排除:"
echo "• 如果404错误: 检查GitHub Pages设置"
echo "• 如果样式丢失: 清除浏览器缓存"
echo "• 如果功能异常: 检查控制台错误"
echo ""
echo "🚀 zuodii.com已更新!"
