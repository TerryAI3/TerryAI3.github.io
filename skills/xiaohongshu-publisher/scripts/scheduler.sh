#!/bin/bash
# 小红书发布计划调度器
# 支持定时自动发布和发布计划管理

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
SCHEDULE_FILE="../schedule.json"
LOG_DIR="../logs"
CONTENT_DIR="../content-library"

# 创建必要目录
mkdir -p "$LOG_DIR" "$CONTENT_DIR"

# 显示帮助
show_help() {
    echo -e "${BLUE}小红书发布计划调度器${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo -e "${GREEN}使用方法：${NC}"
    echo "  $0 [命令] [选项]"
    echo ""
    echo -e "${GREEN}命令：${NC}"
    echo "  add                添加发布计划"
    echo "  list               列出所有发布计划"
    echo "  remove <计划ID>    删除发布计划"
    echo "  run                执行待发布的计划"
    echo "  test <计划ID>      测试发布计划（不实际发布）"
    echo "  status             显示调度器状态"
    echo "  clear-logs         清理旧日志"
    echo ""
    echo -e "${GREEN}选项：${NC}"
    echo "  -h, --help         显示此帮助信息"
    echo "  -v, --verbose      详细输出模式"
    echo ""
    echo -e "${GREEN}示例：${NC}"
    echo "  $0 add"
    echo "  $0 list"
    echo "  $0 run"
    echo "  $0 test plan_123"
    echo -e "${CYAN}========================================${NC}"
}

# 初始化计划文件
init_schedule_file() {
    if [ ! -f "$SCHEDULE_FILE" ]; then
        cat > "$SCHEDULE_FILE" << EOF
{
  "version": "1.0",
  "created": "$(date -Iseconds)",
  "schedules": []
}
EOF
        echo -e "${GREEN}✅ 初始化计划文件：$SCHEDULE_FILE${NC}"
    fi
}

