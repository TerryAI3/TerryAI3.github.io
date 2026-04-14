# 监控体系

## 概述
本文档描述了佐迪智能家具官网的监控体系，包括监控指标、监控工具、告警配置和故障响应流程。

## 监控架构
### 整体架构
```
数据采集 → 数据处理 → 数据存储 → 数据可视化 → 告警通知
    ↓           ↓           ↓           ↓           ↓
用户访问    Cloudflare   时序数据库    Grafana     Slack/邮件
性能测试    自定义脚本   日志文件    控制面板     短信通知
安全扫描    第三方服务   Cloud存储   报表系统     电话通知
```

### 监控层次
1. **基础设施层**: 服务器、网络、CDN
2. **应用层**: 网站可用性、性能、错误
3. **业务层**: 访问量、用户行为、转化率
4. **安全层**: 安全事件、攻击检测、漏洞扫描

## 监控指标
### 核心指标（黄金指标）
#### 1. 延迟（Latency）
- **首字节时间（TTFB）**: < 200ms
- **首屏加载时间**: < 2秒
- **最大内容绘制（LCP）**: < 2.5秒
- **交互响应时间**: < 100ms

#### 2. 流量（Traffic）
- **请求速率**: QPS（每秒查询数）
- **数据传输量**: 带宽使用
- **并发连接数**: 活跃连接数
- **用户会话数**: 活跃用户数

#### 3. 错误（Errors）
- **HTTP错误率**: < 0.1%
- **JavaScript错误率**: < 0.01%
- **API错误率**: < 0.5%
- **资源加载失败率**: < 0.1%

#### 4. 饱和度（Saturation）
- **CPU使用率**: < 70%
- **内存使用率**: < 80%
- **磁盘使用率**: < 85%
- **CDN缓存命中率**: > 90%

### 用户体验指标
#### 性能指标
- **首次输入延迟（FID）**: < 100ms
- **累积布局偏移（CLS）**: < 0.1
- **速度指数（Speed Index）**: < 3.0
- **总阻塞时间（TBT）**: < 200ms

#### 业务指标
- **页面浏览量（PV）**: 日/月统计
- **独立访客（UV）**: 日/月统计
- **平均会话时长**: > 2分钟
- **跳出率**: < 40%
- **转化率**: > 3%

### 技术指标
#### 前端性能
- **资源加载时间**: JS/CSS/图片加载时间
- **DOM就绪时间**: DOMContentLoaded时间
- **页面完全加载时间**: load事件时间
- **资源缓存命中率**: 浏览器缓存效果

#### 后端性能
- **API响应时间**: P50 < 100ms, P95 < 500ms
- **数据库查询时间**: < 50ms
- **缓存命中率**: > 95%
- **队列长度**: < 100

## 监控工具
### Cloudflare监控
#### 内置监控
1. **Analytics**
   - 流量分析
   - 安全事件
   - 性能指标
   - 带宽使用

2. **Logs**
   - HTTP请求日志
   - 防火墙日志
   - Workers日志
   - 速率限制日志

3. **Metrics**
   - 请求计数
   - 带宽使用
   - 缓存状态
   - 错误率

#### 配置示例
```javascript
// Cloudflare Workers监控
addEventListener('fetch', event => {
  const startTime = Date.now();
  
  event.respondWith(
    handleRequest(event.request).then(response => {
      const duration = Date.now() - startTime;
      
      // 发送监控数据
      sendMetrics({
        path: new URL(event.request.url).pathname,
        status: response.status,
        duration: duration,
        cf: event.request.cf
      });
      
      return response;
    })
  );
});
```

