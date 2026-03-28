#!/bin/bash
# 小红书发布数据分析仪表板
# 分析发布效果和优化建议

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 目录定义
SCRIPT_DIR=$(dirname "$0")
RECORD_FILE="../../小红书发布记录.md"
SCHEDULE_FILE="../schedule.json"
LOG_DIR="../logs"
REPORT_DIR="../reports"

# 创建报告目录
mkdir -p "$REPORT_DIR"

# 显示帮助
show_help() {
    echo -e "${BLUE}小红书发布数据分析仪表板${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo -e "${GREEN}使用方法：${NC}"
    echo "  $0 [分析类型] [选项]"
    echo ""
    echo -e "${GREEN}分析类型：${NC}"
    echo "  overview         总体概览（默认）"
    echo "  daily            每日分析"
    echo "  content          内容类型分析"
    echo "  performance      发布性能分析"
    echo "  recommendations  优化建议"
    echo "  report           生成详细报告"
    echo ""
    echo -e "${GREEN}选项：${NC}"
    echo "  -h, --help       显示此帮助信息"
    echo "  -d, --days N     分析最近N天的数据（默认：30）"
    echo "  -o, --output FILE 输出到文件"
    echo ""
    echo -e "${GREEN}示例：${NC}"
    echo "  $0 overview"
    echo "  $0 daily -d 7"
    echo "  $0 report -o 月度报告.md"
    echo -e "${CYAN}========================================${NC}"
}

# 总体概览
analyze_overview() {
    local days="${1:-30}"
    
    echo -e "${BLUE}小红书发布总体概览（最近${days}天）${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    # 统计发布数量
    total_posts=$(grep -c "标题:" "$RECORD_FILE" 2>/dev/null || echo "0")
    recent_posts=$(grep "$(date -d "$days days ago" +%Y-%m-%d)" "$RECORD_FILE" 2>/dev/null | grep -c "标题:" || echo "0")
    
    echo -e "${GREEN}📊 发布统计：${NC}"
    echo -e "  总发布数量：${YELLOW}$total_posts${NC} 篇"
    echo -e "  最近${days}天发布：${YELLOW}$recent_posts${NC} 篇"
    
    # 统计发布状态
    success_count=$(grep "状态: 0" "$RECORD_FILE" 2>/dev/null | wc -l || echo "0")
    timeout_count=$(grep "状态: 124" "$RECORD_FILE" 2>/dev/null | wc -l || echo "0")
    failed_count=$(grep "状态: 1" "$RECORD_FILE" 2>/dev/null | wc -l || echo "0")
    
    echo -e "${GREEN}📈 发布状态：${NC}"
    echo -e "  成功发布：${GREEN}$success_count${NC} 篇"
    echo -e "  超时发布：${YELLOW}$timeout_count${NC} 篇"
    echo -e "  失败发布：${RED}$failed_count${NC} 篇"
    
    if [ $total_posts -gt 0 ]; then
        success_rate=$((success_count * 100 / total_posts))
        echo -e "  成功率：${CYAN}$success_rate%${NC}"
    fi
    
    # 内容类型统计
    echo -e "${GREEN}📝 内容类型分布：${NC}"
    
    office_count=$(grep -i "办公\|设计\|空间" "$RECORD_FILE" 2>/dev/null | wc -l || echo "0")
    furniture_count=$(grep -i "家具\|家居\|选购" "$RECORD_FILE" 2>/dev/null | wc -l || echo "0")
    business_count=$(grep -i "商业\|案例\|项目" "$RECORD_FILE" 2>/dev/null | wc -l || echo "0")
    
    echo -e "  办公设计：${YELLOW}$office_count${NC} 篇"
    echo -e "  家具行业：${YELLOW}$furniture_count${NC} 篇"
    echo -e "  商业案例：${YELLOW}$business_count${NC} 篇"
    
    # 发布时间分析
    echo -e "${GREEN}⏰ 发布时间分布：${NC}"
    
    morning_count=$(grep "标题:" "$RECORD_FILE" 2>/dev/null | grep -E " 0[0-9]:| 1[0-1]:" | wc -l || echo "0")
    afternoon_count=$(grep "标题:" "$RECORD_FILE" 2>/dev/null | grep -E " 1[2-7]:" | wc -l || echo "0")
    evening_count=$(grep "标题:" "$RECORD_FILE" 2>/dev/null | grep -E " 1[8-9]:| 2[0-3]:" | wc -l || echo "0")
    
    echo -e "  上午（00:00-11:59）：${YELLOW}$morning_count${NC} 篇"
    echo -e "  下午（12:00-17:59）：${YELLOW}$afternoon_count${NC} 篇"
    echo -e "  晚上（18:00-23:59）：${YELLOW}$evening_count${NC} 篇"
    
    echo -e "${CYAN}========================================${NC}"
}