# 添加发布计划
add_schedule() {
    echo -e "${BLUE}添加新的发布计划${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    # 生成计划ID
    PLAN_ID="plan_$(date +%s)_$(shuf -i 1000-9999 -n 1)"
    
    # 获取计划信息
    echo -e "${YELLOW}请输入计划信息：${NC}"
    
    read -p "计划名称: " PLAN_NAME
    read -p "发布时间（格式：YYYY-MM-DD HH:MM，留空为立即发布）: " SCHEDULE_TIME
    
    if [ -z "$SCHEDULE_TIME" ]; then
        SCHEDULE_TIME="immediate"
    fi
    
    # 选择内容类型
    echo -e "${YELLOW}选择内容类型：${NC}"
    echo "1. 办公空间设计案例"
    echo "2. 家具行业分析"
    echo "3. 商业案例分享"
    echo "4. 自定义内容"
    
    read -p "选择（1-4）: " CONTENT_TYPE_CHOICE
    
    case $CONTENT_TYPE_CHOICE in
        1)
            CONTENT_TYPE="office-design"
            TEMPLATE_NAME="办公空间设计案例"
            ;;
        2)
            CONTENT_TYPE="furniture-industry"
            TEMPLATE_NAME="家具行业分析"
            ;;
        3)
            CONTENT_TYPE="business-case"
            TEMPLATE_NAME="商业案例分享"
            ;;
        4)
            CONTENT_TYPE="custom"
            TEMPLATE_NAME="自定义内容"
            ;;
        *)
            CONTENT_TYPE="office-design"
            TEMPLATE_NAME="办公空间设计案例"
            ;;
    esac
    
    # 获取标题
    read -p "内容标题: " CONTENT_TITLE
    
    # 获取关键词
    read -p "关键词（用逗号分隔）: " KEYWORDS
    
    # 生成内容文件路径
    CONTENT_FILE="$CONTENT_DIR/${PLAN_ID}.md"
    
    # 如果是自定义内容，需要输入内容
    if [ "$CONTENT_TYPE" = "custom" ]; then
        echo -e "${YELLOW}请输入自定义内容（输入END结束）：${NC}"
        echo "# $CONTENT_TITLE" > "$CONTENT_FILE"
        echo "" >> "$CONTENT_FILE"
        
        while IFS= read -r line; do
            if [ "$line" = "END" ]; then
                break
            fi
            echo "$line" >> "$CONTENT_FILE"
        done
        
        echo -e "${GREEN}✅ 自定义内容已保存到：$CONTENT_FILE${NC}"
    else
        # 使用内容生成器生成内容
        echo -e "${BLUE}正在生成内容...${NC}"
        "$SCRIPT_DIR/content-generator.sh" "$CONTENT_TYPE" "$CONTENT_FILE" -t "$CONTENT_TITLE" -k "$KEYWORDS"
    fi
    
    # 获取图片URL
    echo -e "${YELLOW}图片URL（用逗号分隔，留空使用默认图片）：${NC}"
    read -p "图片URL: " IMAGE_URLS
    
    if [ -z "$IMAGE_URLS" ]; then
        case $CONTENT_TYPE in
            office-design)
                IMAGE_URLS='["https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg"]'
                ;;
            furniture-industry)
                IMAGE_URLS='["https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg"]'
                ;;
            business-case)
                IMAGE_URLS='["https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg"]'
                ;;
            *)
                IMAGE_URLS='["https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg"]'
                ;;
        esac
    else
        # 转换逗号分隔的URL为JSON数组
        IFS=',' read -ra URL_ARRAY <<< "$IMAGE_URLS"
        IMAGE_URLS="["
        for i in "${!URL_ARRAY[@]}"; do
            if [ $i -gt 0 ]; then
                IMAGE_URLS="$IMAGE_URLS,"
            fi
            IMAGE_URLS="$IMAGE_URLS\"${URL_ARRAY[$i]}\""
        done
        IMAGE_URLS="$IMAGE_URLS]"
    fi
    
    # 获取标签
    echo -e "${YELLOW}标签（用逗号分隔，留空使用默认标签）：${NC}"
    read -p "标签: " TAGS
    
    if [ -z "$TAGS" ]; then
        case $CONTENT_TYPE in
            office-design)
                TAGS='["办公空间设计","未来办公","办公室改造","智能办公室","员工福祉","可持续设计","办公家具","空间规划","工作效率","企业文化"]'
                ;;
            furniture-industry)
                TAGS='["办公家具","家具设计","家具选购","家具趋势","智能家具","环保家具","定制家具","家具品牌","家具搭配","家居设计"]'
                ;;
            business-case)
                TAGS='["商业案例","项目管理","价值工程","成本控制","技术创新","可持续发展","品牌建设","行业分析","市场趋势","商业智慧"]'
                ;;
            *)
                TAGS='["小红书","内容分享","经验分享","行业洞察","实用技巧"]'
                ;;
        esac
    else
        # 转换逗号分隔的标签为JSON数组
        IFS=',' read -ra TAG_ARRAY <<< "$TAGS"
        TAGS="["
        for i in "${!TAG_ARRAY[@]}"; do
            if [ $i -gt 0 ]; then
                TAGS="$TAGS,"
            fi
            TAGS="$TAGS\"${TAG_ARRAY[$i]}\""
        done
        TAGS="$TAGS]"
    fi
    
    # 创建计划对象
    PLAN_OBJECT=$(cat << EOF
    {
      "id": "$PLAN_ID",
      "name": "$PLAN_NAME",
      "status": "pending",
      "schedule_time": "$SCHEDULE_TIME",
      "content_type": "$CONTENT_TYPE",
      "content_title": "$CONTENT_TITLE",
      "content_file": "$CONTENT_FILE",
      "image_urls": $IMAGE_URLS,
      "tags": $TAGS,
      "created": "$(date -Iseconds)",
      "last_updated": "$(date -Iseconds)"
    }
EOF
)
    
    # 添加到计划文件
    if command -v jq >/dev/null 2>&1; then
        # 使用jq添加计划
        jq ".schedules += [$PLAN_OBJECT]" "$SCHEDULE_FILE" > "${SCHEDULE_FILE}.tmp" && mv "${SCHEDULE_FILE}.tmp" "$SCHEDULE_FILE"
    else
        # 如果没有jq，使用简单的文本处理
        echo -e "${YELLOW}警告：未找到jq命令，使用简单模式${NC}"
        # 这里简化处理，实际使用时建议安装jq
        sed -i '/"schedules": \[/a\'$'\n'"      $PLAN_OBJECT," "$SCHEDULE_FILE"
    fi
    
    echo -e "${CYAN}========================================${NC}"
    echo -e "${GREEN}✅ 发布计划添加成功！${NC}"
    echo -e "${CYAN}计划ID：${NC}$PLAN_ID"
    echo -e "${CYAN}计划名称：${NC}$PLAN_NAME"
    echo -e "${CYAN}发布时间：${NC}$SCHEDULE_TIME"
    echo -e "${CYAN}内容文件：${NC}$CONTENT_FILE"
    echo ""
    echo -e "${YELLOW}下一步操作：${NC}"
    echo "1. 查看计划：$0 list"
    echo "2. 测试发布：$0 test $PLAN_ID"
    echo "3. 执行发布：$0 run"
    echo -e "${CYAN}========================================${NC}"
}

