#!/bin/bash
# 小红书内容库管理系统
# 管理可重复使用的内容模板和素材

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
LIBRARY_DIR="../content-library"
TEMPLATE_DIR="../templates"
IMAGE_DIR="../images"
METADATA_FILE="$LIBRARY_DIR/metadata.json"

# 创建目录
mkdir -p "$LIBRARY_DIR" "$IMAGE_DIR"

# 显示帮助
show_help() {
    echo -e "${BLUE}小红书内容库管理系统${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo -e "${GREEN}使用方法：${NC}"
    echo "  $0 [命令] [选项]"
    echo ""
    echo -e "${GREEN}命令：${NC}"
    echo "  list               列出内容库"
    echo "  add                添加新内容"
    echo "  edit <ID>          编辑内容"
    echo "  view <ID>          查看内容详情"
    echo "  delete <ID>        删除内容"
    echo "  search <关键词>     搜索内容"
    echo "  export <ID>        导出内容"
    echo "  import <文件>      导入内容"
    echo "  stats              内容库统计"
    echo "  backup             备份内容库"
    echo ""
    echo -e "${GREEN}选项：${NC}"
    echo "  -h, --help         显示此帮助信息"
    echo "  -t, --type TYPE    内容类型过滤"
    echo "  -c, --category CAT 内容分类过滤"
    echo ""
    echo -e "${GREEN}示例：${NC}"
    echo "  $0 list"
    echo "  $0 add"
    echo "  $0 view content_123"
    echo "  $0 search 办公设计"
    echo "  $0 stats"
    echo -e "${CYAN}========================================${NC}"
}

# 初始化元数据文件
init_metadata() {
    if [ ! -f "$METADATA_FILE" ]; then
        cat > "$METADATA_FILE" << EOF
{
  "version": "1.0",
  "created": "$(date -Iseconds)",
  "last_updated": "$(date -Iseconds)",
  "content_count": 0,
  "contents": []
}
EOF
        echo -e "${GREEN}✅ 初始化元数据文件${NC}"
    fi
}

# 生成内容ID
generate_content_id() {
    echo "content_$(date +%s)_$(shuf -i 1000-9999 -n 1)"
}

# 列出内容库
list_contents() {
    local type_filter="$1"
    local category_filter="$2"
    
    echo -e "${BLUE}内容库列表${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    if [ ! -f "$METADATA_FILE" ]; then
        echo -e "${YELLOW}内容库为空${NC}"
        return
    fi
    
    if command -v jq >/dev/null 2>&1; then
        # 构建过滤条件
        filter=".contents[]"
        if [ -n "$type_filter" ]; then
            filter="$filter | select(.type == \"$type_filter\")"
        fi
        if [ -n "$category_filter" ]; then
            filter="$filter | select(.category == \"$category_filter\")"
        fi
        
        # 使用jq查询
        jq -r "$filter | \"\(.id) | \(.title) | \(.type) | \(.category) | \(.status) | \(.created)\"" "$METADATA_FILE" | while read line; do
            echo -e "${GREEN}$line${NC}"
        done
        
        # 统计数量
        total_count=$(jq '.content_count' "$METADATA_FILE")
        filtered_count=$(jq -r "$filter | length" "$METADATA_FILE")
        
        echo -e "${CYAN}----------------------------------------${NC}"
        echo -e "${YELLOW}总计：${NC}${total_count} 篇内容"
        if [ -n "$type_filter" ] || [ -n "$category_filter" ]; then
            echo -e "${YELLOW}过滤后：${NC}${filtered_count} 篇内容"
        fi
    else
        # 简单文本输出
        echo -e "${YELLOW}需要jq命令来解析JSON文件${NC}"
        echo "请安装jq：sudo apt-get install jq"
    fi
    
    echo -e "${CYAN}========================================${NC}"
}

