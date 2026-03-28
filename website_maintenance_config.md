# 佐迪智能网站每日维护配置

## 📅 维护时间安排

### 每日维护
- **执行时间**: 每日 北京时间 02:00 - 03:00
- **UTC时间**: 每日 18:00 - 19:00 (前一日)
- **持续时间**: 约5-10分钟

### 维护内容
1. **网站状态检查**
   - 可访问性检查 (HTTP状态码)
   - 响应时间监控
   - 关键页面验证

2. **内容更新**
   - 维护日志更新
   - 内容优化建议
   - SEO检查

3. **GitHub同步**
   - 自动提交更改
   - 版本控制
   - 历史记录

## 🔧 技术配置

### 脚本文件
- **主脚本**: `/root/.openclaw/workspace/scripts/daily_website_maintenance.sh`
- **Cron设置**: `/root/.openclaw/workspace/scripts/setup_daily_maintenance_cron.sh`
- **执行权限**: `chmod +x`

### 仓库配置
- **GitHub仓库**: `TerryAI3/TerryAI3.github.io`
- **本地目录**: `/tmp/zuodii-daily-maintenance`
- **网站地址**: `https://zuodii.com`

### Git配置
- **用户名**: `TerryAI3`
- **邮箱**: `terryai3@users.noreply.github.com`
- **提交信息**: `每日维护 YYYY-MM-DD: 网站状态检查与日志更新`

## 📊 日志和报告

### 日志文件
- **Cron日志**: `/root/.openclaw/workspace/logs/cron_daily_maintenance.log`
- **每日日志**: `/root/.openclaw/workspace/logs/website_maintenance_YYYYMMDD.log`
- **保留策略**: 日志保留7天，报告保留30天

### 报告文件
- **每日报告**: `/root/.openclaw/workspace/reports/website_maintenance_report_YYYYMMDD.md`
- **维护日志**: 仓库中的 `MAINTENANCE_LOG.md`

## 🚀 自动化流程

### 执行流程
1. **克隆/更新仓库** → 2. **网站状态检查** → 3. **内容更新**
4. **提交到GitHub** → 5. **生成报告** → 6. **清理工作**

### 错误处理
- HTTP状态非200: 记录告警
- Git操作失败: 重试机制
- 网络问题: 超时处理

## 📋 维护记录模板

### 每日维护记录
```markdown
### YYYY-MM-DD 维护记录
- **检查时间**: YYYY-MM-DD HH:MM:SS
- **网站状态**: HTTP XXX, 响应时间 X.XXXs
- **关键页面**: 状态汇总
- **维护操作**: 执行的操作列表
- **Git提交**: 提交哈希和消息
```

### 维护报告
```markdown
# 佐迪智能网站每日维护报告
## 报告日期: YYYY-MM-DD

### 执行摘要
- **维护时间**: YYYY-MM-DD HH:MM:SS
- **网站状态**: HTTP XXX
- **响应时间**: X.XXX秒
- **更新提交**: 提交信息

### 详细检查结果
1. **网站可访问性**: ✅ 正常 / ⚠️ 警告 / ❌ 异常
2. **关键页面状态**: 状态汇总
3. **GitHub同步**: 完成状态
4. **维护日志**: 更新状态

### 后续建议
1. 优化建议1
2. 优化建议2
3. 优化建议3

### 技术指标
- 最后提交: `提交哈希 提交信息`
- 仓库状态: `X个未提交更改`
- 日志文件: `路径`
```

## 🔄 更新和调整

### 如何修改维护时间
```bash
# 编辑Cron任务
crontab -e

# 修改时间设置
# 北京时间 02:00 = UTC 18:00
0 18 * * * /path/to/script.sh
```

### 如何修改维护内容
编辑脚本文件: `/root/.openclaw/workspace/scripts/daily_website_maintenance.sh`

### 如何查看维护状态
```bash
# 查看Cron日志
tail -f /root/.openclaw/workspace/logs/cron_daily_maintenance.log

# 查看今日维护报告
cat /root/.openclaw/workspace/reports/website_maintenance_report_$(date +%Y%m%d).md

# 查看GitHub提交记录
cd /tmp/zuodii-daily-maintenance && git log --oneline -10
```

## ✅ 验证设置

### 测试执行
```bash
# 手动执行测试
/root/.openclaw/workspace/scripts/daily_website_maintenance.sh

# 查看测试结果
tail -f /root/.openclaw/workspace/logs/website_maintenance_$(date +%Y%m%d).log
```

### 检查Cron任务
```bash
# 查看所有Cron任务
crontab -l

# 检查Cron服务状态
systemctl status cron
```

---

**配置完成时间**: 2026-03-26 12:30 UTC
**下次维护执行**: 2026-03-26 18:00 UTC (北京时间 2026-03-27 02:00)
**配置状态**: ✅ 已激活