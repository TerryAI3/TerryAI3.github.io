#!/bin/bash

# 佐迪网站CDN部署脚本
# 作者：极客 (Geek)
# 日期：2026年4月12日

set -e  # 遇到错误退出

echo "🚀 开始部署佐迪网站到CDN..."

# 检查必要命令
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ 命令 $1 未安装，请先安装"
        exit 1
    fi
}

check_command "npm"
check_command "git"

# 构建网站
echo "📦 构建网站..."
npm run build

# 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist目录不存在"
    exit 1
fi

echo "✅ 构建完成，构建产物大小:"
du -sh dist/

# 提交到GitHub (gh-pages分支)
echo "🌐 部署到GitHub Pages..."
if [ -f "deploy-to-gh-pages.sh" ]; then
    bash deploy-to-gh-pages.sh
else
    echo "⚠️ 未找到deploy-to-gh-pages.sh，跳过GitHub Pages部署"
fi

# CDN部署配置
echo "📡 CDN配置说明:"
echo ""
echo "1. Cloudflare配置:"
echo "   - 登录Cloudflare控制台"
echo "   - 添加域名: terryai3.github.io"
echo "   - 修改DNS记录指向GitHub Pages"
echo "   - 启用代理状态 (橙色云图标)"
echo "   - 配置SSL/TLS为Full"
echo "   - 启用Always Use HTTPS"
echo ""
echo "2. 缓存规则配置:"
echo "   - 图片资源: 缓存1年"
echo "   - JS/CSS: 缓存1年"
echo "   - HTML: 不缓存"
echo ""
echo "3. 安全配置:"
echo "   - 启用WAF规则"
echo "   - 配置速率限制"
echo "   - 设置安全头"
echo ""
echo "4. 性能优化:"
echo "   - 启用Auto Minify (JS, CSS, HTML)"
echo "   - 启用Brotli压缩"
echo "   - 配置缓存级别: Standard"

# 创建Cloudflare Workers脚本示例
echo ""
echo "📝 Cloudflare Workers智能路由示例:"
cat > cloudflare-worker.js << 'EOF'
// 智能CDN路由 - 根据用户位置选择最佳CDN
addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // 只处理静态资源
  if (url.pathname.startsWith('/assets/')) {
    const country = request.headers.get('CF-IPCountry');
    
    // 国内用户使用阿里云CDN（如果需要）
    if (country === 'CN') {
      // 重写到阿里云CDN（需要配置）
      const cdnUrl = `https://cdn-zodii.aliyuncs.com${url.pathname}`;
      event.respondWith(fetch(cdnUrl, { headers: request.headers }));
    } else {
      // 国际用户使用Cloudflare CDN
      event.respondWith(fetch(request));
    }
  } else {
    // 其他请求直接通过
    event.respondWith(fetch(request));
  }
});
EOF

echo "✅ Cloudflare Workers脚本已保存到: cloudflare-worker.js"

# 创建监控脚本
echo ""
echo "📊 CDN性能监控脚本:"
cat > monitor-cdn.sh << 'EOF'
#!/bin/bash

# CDN性能监控脚本
echo "🔄 检查CDN性能..."

# 检查网站可用性
check_url() {
    local url=$1
    local name=$2
    echo -n "检查 $name ($url)... "
    
    if curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" | grep -q "200\|301\|302"; then
        echo "✅ 正常"
        return 0
    else
        echo "❌ 异常"
        return 1
    fi
}

# 测试不同地区的访问速度
test_speed() {
    local url=$1
    local location=$2
    echo -n "$location 访问速度... "
    
    local start_time=$(date +%s%N)
    curl -s -o /dev/null "$url"
    local end_time=$(date +%s%N)
    
    local duration=$(( (end_time - start_time) / 1000000 ))
    echo "${duration}ms"
}

# 测试URLs
MAIN_URL="https://terryai3.github.io"
CDN_URL="https://cdn.terryai3.com/assets/index-CwRbp4qa.js"

echo ""
echo "🌐 可用性测试:"
check_url "$MAIN_URL" "主网站"
check_url "$CDN_URL" "CDN资源"

echo ""
echo "⏱️  性能测试:"
test_speed "$MAIN_URL" "主站"
test_speed "$CDN_URL" "CDN资源"

echo ""
echo "📈 建议:"
echo "1. 监控CDN命中率 (>90%)"
echo "2. 监控响应时间 (<200ms)"
echo "3. 设置用量告警"
echo "4. 定期优化缓存策略"
EOF

chmod +x monitor-cdn.sh
echo "✅ 监控脚本已保存到: monitor-cdn.sh"

echo ""
echo "🎉 部署完成！"
echo ""
echo "下一步操作:"
echo "1. 配置Cloudflare DNS"
echo "2. 测试CDN加速效果"
echo "3. 运行监控脚本: ./monitor-cdn.sh"
echo "4. 根据监控结果优化配置"
echo ""
echo "💡 提示: 国内访问如需优化，可考虑阿里云CDN作为补充"