# 每日分析
analyze_daily() {
    local days="${1:-7}"
    
    echo -e "${BLUE}小红书每日发布分析（最近${days}天）${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    # 生成日期列表
    for ((i=days-1; i>=0; i--)); do
        date_str=$(date -d "$i days ago" +%Y-%m-%d)
        
        # 统计当天的发布
        daily_posts=$(grep "$date_str" "$RECORD_FILE" 2>/dev/null | grep -c "标题:" || echo "0")
        daily_success=$(grep "$date_str" "$RECORD_FILE" 2>/dev/null | grep "状态: 0" | wc -l || echo "0")
        
        if [ $daily_posts -gt 0 ]; then
            success_rate=$((daily_success * 100 / daily_posts))
            rate_color=$GREEN
            if [ $success_rate -lt 70 ]; then
                rate_color=$YELLOW
            fi
            if [ $success_rate -lt 50 ]; then
                rate_color=$RED
            fi
            
            echo -e "${GREEN}$date_str：${NC}${YELLOW}$daily_posts${NC} 篇发布，成功率：${rate_color}$success_rate%${NC}"
        else
            echo -e "${GREEN}$date_str：${NC}${YELLOW}0${NC} 篇发布"
        fi
    done
    
    echo -e "${CYAN}========================================${NC}"
    
    # 最佳发布时间建议
    echo -e "${BLUE}📅 最佳发布时间建议：${NC}"
    echo -e "${YELLOW}根据小红书用户活跃时间：${NC}"
    echo "  • 工作日：20:00-22:00（下班后）"
    echo "  • 工作日：12:00-13:00（午休时间）"
    echo "  • 周末：10:00-12:00"
    echo "  • 避免：深夜23:00后，清晨6:00前"
    
    echo -e "${CYAN}========================================${NC}"
}