# 添加新内容
add_content() {
    echo -e "${BLUE}添加新内容${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    # 生成内容ID
    CONTENT_ID=$(generate_content_id)
    CONTENT_FILE="$LIBRARY_DIR/${CONTENT_ID}.md"
    
    # 获取内容信息
    echo -e "${YELLOW}请输入内容信息：${NC}"
    
    read -p "内容标题: " TITLE
    read -p "内容类型 (office-design/furniture-industry/business-case/custom): " TYPE
    read -p "内容分类 (设计/家具/商业/其他): " CATEGORY
    read -p "内容状态 (draft/published/archived): " STATUS
    
    # 选择创建方式
    echo -e "${YELLOW}选择创建方式：${NC}"
    echo "1. 使用模板生成"
    echo "2. 手动输入"
    echo "3. 从文件导入"
    
    read -p "选择（1-3）: " CREATE_METHOD
    
    case $CREATE_METHOD in
        1)
            # 使用模板生成
            if [ "$TYPE" = "office-design" ] || [ "$TYPE" = "furniture-industry" ] || [ "$TYPE" = "business-case" ]; then
                "$SCRIPT_DIR/content-generator.sh" "$TYPE" "$CONTENT_FILE" -t "$TITLE"
                echo -e "${GREEN}✅ 使用模板生成内容${NC}"
            else
                echo -e "${YELLOW}⚠️  自定义类型，转为手动输入${NC}"
                CREATE_METHOD=2
            fi
            ;;
        2)
            # 手动输入
            echo -e "${YELLOW}请输入内容（输入END结束）：${NC}"
            echo "# $TITLE" > "$CONTENT_FILE"
            echo "" >> "$CONTENT_FILE"
            echo "**类型：** $TYPE" >> "$CONTENT_FILE"
            echo "**分类：** $CATEGORY" >> "$CONTENT_FILE"
            echo "**状态：** $STATUS" >> "$CONTENT_FILE"
            echo "" >> "$CONTENT_FILE"
            echo "---" >> "$CONTENT_FILE"
            echo "" >> "$CONTENT_FILE"
            
            while IFS= read -r line; do
                if [ "$line" = "END" ]; then
                    break
                fi
                echo "$line" >> "$CONTENT_FILE"
            done
            
            echo -e "${GREEN}✅ 手动输入内容完成${NC}"
            ;;
        3)
            # 从文件导入
            read -p "源文件路径: " SOURCE_FILE
            if [ -f "$SOURCE_FILE" ]; then
                cp "$SOURCE_FILE" "$CONTENT_FILE"
                echo -e "${GREEN}✅ 从文件导入内容${NC}"
            else
                echo -e "${RED}❌ 源文件不存在${NC}"
                return 1
            fi
            ;;
        *)
            echo -e "${RED}❌ 无效选择${NC}"
            return 1
            ;;
    esac
    
    # 获取标签
    read -p "标签（用逗号分隔）: " TAGS_INPUT
    
    # 转换标签为数组
    if [ -n "$TAGS_INPUT" ]; then
        IFS=',' read -ra TAG_ARRAY <<< "$TAGS_INPUT"
        TAGS_JSON="["
        for i in "${!TAG_ARRAY[@]}"; do
            if [ $i -gt 0 ]; then
                TAGS_JSON="$TAGS_JSON,"
            fi
            TAGS_JSON="$TAGS_JSON\"${TAG_ARRAY[$i]}\""
        done
        TAGS_JSON="$TAGS_JSON]"
    else
        TAGS_JSON="[]"
    fi
    
    # 获取图片URL
    read -p "图片URL（用逗号分隔）: " IMAGES_INPUT
    
    # 转换图片URL为数组
    if [ -n "$IMAGES_INPUT" ]; then
        IFS=',' read -ra IMAGE_ARRAY <<< "$IMAGES_INPUT"
        IMAGES_JSON="["
        for i in "${!IMAGE_ARRAY[@]}"; do
            if [ $i -gt 0 ]; then
                IMAGES_JSON="$IMAGES_JSON,"
            fi
            IMAGES_JSON="$IMAGES_JSON\"${IMAGE_ARRAY[$i]}\""
        done
        IMAGES_JSON="$IMAGES_JSON]"
    else
        IMAGES_JSON="[]"
    fi
    
    # 创建内容对象
    CONTENT_OBJECT=$(cat << EOF
    {
      "id": "$CONTENT_ID",
      "title": "$TITLE",
      "type": "$TYPE",
      "category": "$CATEGORY",
      "status": "$STATUS",
      "tags": $TAGS_JSON,
      "images": $IMAGES_JSON,
      "file": "$CONTENT_FILE",
      "created": "$(date -Iseconds)",
      "last_updated": "$(date -Iseconds)",
      "usage_count": 0
    }
EOF
)
    
    # 添加到元数据文件
    if command -v jq >/dev/null 2>&1; then
        # 更新内容计数
        current_count=$(jq '.content_count' "$METADATA_FILE")
        new_count=$((current_count + 1))
        
        # 添加新内容
        jq ".content_count = $new_count | .contents += [$CONTENT_OBJECT] | .last_updated = \"$(date -Iseconds)\"" "$METADATA_FILE" > "${METADATA_FILE}.tmp" && mv "${METADATA_FILE}.tmp" "$METADATA_FILE"
        
        echo -e "${GREEN}✅ 内容添加成功！${NC}"
        echo -e "${CYAN}内容ID：${NC}$CONTENT_ID"
        echo -e "${CYAN}内容文件：${NC}$CONTENT_FILE"
        echo -e "${CYAN}标签：${NC}$TAGS_INPUT"
        echo -e "${CYAN}图片：${NC}$IMAGES_INPUT"
    else
        echo -e "${YELLOW}⚠️  需要jq命令来更新元数据${NC}"
        echo "内容已保存到：$CONTENT_FILE"
    fi
    
    echo -e "${CYAN}========================================${NC}"
}