# 列出所有发布计划
list_schedules() {
    echo -e "${BLUE}发布计划列表${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    if [ ! -f "$SCHEDULE_FILE" ]; then
        echo -e "${YELLOW}暂无发布计划${NC}"
        return
    fi
    
    if command -v jq >/dev/null 2>&1; then
        # 使用jq格式化输出
        jq -r '.schedules[] | "\(.id) | \(.name) | \(.status) | \(.schedule_time) | \(.content_title)"' "$SCHEDULE_FILE" | while read line; do
            echo -e "${GREEN}$line${NC}"
        done
    else
        # 简单文本输出
        grep -A5 '"id":' "$SCHEDULE_FILE" | while read line; do
            if [[ $line == *'"id":'* ]]; then
                id=$(echo "$line" | sed 's/.*"id": "\([^"]*\)".*/\1/')
                name=$(grep -A1 '"id": "'"$id"'"' "$SCHEDULE_FILE" | grep '"name":' | sed 's/.*"name": "\([^"]*\)".*/\1/')
                status=$(grep -A2 '"id": "'"$id"'"' "$SCHEDULE_FILE" | grep '"status":' | sed 's/.*"status": "\([^"]*\)".*/\1/')
                schedule_time=$(grep -A3 '"id": "'"$id"'"' "$SCHEDULE_FILE" | grep '"schedule_time":' | sed 's/.*"schedule_time": "\([^"]*\)".*/\1/')
                content_title=$(grep -A4 '"id": "'"$id"'"' "$SCHEDULE_FILE" | grep '"content_title":' | sed 's/.*"content_title": "\([^"]*\)".*/\1/')
                
                echo -e "${GREEN}$id | $name | $status | $schedule_time | $content_title${NC}"
            fi
        done
    fi
    
    echo -e "${CYAN}========================================${NC}"
    echo -e "${YELLOW}状态说明：${NC}"
    echo "  pending    - 等待发布"
    echo "  scheduled  - 已安排"
    echo "  published  - 已发布"
    echo "  failed     - 发布失败"
    echo "  testing    - 测试中"
}

# 执行发布计划
run_schedules() {
    echo -e "${BLUE}执行发布计划${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    if [ ! -f "$SCHEDULE_FILE" ]; then
        echo -e "${YELLOW}暂无发布计划${NC}"
        return
    fi
    
    CURRENT_TIME=$(date +%s)
    
    # 查找需要发布的计划
    if command -v jq >/dev/null 2>&1; then
        # 使用jq查询
        jq -r '.schedules[] | select(.status == "pending" or .status == "scheduled") | .id' "$SCHEDULE_FILE" | while read plan_id; do
            execute_plan "$plan_id"
        done
    else
        # 简单文本查询
        grep -B1 -A10 '"status": "pending"' "$SCHEDULE_FILE" | grep '"id":' | sed 's/.*"id": "\([^"]*\)".*/\1/' | while read plan_id; do
            execute_plan "$plan_id"
        done
    fi
    
    echo -e "${CYAN}========================================${NC}"
    echo -e "${GREEN}✅ 所有计划执行完成${NC}"
}

