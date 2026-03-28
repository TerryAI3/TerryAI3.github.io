#!/bin/bash
# 小红书内容智能生成器
# 基于模板自动生成高质量内容

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 模板目录
TEMPLATE_DIR="../templates"

# 显示帮助
show_help() {
    echo -e "${BLUE}小红书内容智能生成器${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo -e "${GREEN}使用方法：${NC}"
    echo "  $0 [选项] <模板类型> <输出文件>"
    echo ""
    echo -e "${GREEN}选项：${NC}"
    echo "  -h, --help          显示此帮助信息"
    echo "  -l, --list          列出可用模板"
    echo "  -p, --preview       预览生成的内容"
    echo "  -t, --title \"标题\"  指定自定义标题"
    echo "  -k, --keywords \"关键词1,关键词2\" 指定内容关键词"
    echo ""
    echo -e "${GREEN}模板类型：${NC}"
    echo "  office-design       办公空间设计案例"
    echo "  furniture-industry  家具行业分析"
    echo "  business-case       商业案例分享"
    echo ""
    echo -e "${GREEN}示例：${NC}"
    echo "  $0 office-design /tmp/办公案例.md"
    echo "  $0 -t \"智能办公新趋势\" -k \"物联网,人体工学,可持续发展\" furniture-industry /tmp/趋势分析.md"
    echo -e "${CYAN}========================================${NC}"
}

