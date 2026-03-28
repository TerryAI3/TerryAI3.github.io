#!/bin/bash
# 设置3天冲刺Cron任务
# 执行时间：每天北京时间02:00-06:00 (UTC 18:00-22:00)
# 执行日期：2026-03-27 至 2026-03-29

set -e

echo "=== 设置3天冲刺Cron任务 ==="
echo "执行时间：北京时间02:00-06:00 (UTC 18:00-22:00)"
echo "执行日期：2026-03-27 至 2026-03-29"
echo ""

# 脚本路径
SPRINT_SCRIPT="/root/.openclaw/workspace/scripts/3day_sprint.sh"
CRON_LOG="/root/.openclaw/workspace/logs/3day_sprint_cron.log"

# 检查脚本是否存在
if [ ! -f "$SPRINT_SCRIPT" ]; then
    echo "❌ 错误：冲刺脚本不存在: $SPRINT_SCRIPT"
    exit 1
fi

# 创建日志目录
mkdir -p /root/.openclaw/workspace/logs

# 设置Cron任务
echo "设置Cron任务..."
echo ""

# 删除可能存在的旧任务
(crontab -l 2>/dev/null | grep -v "3day_sprint.sh") | crontab -

# 添加新的Cron任务
# 北京时间02:00 = UTC 18:00
# 北京时间06:00 = UTC 22:00
# 我们设置从18:00开始，每小时执行一次，持续4小时

# 添加Cron任务
(crontab -l 2>/dev/null; echo "# 佐迪智能3天冲刺任务 - 2026-03-27 至 2026-03-29") | crontab -
(crontab -l 2>/dev/null; echo "0 18 27-29 3 * /bin/bash $SPRINT_SCRIPT >> $CRON_LOG 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 19 27-29 3 * /bin/bash $SPRINT_SCRIPT >> $CRON_LOG 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 20 27-29 3 * /bin/bash $SPRINT_SCRIPT >> $CRON_LOG 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 21 27-29 3 * /bin/bash $SPRINT_SCRIPT >> $CRON_LOG 2>&1") | crontab -

echo "✅ Cron任务设置完成"
echo ""
echo "📅 任务安排："
echo "2026-03-27 UTC 18:00, 19:00, 20:00, 21:00 (第一天)"
echo "2026-03-28 UTC 18:00, 19:00, 20:00, 21:00 (第二天)"
echo "2026-03-29 UTC 18:00, 19:00, 20:00, 21:00 (第三天)"
echo ""
echo "对应北京时间："
echo "2026-03-28 02:00, 03:00, 04:00, 05:00 (第一天)"
echo "2026-03-29 02:00, 03:00, 04:00, 05:00 (第二天)"
echo "2026-03-30 02:00, 03:00, 04:00, 05:00 (第三天)"
echo ""
echo "📋 查看Cron任务："
crontab -l | grep -A5 "3天冲刺"
echo ""
echo "📝 日志文件：$CRON_LOG"
echo "🚀 3天冲刺计划已启动，将从2026-03-27开始执行！"