# 执行单个计划
execute_plan() {
    local plan_id="$1"
    
    echo -e "${BLUE}执行计划：$plan_id${NC}"
    
    # 获取计划详情
    if command -v jq >/dev/null 2>&1; then
        plan_name=$(jq -r ".schedules[] | select(.id == \"$plan_id\") | .name" "$SCHEDULE_FILE")
        content_file=$(jq -r ".schedules[] | select(.id == \"$plan_id\") | .content_file" "$SCHEDULE_FILE")
        content_title=$(jq -r ".schedules[] | select(.id == \"$plan_id\") | .content_title" "$SCHEDULE_FILE")
        image_urls=$(jq -r ".schedules[] | select(.id == \"$plan_id\") | .image_urls" "$SCHEDULE_FILE")
        tags=$(jq -r ".schedules[] | select(.id == \"$plan_id\") | .tags" "$SCHEDULE_FILE")
    else
        # 简单文本解析
        plan_name=$(grep -A10 '"id": "'"$plan_id"'"' "$SCHEDULE_FILE" | grep '"name":' | sed 's/.*"name": "\([^"]*\)".*/\1/')
        content_file=$(grep -A10 '"id": "'"$plan_id"'"' "$SCHEDULE_FILE" | grep '"content_file":' | sed 's/.*"content_file": "\([^"]*\)".*/\1/')
        content_title=$(grep -A10 '"id": "'"$plan_id"'"' "$SCHEDULE_FILE" | grep '"content_title":' | sed 's/.*"content_title": "\([^"]*\)".*/\1/')
        image_urls=$(grep -A10 '"id": "'"$plan_id"'"' "$SCHEDULE_FILE" | grep '"image_urls":' | sed 's/.*"image_urls": \(.*\),/\1/')
        tags=$(grep -A10 '"id": "'"$plan_id"'"' "$SCHEDULE_FILE" | grep '"tags":' | sed 's/.*"tags": \(.*\),/\1/')
    fi
    
    # 检查内容文件
    if [ ! -f "$content_file" ]; then
        echo -e "${RED}❌ 内容文件不存在：$content_file${NC}"
        update_plan_status "$plan_id" "failed" "内容文件不存在"
        return 1
    fi
    
    # 执行发布
    echo -e "${YELLOW}正在发布：$content_title${NC}"
    
    LOG_FILE="$LOG_DIR/${plan_id}_$(date +%Y%m%d_%H%M%S).log"
    
    # 使用发布脚本
    "$SCRIPT_DIR/publish.sh" "$content_title" "$content_file" "$image_urls" "$tags" > "$LOG_FILE" 2>&1
    
    PUBLISH_EXIT=$?
    
    # 检查发布结果
    if grep -q "发布命令执行完成\|发布命令超时" "$LOG_FILE"; then
        echo -e "${GREEN}✅ 发布成功（或后台处理中）${NC}"
        update_plan_status "$plan_id" "published" "发布完成"
    else
        echo -e "${RED}❌ 发布失败${NC}"
        update_plan_status "$plan_id" "failed" "发布失败"
        
        # 显示错误日志
        echo -e "${YELLOW}错误日志：${NC}"
        tail -10 "$LOG_FILE"
    fi
    
    echo -e "${CYAN}日志文件：$LOG_FILE${NC}"
}

# 更新计划状态
update_plan_status() {
    local plan_id="$1"
    local status="$2"
    local message="$3"
    
    if command -v jq >/dev/null 2>&1; then
        # 使用jq更新状态
        jq "(.schedules[] | select(.id == \"$plan_id\") | .status) = \"$status\"" "$SCHEDULE_FILE" > "${SCHEDULE_FILE}.tmp" && mv "${SCHEDULE_FILE}.tmp" "$SCHEDULE_FILE"
        jq "(.schedules[] | select(.id == \"$plan_id\") | .last_updated) = \"$(date -Iseconds)\"" "$SCHEDULE_FILE" > "${SCHEDULE_FILE}.tmp" && mv "${SCHEDULE_FILE}.tmp" "$SCHEDULE_FILE"
    else
        # 简单文本更新
        sed -i "/\"id\": \"$plan_id\"/,/\"last_updated\"/s/\"status\": \"[^\"]*\"/\"status\": \"$status\"/" "$SCHEDULE_FILE"
        sed -i "/\"id\": \"$plan_id\"/,/\"last_updated\"/s/\"last_updated\": \"[^\"]*\"/\"last_updated\": \"$(date -Iseconds)\"/" "$SCHEDULE_FILE"
    fi
    
    echo -e "${GREEN}✅ 计划状态更新：$plan_id -> $status${NC}"
}

