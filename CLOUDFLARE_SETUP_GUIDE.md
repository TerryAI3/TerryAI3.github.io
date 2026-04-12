# ☁️ Cloudflare配置指南 - zuodii.com

## 🎯 配置目标
为 `zuodii.com` 配置Cloudflare CDN加速和安全防护，提升网站全球访问速度和安全性。

## 📋 前置条件
1. **域名所有权**: 确保你拥有 `zuodii.com` 域名的管理权限
2. **DNS访问**: 能够修改域名的DNS记录
3. **Cloudflare账户**: 注册Cloudflare免费账户

## 🚀 快速配置步骤

### 步骤1: 添加域名到Cloudflare
1. 登录 [Cloudflare控制台](https://dash.cloudflare.com)
2. 点击 "Add a Site"
3. 输入 `zuodii.com`
4. 选择免费计划 (Free Plan)

### 步骤2: 修改DNS记录
Cloudflare会扫描现有DNS记录，你需要：
1. **确认现有记录**:
   - `zuodii.com` A记录 → 当前主机IP
   - `www.zuodii.com` CNAME → `zuodii.com`
   - `cdn.zuodii.com` CNAME → `zuodii.com` (CDN专用)

2. **重要设置**:
   - 确保所有记录都启用代理 (橙色云图标)
   - 特别是 `cdn.zuodii.com` 必须启用代理

### 步骤3: 更新域名服务器
1. Cloudflare会提供两个域名服务器，例如:
   ```
   kurt.ns.cloudflare.com
   uma.ns.cloudflare.com
   ```

2. 到你的域名注册商处，将域名服务器修改为Cloudflare提供的

### 步骤4: 等待DNS传播
- 通常需要24-48小时完全生效
- 可以使用 `dig zuodii.com NS` 检查是否已切换

## ⚙️ 关键配置项

### 1. SSL/TLS设置
```
位置: SSL/TLS → Overview
设置: Full (严格)
```
- **Full (严格)**: 端到端加密，最高安全性
- **启用**: Always Use HTTPS
- **启用**: HSTS (推荐)

### 2. 缓存配置
```
位置: Caching → Configuration
```
- **缓存级别**: Standard
- **浏览器缓存TTL**: 1 month
- **边缘缓存TTL**: 1 year (静态资源)

### 3. 自动优化
```
位置: Speed → Optimization
```
- ✅ Auto Minify (JS, CSS, HTML)
- ✅ Brotli压缩
- ✅ Rocket Loader (谨慎启用，可能冲突)

### 4. 安全设置
```
位置: Security → Overview
```
- ✅ 安全级别: Medium
- ✅ 启用WAF
- ✅ 配置速率限制
- ✅ 防火墙规则

## 📁 静态资源CDN配置

### CDN域名: `cdn.zuodii.com`
专门用于静态资源加速：
- 图片: `.jpg`, `.webp`, `.png`
- 样式: `.css`
- 脚本: `.js`
- 字体: `.woff2`, `.ttf`

### 缓存规则示例
```nginx
# Cloudflare Page Rules 或 Workers
/*
缓存级别: Standard
边缘缓存TTL: 1 year
浏览器缓存TTL: 1 month
```

## 🔧 高级配置

### 1. Workers路由 (智能CDN)
```javascript
// 创建Worker: cdn-router
addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  const country = request.headers.get('CF-IPCountry');
  
  // 静态资源走CDN
  if (url.hostname === 'zuodii.com' && url.pathname.startsWith('/assets/')) {
    const cdnUrl = `https://cdn.zuodii.com${url.pathname}`;
    return event.respondWith(fetch(cdnUrl));
  }
  
  // 国内用户特殊处理（如需阿里云CDN）
  if (country === 'CN' && url.pathname.match(/\\.(jpg|webp|png|js|css)$/)) {
    // 可路由到阿里云CDN
    const aliyunCdn = `https://cdn-zodii.aliyuncs.com${url.pathname}`;
    return event.respondWith(fetch(aliyunCdn));
  }
  
  return event.respondWith(fetch(request));
});
```

### 2. 自定义缓存规则
```
位置: Caching → Configuration → Custom Cache Keys
```
为不同资源类型设置不同缓存策略：
- 图片: `public, max-age=31536000, immutable`
- JS/CSS: `public, max-age=31536000, immutable`
- HTML: `no-cache`

### 3. 防火墙规则
```
位置: Security → WAF → Firewall rules
```
建议规则:
1. 阻止可疑User-Agent
2. 限制登录尝试频率
3. 阻止恶意IP段

## 📊 性能监控

### 内置分析
```
位置: Analytics & Logs
```
- **Web Analytics**: 免费流量分析
- **Security Events**: 安全事件监控
- **Performance**: 性能指标

### 关键指标
- **缓存命中率**: > 90%
- **响应时间**: < 200ms
- **可用性**: > 99.9%
- **带宽节省**: 监控CDN节省的流量

## 🚨 故障排除

### 常见问题
1. **SSL证书错误**
   - 检查SSL/TLS设置为 "Full"
   - 等待证书自动签发 (最多24小时)
   - 源站必须支持HTTPS

2. **CDN资源404**
   - 检查 `cdn.zuodii.com` DNS记录
   - 确认源站文件存在
   - 检查Cloudflare缓存状态

3. **国内访问慢**
   - 考虑添加阿里云CDN作为补充
   - 使用Workers智能路由
   - 监控不同地区访问速度

4. **DNS未生效**
   ```
   # 检查DNS传播
   dig zuodii.com NS
   dig zuodii.com A
   nslookup zuodii.com
   ```

### 测试命令
```bash
# 测试CDN配置
curl -I https://zuodii.com
curl -I https://cdn.zuodii.com/assets/index.js