# 查看内容详情
view_content() {
    local content_id="$1"
    
    echo -e "${BLUE}查看内容详情：$content_id${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    if [ ! -f "$METADATA_FILE" ]; then
        echo -e "${RED}❌ 元数据文件不存在${NC}"
        return 1
    fi
    
    if command -v jq >/dev/null 2>&1; then
        # 查询内容信息
        content_info=$(jq -r ".contents[] | select(.id == \"$content_id\")" "$METADATA_FILE")
        
        if [ -z "$content_info" ] || [ "$content_info" = "null" ]; then
            echo -e "${RED}❌ 内容不存在：$content_id${NC}"
            return 1
        fi
        
        # 显示内容信息
        echo -e "${GREEN}📋 内容信息：${NC}"
        echo "$content_info" | jq -r '
          "标题：\(.title)",
          "类型：\(.type)",
          "分类：\(.category)",
          "状态：\(.status)",
          "创建时间：\(.created)",
          "更新时间：\(.last_updated)",
          "使用次数：\(.usage_count)",
          "文件：\(.file)"
        ' | while read line; do
            echo -e "  ${YELLOW}$line${NC}"
        done
        
        # 显示标签
        tags=$(echo "$content_info" | jq -r '.tags | join(", ")')
        if [ -n "$tags" ] && [ "$tags" != "null" ]; then
            echo -e "  ${YELLOW}标签：${NC}$tags"
        fi
        
        # 显示图片
        images=$(echo "$content_info" | jq -r '.images | join(", ")')
        if [ -n "$images" ] && [ "$images" != "null" ]; then
            echo -e "  ${YELLOW}图片：${NC}$images"
        fi
        
        # 显示内容预览
        content_file=$(echo "$content_info" | jq -r '.file')
        if [ -f "$content_file" ]; then
            echo -e "${CYAN}----------------------------------------${NC}"
            echo -e "${GREEN}📄 内容预览：${NC}"
            head -20 "$content_file"
            
            total_lines=$(wc -l < "$content_file")
            if [ $total_lines -gt 20 ]; then
                echo -e "${YELLOW}...（共${total_lines}行）${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}需要jq命令来查询内容${NC}"
    fi
    
    echo -e "${CYAN}========================================${NC}"
}