# 测试发布计划
test_schedule() {
    local plan_id="$1"
    
    echo -e "${BLUE}测试发布计划：$plan_id${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    # 获取计划详情
    if command -v jq >/dev/null 2>&1; then
        plan_name=$(jq -r ".schedules[] | select(.id == \"$plan_id\") | .name" "$SCHEDULE_FILE")
        content_file=$(jq -r ".schedules[] | select(.id == \"$plan_id\") | .content_file" "$SCHEDULE_FILE")
        content_title=$(jq -r ".schedules[] | select(.id == \"$plan_id\") | .content_title" "$SCHEDULE_FILE")
        image_urls=$(jq -r ".schedules[] | select(.id == \"$plan_id\") | .image_urls" "$SCHEDULE_FILE")
        tags=$(jq -r ".schedules[] | select(.id == \"$plan_id\") | .tags" "$SCHEDULE_FILE")
    else
        plan_name=$(grep -A10 '"id": "'"$plan_id"'"' "$SCHEDULE_FILE" | grep '"name":' | sed 's/.*"name": "\([^"]*\)".*/\1/')
        content_file=$(grep -A10 '"id": "'"$plan_id"'"' "$SCHEDULE_FILE" | grep '"content_file":' | sed 's/.*"content_file": "\([^"]*\)".*/\1/')
        content_title=$(grep -A10 '"id": "'"$plan_id"'"' "$SCHEDULE_FILE" | grep '"content_title":' | sed 's/.*"content_title": "\([^"]*\)".*/\1/')
        image_urls=$(grep -A10 '"id": "'"$plan_id"'"' "$SCHEDULE_FILE" | grep '"image_urls":' | sed 's/.*"image_urls": \(.*\),/\1/')
        tags=$(grep -A10 '"id": "'"$plan_id"'"' "$SCHEDULE_FILE" | grep '"tags":' | sed 's/.*"tags": \(.*\),/\1/')
    fi
    
    # 显示计划详情
    echo -e "${GREEN}计划名称：${NC}$plan_name"
    echo -e "${GREEN}内容标题：${NC}$content_title"
    echo -e "${GREEN}内容文件：${NC}$content_file"
    echo -e "${GREEN}图片URL：${NC}$image_urls"
    echo -e "${GREEN}标签：${NC}$tags"
    
    # 检查内容文件
    if [ ! -f "$content_file" ]; then
        echo -e "${RED}❌ 内容文件不存在${NC}"
        return 1
    fi
    
    # 预览内容
    echo -e "${CYAN}========================================${NC}"
    echo -e "${BLUE}内容预览：${NC}"
    head -10 "$content_file"
    echo -e "${YELLOW}...（完整内容见文件）${NC}"
    
    # 检查登录状态
    echo -e "${CYAN}========================================${NC}"
    echo -e "${BLUE}检查登录状态...${NC}"
    LOGIN_STATUS=$(mcporter call xiaohongshu.check_login_status 2>/dev/null | grep -i "已登录\|登录成功" || echo "未登录")
    
    if echo "$LOGIN_STATUS" | grep -q "已登录\|登录成功"; then
        echo -e "${GREEN}✅ 登录状态正常${NC}"
    else
        echo -e "${RED}❌ 登录状态异常${NC}"
    fi
    
    # 模拟发布命令
    echo -e "${CYAN}========================================${NC}"
    echo -e "${BLUE}模拟发布命令：${NC}"
    echo "mcporter call xiaohongshu.publish_content \\"
    echo "  title=\"$content_title\" \\"
    echo "  content=\"\$(cat $content_file)\" \\"
    echo "  images='$image_urls' \\"
    echo "  tags='$tags' \\"
    echo "  is_original=true"
    
    echo -e "${CYAN}========================================${NC}"
    echo -e "${GREEN}✅ 测试完成${NC}"
    echo -e "${YELLOW}注意：这只是测试，不会实际发布${NC}"
    
    # 更新状态为测试
    update_plan_status "$plan_id" "testing" "测试完成"
}