# 测试不同地区访问
curl --resolve zuodii.com:443:1.1.1.1 https://zuodii.com

# 检查SSL证书
openssl s_client -connect zuodii.com:443 -servername zuodii.com
```

## 🔄 维护流程

### 日常检查
1. 监控Cloudflare控制台告警
2. 检查缓存命中率
3. 查看安全事件
4. 监控带宽使用

### 更新部署
1. 更新网站代码
2. 运行 `./deploy-cdn.sh`
3. 清除Cloudflare缓存 (必要时)
   ```
   位置: Caching → Configuration → Purge Cache
   ```
4. 验证更新生效

### 紧急回滚
1. 临时禁用Cloudflare代理 (灰色云图标)
2. 直接访问源站
3. 排查问题
4. 重新启用

## 📈 优化建议

### 短期优化 (立即实施)
1. 配置正确的缓存规则
2. 启用Brotli压缩
3. 设置安全头
4. 配置WAF基础规则

### 中期优化 (1个月内)
1. 实施Workers智能路由
2. 添加阿里云CDN国内优化
3. 设置详细监控告警
4. 优化图片交付

### 长期优化 (3个月内)
1. 实施多CDN负载均衡
2. 深度性能优化
3. 自动化部署流水线
4. 高级安全防护

## 🆘 支持资源

### Cloudflare文档
- [入门指南](https://developers.cloudflare.com/fundamentals/get-started/)
- [SSL/TLS配置](https://developers.cloudflare.com/ssl/)
- [缓存优化](https://developers.cloudflare.com/cache/)
- [Workers文档](https://developers.cloudflare.com/workers/)

### 技术支持
- **Cloudflare社区**: community.cloudflare.com
- **客服支持**: 免费计划有基础支持
- **开发者论坛**: developers.cloudflare.com

### 监控工具
- **UptimeRobot**: 免费网站监控
- **Google PageSpeed Insights**: 性能测试
- **WebPageTest**: 深度性能分析

---

**配置状态**: ✅ 准备就绪  
**预估生效时间**: 24-48小时  
**维护团队**: 数字化特种部队  
**最后更新**: 2026年4月12日