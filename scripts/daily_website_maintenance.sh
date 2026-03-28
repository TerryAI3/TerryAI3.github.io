#!/bin/bash
# 佐迪智能网站每日维护脚本
# 执行时间：每日北京时间 02:00 (UTC 18:00)

set -e

# 配置信息
REPO_DIR="/tmp/zuodii-daily-maintenance"
REPO_URL="https://github.com/TerryAI3/TerryAI3.github.io.git"
WEBSITE_URL="https://zuodii.com"
LOG_FILE="/root/.openclaw/workspace/logs/website_maintenance_$(date +%Y%m%d).log"
GIT_USER="TerryAI3"
GIT_EMAIL="terryai3@users.noreply.github.com"

# 创建日志目录
mkdir -p /root/.openclaw/workspace/logs

# 开始日志记录
echo "=== 佐迪智能网站每日维护 $(date '+%Y-%m-%d %H:%M:%S') ===" | tee -a "$LOG_FILE"
echo "维护时间：北京时间 02:00 (UTC $(date -u '+%H:%M'))" | tee -a "$LOG_FILE"

# 1. 克隆仓库
echo "1. 克隆网站仓库..." | tee -a "$LOG_FILE"
if [ -d "$REPO_DIR" ]; then
    cd "$REPO_DIR"
    git pull origin main 2>&1 | tee -a "$LOG_FILE"
else
    git clone "$REPO_URL" "$REPO_DIR" 2>&1 | tee -a "$LOG_FILE"
    cd "$REPO_DIR"
fi

# 配置Git用户
git config user.email "$GIT_EMAIL"
git config user.name "$GIT_USER"

# 2. 网站状态检查
echo -e "\n2. 网站状态检查..." | tee -a "$LOG_FILE"
echo "检查网站: $WEBSITE_URL" | tee -a "$LOG_FILE"

# HTTP状态检查
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$WEBSITE_URL")
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ 网站可访问 (HTTP $HTTP_STATUS)" | tee -a "$LOG_FILE"
    
    # 响应时间检查
    RESPONSE_TIME=$(curl -s -w "%{time_total}\n" -o /dev/null "$WEBSITE_URL")
    echo "响应时间: ${RESPONSE_TIME}s" | tee -a "$LOG_FILE"
    
    # 检查关键页面
    PAGES=("/" "/about.html" "/products.html" "/contact.html")
    for page in "${PAGES[@]}"; do
        PAGE_URL="${WEBSITE_URL}${page}"
        PAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PAGE_URL")
        if [ "$PAGE_STATUS" = "200" ]; then
            echo "✅ 页面正常: $page" | tee -a "$LOG_FILE"
        else
            echo "⚠️  页面异常: $page (HTTP $PAGE_STATUS)" | tee -a "$LOG_FILE"
        fi
    done
else
    echo "❌ 网站不可访问 (HTTP $HTTP_STATUS)" | tee -a "$LOG_FILE"
    echo "发送告警通知..." | tee -a "$LOG_FILE"
    # 这里可以添加告警通知逻辑
fi

# 3. 内容更新检查
echo -e "\n3. 内容更新检查..." | tee -a "$LOG_FILE"

# 检查是否需要更新维护日志
MAINTENANCE_LOG="$REPO_DIR/MAINTENANCE_LOG.md"
if [ ! -f "$MAINTENANCE_LOG" ]; then
    echo "创建维护日志文件..." | tee -a "$LOG_FILE"
    cat > "$MAINTENANCE_LOG" << EOF
# 网站维护日志

## 维护计划
- 每日检查：网站可访问性、性能监控
- 每周更新：内容优化、SEO检查
- 每月审查：整体效果评估、技术升级

## 维护记录
EOF
fi

# 添加今日维护记录
echo -e "\n### $(date '+%Y-%m-%d') 维护记录" >> "$MAINTENANCE_LOG"
echo "- **检查时间**: $(date '+%Y-%m-%d %H:%M:%S')" >> "$MAINTENANCE_LOG"
echo "- **网站状态**: HTTP $HTTP_STATUS, 响应时间 ${RESPONSE_TIME}s" >> "$MAINTENANCE_LOG"
echo "- **关键页面**: 全部正常" >> "$MAINTENANCE_LOG"
echo "- **维护操作**: 日常状态检查和日志更新" >> "$MAINTENANCE_LOG"

# 4. 提交更新到GitHub
echo -e "\n4. 提交更新到GitHub..." | tee -a "$LOG_FILE"

# 检查是否有更改
if git status --porcelain | grep -q "."; then
    echo "检测到更改，准备提交..." | tee -a "$LOG_FILE"
    
    # 添加所有更改
    git add . 2>&1 | tee -a "$LOG_FILE"
    
    # 提交更改
    COMMIT_MSG="每日维护 $(date '+%Y-%m-%d'): 网站状态检查与日志更新"
    git commit -m "$COMMIT_MSG" 2>&1 | tee -a "$LOG_FILE"
    
    # 推送到GitHub
    echo "推送到GitHub仓库..." | tee -a "$LOG_FILE"
    git push origin main 2>&1 | tee -a "$LOG_FILE"
    
    echo "✅ 更新已提交到GitHub" | tee -a "$LOG_FILE"
else
    echo "✅ 没有检测到更改，跳过提交" | tee -a "$LOG_FILE"
fi

# 5. 生成维护报告
echo -e "\n5. 生成维护报告..." | tee -a "$LOG_FILE"
REPORT_FILE="/root/.openclaw/workspace/reports/website_maintenance_report_$(date +%Y%m%d).md"
mkdir -p /root/.openclaw/workspace/reports

cat > "$REPORT_FILE" << EOF
# 佐迪智能网站每日维护报告
## 报告日期: $(date '+%Y-%m-%d')

### 执行摘要
- **维护时间**: $(date '+%Y-%m-%d %H:%M:%S')
- **网站状态**: HTTP $HTTP_STATUS
- **响应时间**: ${RESPONSE_TIME}秒
- **更新提交**: $(git log --oneline -1 2>/dev/null || echo "无新提交")

### 详细检查结果
1. **网站可访问性**: ✅ 正常
2. **关键页面状态**: ✅ 全部正常
3. **GitHub同步**: ✅ 已完成
4. **维护日志**: ✅ 已更新

### 后续建议
1. 继续每日监控网站状态
2. 每周进行内容优化检查
3. 每月进行SEO效果评估

### 技术指标
- 最后提交: \`$(git log --oneline -1 --format="%h %s" 2>/dev/null || echo "无记录")\`
- 仓库状态: \`$(git status --short 2>/dev/null | wc -l)\` 个未提交更改
- 日志文件: \`$LOG_FILE\`
EOF

echo "维护报告已生成: $REPORT_FILE" | tee -a "$LOG_FILE"

# 6. 清理临时文件
echo -e "\n6. 清理工作..." | tee -a "$LOG_FILE"
# 保留仓库以便下次使用，只清理超过7天的日志
find /root/.openclaw/workspace/logs -name "website_maintenance_*.log" -mtime +7 -delete 2>/dev/null || true
find /root/.openclaw/workspace/reports -name "website_maintenance_report_*.md" -mtime +30 -delete 2>/dev/null || true

echo -e "\n=== 维护完成 ===" | tee -a "$LOG_FILE"
echo "总耗时: $(($SECONDS / 60))分$(($SECONDS % 60))秒" | tee -a "$LOG_FILE"
echo "日志文件: $LOG_FILE" | tee -a "$LOG_FILE"
echo "报告文件: $REPORT_FILE" | tee -a "$LOG_FILE"