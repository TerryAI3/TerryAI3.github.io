#!/bin/bash

# 使用SSH部署zuodii.com到GitHub Pages

echo "🚀 SSH部署zuodii.com..."

# 1. 构建网站
echo "1. 🏗️ 构建网站..."
npm run build

# 2. 进入构建目录
cd dist/public

# 3. 初始化git仓库
echo "2. 📦 初始化Git..."
rm -rf .git
git init
git checkout -b gh-pages
git add .

# 4. 提交更改
echo "3. 💾 提交更改..."
git commit -m "🚀 部署zuodii.com四大品牌整合网站 - $(date '+%Y-%m-%d %H:%M:%S')

✅ 四大品牌整合:
• 玛祖铭立 - 高端国际化
• 欧林 - 智能专业
• 欧美斯 - 现代健康  
• 上海诗敏 - 教育专业

🎯 核心功能:
• 智能产品筛选系统
• 响应式移动端设计
• 统一设计系统
• 现代化用户体验

📊 技术架构:
• React + TypeScript
• 统一数据模型
• 组件化架构
• 性能优化"

# 5. 添加SSH远程仓库
echo "4. 🔗 添加SSH远程仓库..."
git remote add origin git@github.com:TerryAI3/TerryAI3.github.io.git

# 6. 强制推送到gh-pages分支
echo "5. 📤 推送到GitHub Pages..."
echo "使用SSH密钥推送..."
git push -f origin gh-pages

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 部署成功!"
    echo "🌐 网站地址: https://zuodii.com"
    echo ""
    echo "⏳ 等待GitHub Pages更新 (约1-2分钟)..."
    echo ""
    echo "📋 验证步骤:"
    echo "1. 访问 https://zuodii.com"
    echo "2. 检查首页功能"
    echo "3. 测试产品筛选"
    echo "4. 验证移动端设计"
else
    echo ""
    echo "❌ 部署失败!"
    echo ""
    echo "🔧 故障排除:"
    echo "1. 检查SSH密钥配置"
    echo "2. 验证GitHub仓库权限"
    echo "3. 检查网络连接"
    echo "4. 查看详细错误信息"
fi