### 自定义监控脚本
#### 监控脚本：monitor-cdn.sh
```bash
#!/bin/bash
# CDN性能监控脚本

# 配置
MAIN_URL="https://zuodii.com"
CDN_URL="https://cdn.zuodii.com/assets/index-*.js"
ALERT_THRESHOLD_MS=5000  # 5秒超时告警
ERROR_THRESHOLD=5       # 连续错误次数

# 检查URL可用性
check_url() {
    local url=$1
    local name=$2
    
    echo -n "检查 $name ($url)... "
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" \
        --max-time 10 "$url")
    
    if [[ $status_code =~ ^(200|301|302)$ ]]; then
        echo "✅ 正常 ($status_code)"
        return 0
    else
        echo "❌ 异常 ($status_code)"
        return 1
    fi
}

# 测试访问速度
test_speed() {
    local url=$1
    local name=$2
    
    echo -n "$name 访问速度... "
    
    local start_time=$(date +%s%N)
    curl -s -o /dev/null "$url"
    local end_time=$(date +%s%N)
    
    local duration=$(( (end_time - start_time) / 1000000 ))
    echo "${duration}ms"
    
    # 检查是否超时
    if [ $duration -gt $ALERT_THRESHOLD_MS ]; then
        echo "⚠️  警告: $name 访问超时 (${duration}ms > ${ALERT_THRESHOLD_MS}ms)"
        send_alert "访问超时" "$name 访问时间 ${duration}ms"
    fi
    
    return $duration
}

# 发送告警
send_alert() {
    local subject=$1
    local message=$2
    
    echo "发送告警: $subject"
    echo "内容: $message"
    
    # 这里可以集成邮件、Slack、短信等通知方式
    # send_slack "$subject" "$message"
    # send_email "alert@zuodii.com" "$subject" "$message"
}

# 主监控逻辑
main() {
    echo "🔄 开始监控检查 - $(date)"
    echo "========================================"
    
    # 可用性检查
    echo "🌐 可用性检查:"
    check_url "$MAIN_URL" "主网站"
    local main_status=$?
    
    check_url "$CDN_URL" "CDN资源"
    local cdn_status=$?
    
    echo ""
    
    # 性能检查
    echo "⏱️  性能检查:"
    test_speed "$MAIN_URL" "主站"
    local main_speed=$?
    
    test_speed "$CDN_URL" "CDN资源"
    local cdn_speed=$?
    
    echo ""
    
    # 生成报告
    echo "📊 监控报告:"
    echo "主站状态: $( [ $main_status -eq 0 ] && echo "正常" || echo "异常" )"
    echo "CDN状态: $( [ $cdn_status -eq 0 ] && echo "正常" || echo "异常" )"
    echo "主站速度: ${main_speed}ms"
    echo "CDN速度: ${cdn_speed}ms"
    
    # 计算CDN加速比
    if [ $main_speed -gt 0 ] && [ $cdn_speed -gt 0 ]; then
        local speedup=$(( (main_speed - cdn_speed) * 100 / main_speed ))
        echo "CDN加速效果: ${speedup}%"
    fi
    
    echo ""
    echo "✅ 监控检查完成 - $(date)"
}

# 执行监控
main
```

### 第三方监控服务
#### UptimeRobot（免费）
- **功能**: 网站可用性监控
- **频率**: 每5分钟检查
- **通知**: 邮件、Slack、短信
- **仪表板**: 公开状态页面

#### Google Analytics
- **功能**: 用户行为分析
- **指标**: PV、UV、会话、转化
- **报告**: 自定义报告和仪表板
- **集成**: 与Google服务集成

#### Lighthouse CI
- **功能**: 自动化性能测试
- **指标**: 性能、可访问性、最佳实践、SEO
- **集成**: GitHub Actions、CI/CD
- **报告**: HTML报告、JSON数据

## 告警配置
### 告警级别
#### P0 - 紧急（立即响应）
- 网站完全不可用
- 安全攻击进行中
- 数据丢失或损坏

#### P1 - 高（1小时内响应）
- 性能严重下降（>50%）
- 错误率显著升高（>5%）
- 关键功能不可用

#### P2 - 中（4小时内响应）
- 性能中度下降（>20%）
- 非关键功能问题
- 配置错误

#### P3 - 低（24小时内响应）
- 轻微性能问题
- 建议性优化
- 信息性通知

### 告警规则示例
```yaml
# 告警规则配置
rules:
  - alert: WebsiteDown
    expr: up{job="website"} == 0
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "网站不可用"
      description: "网站已连续2分钟不可访问"
      
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "高错误率"
      description: "5xx错误率超过5%持续5分钟"
      
  - alert: SlowResponse
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "响应时间慢"
      description: "95%分位响应时间超过2秒持续10分钟"
```

### 通知渠道
#### 紧急通知
- **电话**: 直接呼叫负责人
- **短信**: 关键人员短信通知
- **Slack**: #alerts频道紧急消息

#### 重要通知
- **Slack**: #alerts频道
- **邮件**: 团队邮件列表
- **微信**: 团队微信群

#### 一般通知
- **Slack**: #monitoring频道
- **邮件**: 日报/周报
- **仪表板**: 可视化展示

## 故障响应流程
### 故障检测
1. **自动检测**: 监控系统发现异常
2. **告警触发**: 根据规则触发告警
3. **通知发送**: 通过配置渠道发送通知
4. **值班响应**: 值班人员确认告警

### 故障诊断
1. **信息收集**: 收集相关日志和指标
2. **影响评估**: 评估影响范围和严重程度
3. **根本原因分析**: 分析问题根本原因
4. **解决方案制定**: 制定修复方案

