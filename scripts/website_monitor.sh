#!/bin/bash
# 佐迪智能网站状态监控脚本

DOMAIN="zuodii.com"
LOG_FILE="/tmp/zodi_website_monitor.log"
ALERT_FILE="/tmp/zodi_website_alert.log"
STATUS_FILE="/tmp/zodi_website_status.json"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 创建日志目录
mkdir -p $(dirname $LOG_FILE)

# 监控函数
monitor_website() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local status=""
    local details=""
    
    echo "=== 网站监控检查 [$timestamp] ==="
    
    # 1. 检查域名解析
    echo "1. 检查域名解析..."
    if nslookup $DOMAIN 8.8.8.8 &> /dev/null; then
        status="✅ 域名解析正常"
        details="DNS解析成功"
    else
        status="🔴 域名解析失败"
        details="NXDOMAIN错误 - 域名可能过期或DNS配置错误"
    fi
    echo "   $status"
    
    # 2. 检查HTTP访问
    echo "2. 检查HTTP访问..."
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" --max-time 10 2>/dev/null || echo "000")
    
    if [[ $http_code == "200" ]]; then
        status="✅ HTTP访问正常 (200)"
        details="网站可正常访问"
    elif [[ $http_code == "000" ]]; then
        status="🔴 无法连接"
        details="网络连接失败或服务器宕机"
    else
        status="⚠️ HTTP错误 ($http_code)"
        details="服务器返回错误状态码"
    fi
    echo "   $status"
    
    # 3. 检查响应时间
    echo "3. 检查响应时间..."
    response_time=$(curl -s -o /dev/null -w "%{time_total}" "https://$DOMAIN" --max-time 10 2>/dev/null || echo "10.000")
    
    if (( $(echo "$response_time < 2" | bc -l) )); then
        status="✅ 响应时间正常 (${response_time}s)"
    elif (( $(echo "$response_time < 5" | bc -l) )); then
        status="⚠️ 响应时间较慢 (${response_time}s)"
    else
        status="🔴 响应时间超时 (${response_time}s)"
    fi
    echo "   $status"
    
    # 记录到日志文件
    echo "[$timestamp] 域名解析: $details | HTTP状态: $http_code | 响应时间: ${response_time}s" >> $LOG_FILE
    
    # 生成JSON状态文件
    cat > $STATUS_FILE << EOF
{
  "timestamp": "$timestamp",
  "domain": "$DOMAIN",
  "dns_status": "$(nslookup $DOMAIN 8.8.8.8 &> /dev/null && echo "healthy" || echo "failed")",
  "http_status": "$http_code",
  "response_time": $response_time,
  "overall_status": "$([[ $http_code == "200" ]] && echo "healthy" || echo "unhealthy")"
}
EOF
    
    # 检查是否需要告警
    if [[ $http_code != "200" ]]; then
        echo "[$timestamp] 🔴 网站故障告警: HTTP状态码 $http_code" >> $ALERT_FILE
        echo -e "${RED}⚠️ 网站故障告警！${NC}"
        echo -e "详细信息已记录到: $ALERT_FILE"
        return 1
    fi
    
    echo -e "${GREEN}✅ 网站状态正常${NC}"
    return 0
}

# 生成监控报告
generate_report() {
    echo "=== 网站监控报告 ==="
    echo "监控域名: $DOMAIN"
    echo "日志文件: $LOG_FILE"
    echo "告警文件: $ALERT_FILE"
    echo "状态文件: $STATUS_FILE"
    echo ""
    
    # 显示最近5条日志
    echo "最近监控记录:"
    tail -5 $LOG_FILE 2>/dev/null || echo "暂无监控记录"
    echo ""
    
    # 显示告警记录
    if [[ -f $ALERT_FILE ]]; then
        echo "最近告警记录:"
        tail -5 $ALERT_FILE
    else
        echo "暂无告警记录"
    fi
}

# 主程序
main() {
    case "$1" in
        "monitor")
            monitor_website
            ;;
        "report")
            generate_report
            ;;
        "continuous")
            echo "开始连续监控，每5分钟检查一次 (Ctrl+C 停止)..."
            while true; do
                monitor_website
                echo "等待5分钟..."
                sleep 300
            done
            ;;
        *)
            echo "使用方法:"
            echo "  $0 monitor    - 执行一次监控检查"
            echo "  $0 report     - 生成监控报告"
            echo "  $0 continuous - 连续监控模式"
            ;;
    esac
}

# 执行主程序
main "$@"