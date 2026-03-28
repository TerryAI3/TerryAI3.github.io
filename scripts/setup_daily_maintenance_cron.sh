#!/bin/bash
# 设置每日网站维护Cron任务

# 脚本路径
SCRIPT_PATH="/root/.openclaw/workspace/scripts/daily_website_maintenance.sh"
CRON_LOG="/root/.openclaw/workspace/logs/cron_daily_maintenance.log"

# 创建日志目录
mkdir -p /root/.openclaw/workspace/logs

# 北京时间 02:00 = UTC 18:00 (前一日)
# 注意：服务器时间是UTC，所以设置UTC时间
CRON_TIME="0 18 * * *"  # 每天UTC 18:00 (北京时间次日02:00)

echo "=== 设置佐迪智能网站每日维护Cron任务 ==="
echo "维护时间: 每日北京时间 02:00 (UTC 18:00)"
echo "脚本路径: $SCRIPT_PATH"
echo "日志文件: $CRON_LOG"

# 检查脚本是否存在
if [ ! -f "$SCRIPT_PATH" ]; then
    echo "❌ 错误: 维护脚本不存在: $SCRIPT_PATH"
    exit 1
fi

# 添加Cron任务
CRON_JOB="$CRON_TIME $SCRIPT_PATH >> $CRON_LOG 2>&1"

# 检查是否已存在相同任务
EXISTING_CRON=$(crontab -l 2>/dev/null | grep -F "$SCRIPT_PATH" || true)

if [ -n "$EXISTING_CRON" ]; then
    echo "⚠️  已存在Cron任务，更新中..."
    # 删除旧任务，添加新任务
    (crontab -l 2>/dev/null | grep -v "$SCRIPT_PATH"; echo "$CRON_JOB") | crontab -
else
    echo "✅ 添加新Cron任务..."
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
fi

# 验证Cron任务
echo -e "\n=== 当前Cron任务列表 ==="
crontab -l

echo -e "\n=== 任务详情 ==="
echo "执行时间: $CRON_TIME (UTC)"
echo "对应北京时间: 每日 02:00"
echo "执行命令: $SCRIPT_PATH"
echo "输出日志: $CRON_LOG"

# 创建首次测试任务（5分钟后执行）
TEST_TIME="$(date -d '5 minutes' '+%M %H') * * *"
TEST_CRON="$TEST_TIME $SCRIPT_PATH >> $CRON_LOG 2>&1"
echo -e "\n=== 添加测试任务（5分钟后执行）==="
(crontab -l 2>/dev/null; echo "$TEST_CRON") | crontab -

echo -e "\n✅ Cron任务设置完成！"
echo "测试任务将在5分钟后执行，请检查日志: $CRON_LOG"
echo "正式维护任务将从明天开始每日执行"