### 故障修复
1. **紧急缓解**: 实施临时解决方案
2. **根本修复**: 实施永久解决方案
3. **验证测试**: 验证修复效果
4. **监控恢复**: 确认监控指标恢复正常

### 事后分析
1. **事件回顾**: 召开事件回顾会议
2. **根本原因**: 确定根本原因
3. **改进措施**: 制定预防措施
4. **文档更新**: 更新相关文档

## 监控仪表板
### Cloudflare仪表板
#### 概览视图
- **请求量**: 24小时趋势
- **带宽使用**: 流量分布
- **安全事件**: 威胁类型统计
- **性能指标**: 全球访问速度

#### 详细视图
- **缓存分析**: 命中率、节省带宽
- **安全分析**: 攻击来源、类型
- **性能分析**: 各地区访问速度
- **流量分析**: 用户分布、设备类型

### 自定义仪表板
#### 技术仪表板
```javascript
// 使用Grafana或自定义实现
const dashboard = {
  panels: [
    {
      title: "网站可用性",
      type: "stat",
      metrics: ["uptime_percentage"],
      thresholds: [99, 99.9]
    },
    {
      title: "性能趋势",
      type: "timeseries",
      metrics: ["response_time_p50", "response_time_p95"],
      yAxis: "毫秒"
    },
    {
      title: "错误率",
      type: "timeseries",
      metrics: ["error_rate_4xx", "error_rate_5xx"],
      yAxis: "百分比"
    },
    {
      title: "CDN效果",
      type: "stat",
      metrics: ["cdn_hit_rate", "bandwidth_saved"],
      thresholds: [90, 95]
    }
  ]
};
```

#### 业务仪表板
- **访问统计**: PV、UV、会话数
- **用户行为**: 页面停留、跳出率
- **转化漏斗**: 关键路径转化率
- **用户反馈**: 满意度评分、反馈内容

## 监控最佳实践
### 数据收集
1. **全面性**: 收集所有关键指标
2. **实时性**: 近实时数据收集
3. **准确性**: 确保数据准确可靠
4. **一致性**: 数据格式和单位统一

### 告警管理
1. **避免告警疲劳**: 合理设置阈值和频率
2. **分级告警**: 根据严重程度分级
3. **自动恢复**: 自动恢复的故障不告警
4. **告警聚合**: 相关告警聚合通知

### 仪表板设计
1. **层次清晰**: 从概览到详细
2. **重点突出**: 突出关键指标
3. **易于理解**: 使用直观的可视化
4. **快速响应**: 支持快速故障定位

### 持续改进
1. **定期评审**: 定期评审监控配置
2. **指标优化**: 根据业务变化调整指标
3. **工具评估**: 评估新工具和技术
4. **流程优化**: 优化监控和响应流程

## 监控检查清单
### 日常检查
- [ ] 网站可用性正常
- [ ] 性能指标在阈值内
- [ ] 错误率正常
- [ ] CDN缓存命中率正常
- [ ] 安全事件无异常
- [ ] 监控系统本身正常

### 每周检查
- [ ] 监控数据趋势分析
- [ ] 告警规则有效性评估
- [ ] 仪表板数据准确性
- [ ] 监控覆盖完整性
- [ ] 监控工具状态检查

### 每月检查
- [ ] 监控体系整体评估
- [ ] 关键指标阈值调整
- [ ] 监控工具性能评估
- [ ] 监控流程优化
- [ ] 监控报告生成

## 监控文档和报告
### 监控报告模板
```markdown
# 监控报告 - 2026年4月第2周

## 执行摘要
- **整体状态**: 正常
- **可用性**: 99.99%
- **平均响应时间**: 245ms
- **关键事件**: 无

## 详细指标

### 可用性
- **主站可用性**: 100%
- **CDN可用性**: 100%
- **API可用性**: 99.98%

### 性能
- **平均响应时间**: 245ms (目标: <500ms)
- **P95响应时间**: 512ms (目标: <1000ms)
- **首屏加载时间**: 1.8s (目标: <2s)

### 流量
- **总请求数**: 1,234,567
- **峰值QPS**: 45
- **总带宽**: 12.3GB
- **CDN节省**: 9.8GB (80%)

### 错误
- **错误率**: 0.05% (目标: <0.1%)
- **5xx错误**: 23次
- **4xx错误**: 456次
- **JS错误**: 12次

## 关键事件
无关键事件

## 改进建议
1. 优化图片资源，减少加载时间
2. 增加国内CDN节点监控
3. 完善用户行为监控

## 下周重点
1. 实施图片优化方案
2. 部署国内CDN监控
3. 分析用户行为数据
```

---

**最后更新**: 2026年4月12日  
**文档版本**: v1.0  
**维护者**: 极客 (Geek)  
**状态**: ✅ 已完成