# 搜索内容
search_contents() {
    local keyword="$1"
    
    echo -e "${BLUE}搜索内容：$keyword${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    if [ ! -f "$METADATA_FILE" ]; then
        echo -e "${YELLOW}内容库为空${NC}"
        return
    fi
    
    # 搜索内容文件
    echo -e "${GREEN}在内容文件中搜索：${NC}"
    find "$LIBRARY_DIR" -name "*.md" -type f -exec grep -l "$keyword" {} \; | while read file; do
        filename=$(basename "$file" .md)
        title=$(head -1 "$file" | sed 's/^# //')
        echo -e "  ${YELLOW}$filename${NC}: $title"
    done
    
    # 搜索元数据
    if command -v jq >/dev/null 2>&1; then
        echo -e "${CYAN}----------------------------------------${NC}"
        echo -e "${GREEN}在元数据中搜索：${NC}"
        
        jq -r ".contents[] | select(.title | contains(\"$keyword\") or .tags[] | contains(\"$keyword\")) | \"\(.id) | \(.title)\"" "$METADATA_FILE" | while read line; do
            echo -e "  ${GREEN}$line${NC}"
        done
    fi
    
    echo -e "${CYAN}========================================${NC}"
}

# 内容库统计
show_stats() {
    echo -e "${BLUE}内容库统计${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    if [ ! -f "$METADATA_FILE" ]; then
        echo -e "${YELLOW}内容库为空${NC}"
        return
    fi
    
    if command -v jq >/dev/null 2>&1; then
        # 总体统计
        total_count=$(jq '.content_count' "$METADATA_FILE")
        echo -e "${GREEN}📊 总体统计：${NC}"
        echo -e "  内容总数：${YELLOW}$total_count${NC} 篇"
        
        # 按类型统计
        echo -e "${GREEN}📈 按类型统计：${NC}"
        jq -r '.contents[] | .type' "$METADATA_FILE" | sort | uniq -c | sort -nr | while read count type; do
            percentage=$((count * 100 / total_count))
            echo -e "  ${YELLOW}$type${NC}: $count 篇 ($percentage%)"
        done
        
        # 按状态统计
        echo -e "${GREEN}📋 按状态统计：${NC}"
        jq -r '.contents[] | .status' "$METADATA_FILE" | sort | uniq -c | sort -nr | while read count status; do
            percentage=$((count * 100 / total_count))
            echo -e "  ${YELLOW}$status${NC}: $count 篇 ($percentage%)"
        done
        
        # 按分类统计
        echo -e "${GREEN}🏷️  按分类统计：${NC}"
        jq -r '.contents[] | .category' "$METADATA_FILE" | sort | uniq -c | sort -nr | while read count category; do
            percentage=$((count * 100 / total_count))
            echo -e "  ${YELLOW}$category${NC}: $count 篇 ($percentage%)"
        done
        
        # 使用次数统计
        echo -e "${GREEN}🚀 使用次数统计：${NC}"
        total_usage=$(jq '[.contents[] | .usage_count] | add' "$METADATA_FILE")
        avg_usage=$((total_usage / total_count))
        echo -e "  总使用次数：${YELLOW}$total_usage${NC} 次"
        echo -e "  平均使用次数：${YELLOW}$avg_usage${NC} 次"
        
        # 最常用内容
        echo -e "${GREEN}🏆 最常用内容：${NC}"
        jq -r '.contents[] | "\(.usage_count) | \(.title) | \(.id)"' "$METADATA_FILE" | sort -nr | head -5 | while read line; do
            echo -e "  ${YELLOW}$line${NC}"
        done
    else
        echo -e "${YELLOW}需要jq命令来生成统计${NC}"
    fi
    
    # 文件系统统计
    echo -e "${CYAN}----------------------------------------${NC}"
    echo -e "${GREEN}📁 文件系统统计：${NC}"
    
    content_files=$(find "$LIBRARY_DIR" -name "*.md" | wc -l)
    total_size=$(find "$LIBRARY_DIR" -name "*.md" -exec du -ch {} + | grep total | cut -f1)
    
    echo -e "  内容文件数：${YELLOW}$content_files${NC} 个"
    echo -e "  总文件大小：${YELLOW}$total_size${NC}"
    
    echo -e "${CYAN}========================================${NC}"
}