# 显示调度器状态
show_status() {
    echo -e "${BLUE}调度器状态${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    echo -e "${GREEN}系统信息：${NC}"
    echo "当前时间：$(date)"
    echo "工作目录：$(pwd)"
    echo "脚本目录：$SCRIPT_DIR"
    
    echo -e "${CYAN}----------------------------------------${NC}"
    
    echo -e "${GREEN}文件状态：${NC}"
    if [ -f "$SCHEDULE_FILE" ]; then
        schedule_count=$(grep -c '"id":' "$SCHEDULE_FILE" 2>/dev/null || echo "0")
        echo "计划文件：$SCHEDULE_FILE ($schedule_count 个计划)"
    else
        echo "计划文件：不存在"
    fi
    
    if [ -d "$LOG_DIR" ]; then
        log_count=$(find "$LOG_DIR" -name "*.log" | wc -l)
        echo "日志目录：$LOG_DIR ($log_count 个日志文件)"
    else
        echo "日志目录：不存在"
    fi
    
    if [ -d "$CONTENT_DIR" ]; then
        content_count=$(find "$CONTENT_DIR" -name "*.md" | wc -l)
        echo "内容库：$CONTENT_DIR ($content_count 个内容文件)"
    else
        echo "内容库：不存在"
    fi
    
    echo -e "${CYAN}----------------------------------------${NC}"
    
    echo -e "${GREEN}服务状态：${NC}"
    # 检查小红书MCP服务
    if docker ps | grep -q xiaohongshu; then
        echo -e "小红书MCP服务：${GREEN}运行中${NC}"
    else
        echo -e "小红书MCP服务：${RED}未运行${NC}"
    fi
    
    # 检查登录状态
    LOGIN_STATUS=$(mcporter call xiaohongshu.check_login_status 2>/dev/null | grep -i "已登录\|登录成功" || echo "未登录")
    if echo "$LOGIN_STATUS" | grep -q "已登录\|登录成功"; then
        echo -e "小红书登录状态：${GREEN}已登录${NC}"
    else
        echo -e "小红书登录状态：${RED}未登录${NC}"
    fi
    
    echo -e "${CYAN}========================================${NC}"
}

# 清理旧日志
clear_logs() {
    echo -e "${BLUE}清理旧日志${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    read -p "保留最近多少天的日志？（默认：7）: " DAYS
    DAYS=${DAYS:-7}
    
    echo -e "${YELLOW}正在清理 $LOG_DIR 中超过 $DAYS 天的日志文件...${NC}"
    
    find "$LOG_DIR" -name "*.log" -mtime +$DAYS -delete
    
    remaining_count=$(find "$LOG_DIR" -name "*.log" | wc -l)
    
    echo -e "${GREEN}✅ 日志清理完成${NC}"
    echo -e "${CYAN}剩余日志文件：$remaining_count 个${NC}"
    echo -e "${CYAN}========================================${NC}"
}

# 主程序
main() {
    # 初始化
    init_schedule_file
    
    # 解析命令
    COMMAND="${1:-status}"
    
    case $COMMAND in
        add)
            add_schedule
            ;;
        list)
            list_schedules
            ;;
        remove)
            if [ -z "$2" ]; then
                echo -e "${RED}错误：需要指定计划ID${NC}"
                show_help
                exit 1
            fi
            echo -e "${YELLOW}删除功能待实现${NC}"
            ;;
        run)
            run_schedules
            ;;
        test)
            if [ -z "$2" ]; then
                echo -e "${RED}错误：需要指定计划ID${NC}"
                show_help
                exit 1
            fi
            test_schedule "$2"
            ;;
        status)
            show_status
            ;;
        clear-logs)
            clear_logs
            ;;
        -h|--help)
            show_help
            ;;
        *)
            echo -e "${RED}错误：未知命令 $COMMAND${NC}"
            show_help
            exit 1
            ;;
    esac
}

# 运行主程序
main "$@"