# 列出可用模板
list_templates() {
    echo -e "${BLUE}可用内容模板：${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    for template in "$TEMPLATE_DIR"/*.md; do
        if [ -f "$template" ]; then
            template_name=$(basename "$template" .md)
            template_name_display=$(echo "$template_name" | sed 's/-/ /g')
            echo -e "${GREEN}• $template_name${NC} - $template_name_display"
            
            # 显示模板描述
            first_line=$(head -1 "$template" 2>/dev/null)
            if [[ "$first_line" == \#* ]]; then
                description=$(echo "$first_line" | sed 's/^# //')
                echo -e "  ${YELLOW}描述：${NC}$description"
            fi
            echo ""
        fi
    done
    
    echo -e "${CYAN}========================================${NC}"
}

# 从模板生成内容
generate_from_template() {
    local template_type="$1"
    local output_file="$2"
    local custom_title="$3"
    local keywords="$4"
    
    local template_file="$TEMPLATE_DIR/$template_type.md"
    
    if [ ! -f "$template_file" ]; then
        echo -e "${RED}错误：模板文件不存在 - $template_file${NC}"
        return 1
    fi
    
    echo -e "${BLUE}正在生成内容...${NC}"
    echo -e "${CYAN}模板：${NC}$template_type"
    echo -e "${CYAN}输出：${NC}$output_file"
    
    if [ -n "$custom_title" ]; then
        echo -e "${CYAN}自定义标题：${NC}$custom_title"
    fi
    
    if [ -n "$keywords" ]; then
        echo -e "${CYAN}关键词：${NC}$keywords"
    fi
    
    # 读取模板
    content=$(cat "$template_file")
    
    # 处理自定义标题
    if [ -n "$custom_title" ]; then
        # 替换模板中的标题占位符
        content=$(echo "$content" | sed "s/{标题}/$custom_title/g")
        content=$(echo "$content" | sed "s/{公司名}/示例公司/g")
        content=$(echo "$content" | sed "s/{项目名}/示例项目/g")
        content=$(echo "$content" | sed "s/{主题}/$custom_title/g")
    fi
    
    # 处理关键词
    if [ -n "$keywords" ]; then
        IFS=',' read -ra keyword_array <<< "$keywords"
        
        # 替换模板中的关键词占位符
        for i in "${!keyword_array[@]}"; do
            idx=$((i+1))
            content=$(echo "$content" | sed "s/{亮点$idx}/${keyword_array[$i]}/g")
            content=$(echo "$content" | sed "s/{趋势$idx}/${keyword_array[$i]}/g")
            content=$(echo "$content" | sed "s/{技术$idx}/${keyword_array[$i]}/g")
        done
    fi
    
    # 替换剩余的占位符
    content=$(echo "$content" | sed "s/{地点}/广东佛山/g")
    content=$(echo "$content" | sed "s/{面积}/90,000平方英尺/g")
    content=$(echo "$content" | sed "s/{时间}/2026年/g")
    content=$(echo "$content" | sed "s/{投资}/600万美元/g")
    content=$(echo "$content" | sed "s/{数据1}/员工满意度+42%/g")
    content=$(echo "$content" | sed "s/{数据2}/协作效率+35%/g")
    content=$(echo "$content" | sed "s/{数据3}/能源消耗-28%/g")
    content=$(echo "$content" | sed "s/{价格1}/¥500-2000\/件/g")
    content=$(echo "$content" | sed "s/{价格2}/¥2000-8000\/件/g")
    content=$(echo "$content" | sed "s/{价格3}/¥8000+\/件/g")
    content=$(echo "$content" | sed "s/{品牌1}/Herman Miller/g")
    content=$(echo "$content" | sed "s/{品牌2}/Steelcase/g")
    content=$(echo "$content" | sed "s/{品牌3}/震旦家具/g")
    
    # 保存到输出文件
    echo "$content" > "$output_file"
    
    echo -e "${GREEN}✅ 内容生成完成${NC}"
    echo -e "${CYAN}生成文件：${NC}$output_file"
    
    # 显示统计信息
    char_count=$(wc -m < "$output_file")
    line_count=$(wc -l < "$output_file")
    echo -e "${CYAN}统计：${NC}${char_count}字符，${line_count}行"
    
    return 0
}

# 预览内容
preview_content() {
    local output_file="$1"
    
    if [ ! -f "$output_file" ]; then
        echo -e "${RED}错误：文件不存在 - $output_file${NC}"
        return 1
    fi
    
    echo -e "${BLUE}内容预览：${NC}"
    echo -e "${CYAN}========================================${NC}"
    head -20 "$output_file"
    echo -e "${CYAN}========================================${NC}"
    
    total_lines=$(wc -l < "$output_file")
    if [ $total_lines -gt 20 ]; then
        echo -e "${YELLOW}...（共${total_lines}行，显示前20行）${NC}"
    fi
}

# 主程序
main() {
    # 默认值
    PREVIEW=false
    CUSTOM_TITLE=""
    KEYWORDS=""
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -l|--list)
                list_templates
                exit 0
                ;;
            -p|--preview)
                PREVIEW=true
                shift
                ;;
            -t|--title)
                CUSTOM_TITLE="$2"
                shift 2
                ;;
            -k|--keywords)
                KEYWORDS="$2"
                shift 2
                ;;
            -*)
                echo -e "${RED}错误：未知选项 $1${NC}"
                show_help
                exit 1
                ;;
            *)
                break
                ;;
        esac
    done
    
    # 检查参数
    if [ $# -lt 2 ]; then
        echo -e "${RED}错误：参数不足${NC}"
        show_help
        exit 1
    fi
    
    TEMPLATE_TYPE="$1"
    OUTPUT_FILE="$2"
    
    # 生成内容
    generate_from_template "$TEMPLATE_TYPE" "$OUTPUT_FILE" "$CUSTOM_TITLE" "$KEYWORDS"
    
    # 预览内容
    if [ "$PREVIEW" = true ]; then
        preview_content "$OUTPUT_FILE"
    fi
    
    # 生成标签建议
    echo -e "${BLUE}标签建议：${NC}"
    case $TEMPLATE_TYPE in
        office-design)
            echo '["办公空间设计","未来办公","办公室改造","智能办公室","员工福祉","可持续设计","办公家具","空间规划","工作效率","企业文化"]'
            ;;
        furniture-industry)
            echo '["办公家具","家具设计","家具选购","家具趋势","智能家具","环保家具","定制家具","家具品牌","家具搭配","家居设计"]'
            ;;
        business-case)
            echo '["商业案例","项目管理","价值工程","成本控制","技术创新","可持续发展","品牌建设","行业分析","市场趋势","商业智慧"]'
            ;;
        *)
            echo '["小红书","内容分享","经验分享","行业洞察","实用技巧"]'
            ;;
    esac
    
    # 图片建议
    echo -e "${BLUE}图片建议：${NC}"
    case $TEMPLATE_TYPE in
        office-design)
            echo '["https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg"]'
            ;;
        furniture-industry)
            echo '["https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg"]'
            ;;
        business-case)
            echo '["https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg"]'
            ;;
        *)
            echo '["https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg"]'
            ;;
    esac
    
    echo -e "${CYAN}========================================${NC}"
    echo -e "${GREEN}下一步：${NC}"
    echo "1. 使用发布脚本发布内容："
    echo "   ./publish.sh \"标题\" \"$OUTPUT_FILE\" '图片数组' '标签数组'"
    echo ""
    echo "2. 或使用完整发布命令："
    echo "   mcporter call xiaohongshu.publish_content \\"
    echo "     title=\"标题\" \\"
    echo "     content=\"\$(cat $OUTPUT_FILE)\" \\"
    echo "     images='图片数组' \\"
    echo "     tags='标签数组' \\"
    echo "     is_original=true"
}

# 运行主程序
main "$@"