# 备份内容库
backup_library() {
    echo -e "${BLUE}备份内容库${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    # 创建备份目录
    BACKUP_DIR="../backups"
    mkdir -p "$BACKUP_DIR"
    
    # 生成备份文件名
    BACKUP_FILE="$BACKUP_DIR/content-library_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
    
    # 备份内容
    echo -e "${YELLOW}正在备份内容库...${NC}"
    tar -czf "$BACKUP_FILE" -C "$(dirname "$LIBRARY_DIR")" "$(basename "$LIBRARY_DIR")" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        backup_size=$(du -h "$BACKUP_FILE" | cut -f1)
        echo -e "${GREEN}✅ 备份完成！${NC}"
        echo -e "${CYAN}备份文件：${NC}$BACKUP_FILE"
        echo -e "${CYAN}备份大小：${NC}$backup_size"
        
        # 清理旧备份（保留最近7天）
        find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
        echo -e "${YELLOW}已清理7天前的旧备份${NC}"
    else
        echo -e "${RED}❌ 备份失败${NC}"
    fi
    
    echo -e "${CYAN}========================================${NC}"
}

# 主程序
main() {
    # 初始化
    init_metadata
    
    # 解析命令
    COMMAND="${1:-list}"
    
    case $COMMAND in
        list)
            TYPE_FILTER=""
            CATEGORY_FILTER=""
            
            # 解析选项
            shift
            while [[ $# -gt 0 ]]; do
                case $1 in
                    -t|--type)
                        TYPE_FILTER="$2"
                        shift 2
                        ;;
                    -c|--category)
                        CATEGORY_FILTER="$2"
                        shift 2
                        ;;
                    *)
                        shift
                        ;;
                esac
            done
            
            list_contents "$TYPE_FILTER" "$CATEGORY_FILTER"
            ;;
        add)
            add_content
            ;;
        edit)
            if [ -z "$2" ]; then
                echo -e "${RED}错误：需要指定内容ID${NC}"
                show_help
                exit 1
            fi
            echo -e "${YELLOW}编辑功能待实现${NC}"
            ;;
        view)
            if [ -z "$2" ]; then
                echo -e "${RED}错误：需要指定内容ID${NC}"
                show_help
                exit 1
            fi
            view_content "$2"
            ;;
        delete)
            if [ -z "$2" ]; then
                echo -e "${RED}错误：需要指定内容ID${NC}"
                show_help
                exit 1
            fi
            echo -e "${YELLOW}删除功能待实现${NC}"
            ;;
        search)
            if [ -z "$2" ]; then
                echo -e "${RED}错误：需要指定搜索关键词${NC}"
                show_help
                exit 1
            fi
            search_contents "$2"
            ;;
        export)
            if [ -z "$2" ]; then
                echo -e "${RED}错误：需要指定内容ID${NC}"
                show_help
                exit 1
            fi
            echo -e "${YELLOW}导出功能待实现${NC}"
            ;;
        import)
            if [ -z "$2" ]; then
                echo -e "${RED}错误：需要指定文件路径${NC}"
                show_help
                exit 1
            fi
            echo -e "${YELLOW}导入功能待实现${NC}"
            ;;
        stats)
            show_stats
            ;;
        backup)
            backup_library
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