# 内容类型分析
analyze_content() {
    echo -e "${BLUE}小红书内容类型分析${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    # 读取所有标题
    titles=$(grep "标题:" "$RECORD_FILE" 2>/dev/null | sed 's/.*标题: //' | head -20)
    
    if [ -z "$titles" ]; then
        echo -e "${YELLOW}暂无发布记录${NC}"
        return
    fi
    
    echo -e "${GREEN}📋 最近发布标题：${NC}"
    echo "$titles" | while read title; do
        echo -e "  • ${YELLOW}$title${NC}"
    done
    
    echo -e "${CYAN}----------------------------------------${NC}"
    
    # 标题长度分析
    echo -e "${GREEN}📏 标题长度分析：${NC}"
    
    title_lengths=$(echo "$titles" | while read title; do
        echo ${#title}
    done)
    
    avg_length=$(echo "$title_lengths" | awk '{sum+=$1} END {if(NR>0) print int(sum/NR)}')
    max_length=$(echo "$title_lengths" | sort -nr | head -1)
    min_length=$(echo "$title_lengths" | sort -n | head -1)
    
    echo -e "  平均长度：${YELLOW}$avg_length${NC} 字符"
    echo -e "  最大长度：${YELLOW}$max_length${NC} 字符"
    echo -e "  最小长度：${YELLOW}$min_length${NC} 字符"
    
    if [ $avg_length -gt 20 ]; then
        echo -e "  ${RED}⚠️  警告：平均标题长度超过20字符，建议缩短${NC}"
    else
        echo -e "  ${GREEN}✅ 标题长度符合要求${NC}"
    fi
    
    echo -e "${CYAN}----------------------------------------${NC}"
    
    # 关键词分析
    echo -e "${GREEN}🔑 高频关键词：${NC}"
    
    keywords=$(echo "$titles" | tr ' ' '\n' | grep -v "^$" | sort | uniq -c | sort -nr | head -10)
    
    if [ -n "$keywords" ]; then
        echo "$keywords" | while read count keyword; do
            echo -e "  ${YELLOW}$keyword${NC} (${count}次)"
        done
    else
        echo -e "  ${YELLOW}暂无关键词数据${NC}"
    fi
    
    echo -e "${CYAN}========================================${NC}"
}

# 发布性能分析
analyze_performance() {
    echo -e "${BLUE}小红书发布性能分析${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    # 检查日志文件
    if [ ! -d "$LOG_DIR" ] || [ -z "$(ls -A "$LOG_DIR" 2>/dev/null)" ]; then
        echo -e "${YELLOW}暂无性能日志数据${NC}"
        return
    fi
    
    # 分析最近10个日志文件
    recent_logs=$(find "$LOG_DIR" -name "*.log" -type f | sort -r | head -10)
    
    echo -e "${GREEN}📊 最近发布性能：${NC}"
    
    total_time=0
    log_count=0
    
    for log_file in $recent_logs; do
        # 提取发布时间信息
        if grep -q "发布命令执行完成" "$log_file"; then
            status="${GREEN}成功${NC}"
        elif grep -q "发布命令超时" "$log_file"; then
            status="${YELLOW}超时${NC}"
        else
            status="${RED}失败${NC}"
        fi
        
        # 提取时间信息（简化处理）
        log_name=$(basename "$log_file")
        echo -e "  ${YELLOW}$log_name${NC} - 状态：$status"
        
        log_count=$((log_count + 1))
    done
    
    if [ $log_count -eq 0 ]; then
        echo -e "  ${YELLOW}暂无有效日志数据${NC}"
    fi
    
    echo -e "${CYAN}----------------------------------------${NC}"
    
    # 常见错误分析
    echo -e "${GREEN}⚠️  常见错误分析：${NC}"
    
    error_logs=$(find "$LOG_DIR" -name "*.log" -type f -exec grep -l "错误\|失败\|Error\|Failed" {} \; | head -5)
    
    if [ -n "$error_logs" ]; then
        echo "$error_logs" | while read log_file; do
            error_msg=$(grep -i "错误\|失败\|Error\|Failed" "$log_file" | head -1)
            if [ -n "$error_msg" ]; then
                log_name=$(basename "$log_file")
                echo -e "  ${YELLOW}$log_name${NC}: ${RED}$error_msg${NC}"
            fi
        done
    else
        echo -e "  ${GREEN}✅ 未发现常见错误${NC}"
    fi
    
    echo -e "${CYAN}========================================${NC}"
}

# 优化建议
analyze_recommendations() {
    echo -e "${BLUE}小红书发布优化建议${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    # 基于数据分析给出建议
    echo -e "${GREEN}🎯 内容优化建议：${NC}"
    echo "1. ${YELLOW}标题优化${NC}"
    echo "   • 控制在20字以内"
    echo "   • 使用emoji增加吸引力"
    echo "   • 包含核心关键词"
    echo ""
    echo "2. ${YELLOW}内容结构优化${NC}"
    echo "   • 使用分段和emoji"
    echo "   • 添加数据和案例支撑"
    echo "   • 结尾加入互动话题"
    echo ""
    echo "3. ${YELLOW}图片优化${NC}"
    echo "   • 使用高清、相关图片"
    echo "   • 图片数量1-3张最佳"
    echo "   • 避免版权问题（使用Pexels等免费图库）"
    
    echo -e "${CYAN}----------------------------------------${NC}"
    
    echo -e "${GREEN}🚀 发布策略优化：${NC}"
    echo "1. ${YELLOW}发布时间优化${NC}"
    echo "   • 最佳：工作日20:00-22:00"
    echo "   • 次佳：工作日12:00-13:00"
    echo "   • 周末：10:00-12:00"
    echo ""
    echo "2. ${YELLOW}标签策略优化${NC}"
    echo "   • 核心关键词2-3个"
    echo "   • 长尾关键词3-4个"
    echo "   • 流量标签2-3个"
    echo "   • 总数不超过10个"
    echo ""
    echo "3. ${YELLOW}A/B测试建议${NC}"
    echo "   • 测试不同标题的点击率"
    echo "   • 测试不同图片的吸引力"
    echo "   • 测试不同标签组合"
    
    echo -e "${CYAN}----------------------------------------${NC}"
    
    echo -e "${GREEN}📈 数据跟踪建议：${NC}"
    echo "1. ${YELLOW}关键指标${NC}"
    echo "   • 发布成功率"
    echo "   • 互动率（点赞+评论+收藏）/曝光"
    echo "   • 搜索排名"
    echo ""
    echo "2. ${YELLOW}优化循环${NC}"
    echo "   • 发布 → 分析 → 优化 → 再发布"
    echo "   • 每周回顾发布效果"
    echo "   • 每月调整发布策略"
    
    echo -e "${CYAN}========================================${NC}"
}

# 生成详细报告
generate_report() {
    local output_file="${1:-$REPORT_DIR/小红书发布分析报告_$(date +%Y%m%d).md}"
    local days="${2:-30}"
    
    echo -e "${BLUE}生成详细分析报告：$output_file${NC}"
    
    # 生成报告内容
    {
        echo "# 小红书发布分析报告"
        echo ""
        echo "## 报告信息"
        echo "- 生成时间：$(date)"
        echo "- 分析周期：最近${days}天"
        echo "- 数据来源：$RECORD_FILE"
        echo ""
        echo "---"
        echo ""
        echo "## 1. 总体概览"
        echo ""
        # 调用概览分析并转换为markdown
        echo "### 发布统计"
        total_posts=$(grep -c "标题:" "$RECORD_FILE" 2>/dev/null || echo "0")
        recent_posts=$(grep "$(date -d "$days days ago" +%Y-%m-%d)" "$RECORD_FILE" 2>/dev/null | grep -c "标题:" || echo "0")
        echo "- 总发布数量：$total_posts 篇"
        echo "- 最近${days}天发布：$recent_posts 篇"
        echo ""
        echo "### 发布状态"
        success_count=$(grep "状态: 0" "$RECORD_FILE" 2>/dev/null | wc -l || echo "0")
        timeout_count=$(grep "状态: 124" "$RECORD_FILE" 2>/dev/null | wc -l || echo "0")
        failed_count=$(grep "状态: 1" "$RECORD_FILE" 2>/dev/null | wc -l || echo "0")
        echo "- 成功发布：$success_count 篇"
        echo "- 超时发布：$timeout_count 篇"
        echo "- 失败发布：$failed_count 篇"
        
        if [ $total_posts -gt 0 ]; then
            success_rate=$((success_count * 100 / total_posts))
            echo "- 成功率：$success_rate%"
        fi
        echo ""
        echo "### 内容类型分布"
        office_count=$(grep -i "办公\|设计\|空间" "$RECORD_FILE" 2>/dev/null | wc -l || echo "0")
        furniture_count=$(grep -i "家具\|家居\|选购" "$RECORD_FILE" 2>/dev/null | wc -l || echo "0")
        business_count=$(grep -i "商业\|案例\|项目" "$RECORD_FILE" 2>/dev/null | wc -l || echo "0")
        echo "- 办公设计：$office_count 篇"
        echo "- 家具行业：$furniture_count 篇"
        echo "- 商业案例：$business_count 篇"
        echo ""
        echo "---"
        echo ""
        echo "## 2. 每日分析"
        echo ""
        echo "| 日期 | 发布数量 | 成功率 |"
        echo "|------|----------|--------|"
        
        # 生成每日数据表格
        for ((i=days-1; i>=0; i--)); do
            date_str=$(date -d "$i days ago" +%Y-%m-%d)
            daily_posts=$(grep "$date_str" "$RECORD_FILE" 2>/dev/null | grep -c "标题:" || echo "0")
            daily_success=$(grep "$date_str" "$RECORD_FILE" 2>/dev/null | grep "状态: 0" | wc -l || echo "0")
            
            if [ $daily_posts -gt 0 ]; then
                success_rate=$((daily_success * 100 / daily_posts))
                echo "| $date_str | $daily_posts | $success_rate% |"
            else
                echo "| $date_str | 0 | - |"
            fi
        done
        echo ""
        echo "---"
        echo ""
        echo "## 3. 内容分析"
        echo ""
        echo "### 标题长度分析"
        titles=$(grep "标题:" "$RECORD_FILE" 2>/dev/null | sed 's/.*标题: //' | head -20)
        if [ -n "$titles" ]; then
            title_lengths=$(echo "$titles" | while read title; do
                echo ${#title}
            done)
            avg_length=$(echo "$title_lengths" | awk '{sum+=$1} END {if(NR>0) print int(sum/NR)}')
            max_length=$(echo "$title_lengths" | sort -nr | head -1)
            min_length=$(echo "$title_lengths" | sort -n | head -1)
            echo "- 平均长度：$avg_length 字符"
            echo "- 最大长度：$max_length 字符"
            echo "- 最小长度：$min_length 字符"
            
            if [ $avg_length -gt 20 ]; then
                echo "- ⚠️ 建议：平均标题长度超过20字符，建议缩短"
            fi
        fi
        echo ""
        echo "### 高频关键词"
        if [ -n "$titles" ]; then
            keywords=$(echo "$titles" | tr ' ' '\n' | grep -v "^$" | sort | uniq -c | sort -nr | head -10)
            if [ -n "$keywords" ]; then
                echo "$keywords" | while read count keyword; do
                    echo "- $keyword ($count次)"
                done
            fi
        fi
        echo ""
        echo "---"
        echo ""
        echo "## 4. 优化建议"
        echo ""
        echo "### 内容优化"
        echo "1. **标题优化**：控制在20字以内，使用emoji，包含核心关键词"
        echo "2. **内容结构**：使用分段和emoji，添加数据支撑，加入互动话题"
        echo "3. **图片优化**：使用高清相关图片，1-3张最佳，避免版权问题"
        echo ""
        echo "### 发布策略"
        echo "1. **时间优化**：工作日20:00-22:00最佳，午休时间次佳"
        echo "2. **标签策略**：核心关键词2-3个，长尾关键词3-4个，流量标签2-3个"
        echo "3. **A/B测试**：测试不同标题、图片、标签组合"
        echo ""
        echo "### 数据跟踪"
        echo "1. **关键指标**：发布成功率、互动率、搜索排名"
        echo "2. **优化循环**：发布 → 分析 → 优化 → 再发布"
        echo ""
        echo "---"
        echo ""
        echo "## 5. 行动计划"
        echo ""
        echo "### 短期行动（1周内）"
        echo "- [ ] 优化最近3篇内容的标题"
        echo "- [ ] 测试新的发布时间段"
        echo "- [ ] 分析互动数据，调整内容策略"
        echo ""
        echo "### 中期行动（1个月内）"
        echo "- [ ] 建立内容模板库"
        echo "- [ ] 实施A/B测试计划"
        echo "- [ ] 优化标签策略"
        echo ""
        echo "### 长期行动（3个月内）"
        echo "- [ ] 建立自动化发布流程"
        echo "- [ ] 构建数据分析体系"
        echo "- [ ] 扩大内容覆盖范围"
        echo ""
        echo "---"
        echo ""
        echo "*报告生成时间：$(date)*"
        echo "*数据仅供参考，实际效果需结合平台算法和用户反馈*"
        
    } > "$output_file"
    
    echo -e "${GREEN}✅ 报告生成完成：$output_file${NC}"
    echo -e "${CYAN}========================================${NC}"
}

# 主程序
main() {
    # 默认值
    ANALYSIS_TYPE="overview"
    DAYS=30
    OUTPUT_FILE=""
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -d|--days)
                DAYS="$2"
                shift 2
                ;;
            -o|--output)
                OUTPUT_FILE="$2"
                shift 2
                ;;
            -*)
                echo -e "${RED}错误：未知选项 $1${NC}"
                show_help
                exit 1
                ;;
            *)
                ANALYSIS_TYPE="$1"
                shift
                ;;
        esac
    done
    
    # 执行分析
    case $ANALYSIS_TYPE in
        overview)
            analyze_overview "$DAYS"
            ;;
        daily)
            analyze_daily "$DAYS"
            ;;
        content)
            analyze_content
            ;;
        performance)
            analyze_performance
            ;;
        recommendations)
            analyze_recommendations
            ;;
        report)
            generate_report "$OUTPUT_FILE" "$DAYS"
            ;;
        *)
            echo -e "${RED}错误：未知分析类型 $ANALYSIS_TYPE${NC}"
            show_help
            exit 1
            ;;
    esac
}

# 运行主程序
main "$@"