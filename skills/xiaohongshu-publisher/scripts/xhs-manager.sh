#!/bin/bash
# 小红书自动化发布管理器
# 主控制脚本，整合所有功能

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
VERSION="1.0.0"

# 显示横幅
show_banner() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${GREEN}  小红书自动化发布管理器 v$VERSION${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo -e "${CYAN}基于2026年3月26日成功经验构建${NC}"
    echo -e "${YELLOW}已验证可靠，支持经常性发布需求${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# 显示主菜单
show_menu() {
    echo -e "${GREEN}请选择功能：${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo -e "${BLUE}1. 📝 内容生成${NC}"
    echo "   使用模板快速生成高质量内容"
    echo ""
    echo -e "${BLUE}2. 🚀 发布管理${NC}"
    echo "   执行发布计划和管理发布任务"
    echo ""
    echo -e "${BLUE}3. 📊 数据分析${NC}"
    echo "   分析发布效果和优化建议"
    echo ""
    echo -e "${BLUE}4. 📚 内容库管理${NC}"
    echo "   管理可重复使用的内容模板"
    echo ""
    echo -e "${BLUE}5. ⚙️  系统状态${NC}"
    echo "   检查系统配置和运行状态"
    echo ""
    echo -e "${BLUE}6. 📖 使用指南${NC}"
    echo "   查看详细使用说明和示例"
    echo ""
    echo -e "${BLUE}0. 🚪 退出${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo -e "${YELLOW}输入数字选择功能（0-6）：${NC}"
}

# 内容生成功能
content_generation() {
    echo -e "${BLUE}📝 内容生成功能${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    echo -e "${GREEN}请选择生成方式：${NC}"
    echo "1. 使用模板生成"
    echo "2. 查看可用模板"
    echo "3. 返回主菜单"
    
    read -p "选择（1-3）: " CHOICE
    
    case $CHOICE in
        1)
            echo -e "${YELLOW}选择内容类型：${NC}"
            echo "1. 办公空间设计案例"
            echo "2. 家具行业分析"
            echo "3. 商业案例分享"
            
            read -p "选择（1-3）: " TYPE_CHOICE
            
            case $TYPE_CHOICE in
                1)
                    TEMPLATE_TYPE="office-design"
                    ;;
                2)
                    TEMPLATE_TYPE="furniture-industry"
                    ;;
                3)
                    TEMPLATE_TYPE="business-case"
                    ;;
                *)
                    echo -e "${RED}无效选择${NC}"
                    return
                    ;;
            esac
            
            read -p "输出文件路径: " OUTPUT_FILE
            read -p "自定义标题（留空使用默认）: " CUSTOM_TITLE
            read -p "关键词（用逗号分隔）: " KEYWORDS
            
            # 执行生成
            if [ -n "$CUSTOM_TITLE" ] && [ -n "$KEYWORDS" ]; then
                "$SCRIPT_DIR/content-generator.sh" "$TEMPLATE_TYPE" "$OUTPUT_FILE" -t "$CUSTOM_TITLE" -k "$KEYWORDS" -p
            elif [ -n "$CUSTOM_TITLE" ]; then
                "$SCRIPT_DIR/content-generator.sh" "$TEMPLATE_TYPE" "$OUTPUT_FILE" -t "$CUSTOM_TITLE" -p
            elif [ -n "$KEYWORDS" ]; then
                "$SCRIPT_DIR/content-generator.sh" "$TEMPLATE_TYPE" "$OUTPUT_FILE" -k "$KEYWORDS" -p
            else
                "$SCRIPT_DIR/content-generator.sh" "$TEMPLATE_TYPE" "$OUTPUT_FILE" -p
            fi
            ;;
        2)
            "$SCRIPT_DIR/content-generator.sh" --list
            ;;
        3)
            return
            ;;
        *)
            echo -e "${RED}无效选择${NC}"
            ;;
    esac
}

# 发布管理功能
publish_management() {
    echo -e "${BLUE}🚀 发布管理功能${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    echo -e "${GREEN}请选择操作：${NC}"
    echo "1. 添加发布计划"
    echo "2. 查看发布计划"
    echo "3. 执行发布计划"
    echo "4. 测试发布计划"
    echo "5. 查看系统状态"
    echo "6. 返回主菜单"
    
    read -p "选择（1-6）: " CHOICE
    
    case $CHOICE in
        1)
            "$SCRIPT_DIR/scheduler.sh" add
            ;;
        2)
            "$SCRIPT_DIR/scheduler.sh" list
            ;;
        3)
            "$SCRIPT_DIR/scheduler.sh" run
            ;;
        4)
            read -p "输入计划ID: " PLAN_ID
            "$SCRIPT_DIR/scheduler.sh" test "$PLAN_ID"
            ;;
        5)
            "$SCRIPT_DIR/scheduler.sh" status
            ;;
        6)
            return
            ;;
        *)
            echo -e "${RED}无效选择${NC}"
            ;;
    esac
}

# 数据分析功能
data_analysis() {
    echo -e "${BLUE}📊 数据分析功能${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    echo -e "${GREEN}请选择分析类型：${NC}"
    echo "1. 总体概览"
    echo "2. 每日分析"
    echo "3. 内容分析"
    echo "4. 性能分析"
    echo "5. 优化建议"
    echo "6. 生成报告"
    echo "7. 返回主菜单"
    
    read -p "选择（1-7）: " CHOICE
    
    case $CHOICE in
        1)
            read -p "分析最近多少天的数据？（默认：30）: " DAYS
            DAYS=${DAYS:-30}
            "$SCRIPT_DIR/analytics.sh" overview -d "$DAYS"
            ;;
        2)
            read -p "分析最近多少天的数据？（默认：7）: " DAYS
            DAYS=${DAYS:-7}
            "$SCRIPT_DIR/analytics.sh" daily -d "$DAYS"
            ;;
        3)
            "$SCRIPT_DIR/analytics.sh" content
            ;;
        4)
            "$SCRIPT_DIR/analytics.sh" performance
            ;;
        5)
            "$SCRIPT_DIR/analytics.sh" recommendations
            ;;
        6)
            read -p "输出文件路径（默认：自动生成）: " OUTPUT_FILE
            read -p "分析最近多少天的数据？（默认：30）: " DAYS
            DAYS=${DAYS:-30}
            
            if [ -n "$OUTPUT_FILE" ]; then
                "$SCRIPT_DIR/analytics.sh" report -o "$OUTPUT_FILE" -d "$DAYS"
            else
                "$SCRIPT_DIR/analytics.sh" report -d "$DAYS"
            fi
            ;;
        7)
            return
            ;;
        *)
            echo -e "${RED}无效选择${NC}"
            ;;
    esac
}

# 内容库管理功能
content_library() {
    echo -e "${BLUE}📚 内容库管理功能${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    echo -e "${GREEN}请选择操作：${NC}"
    echo "1. 列出内容"
    echo "2. 添加内容"
    echo "3. 查看内容详情"
    echo "4. 搜索内容"
    echo "5. 内容库统计"
    echo "6. 备份内容库"
    echo "7. 返回主菜单"
    
    read -p "选择（1-7）: " CHOICE
    
    case $CHOICE in
        1)
            echo -e "${YELLOW}过滤选项：${NC}"
            echo "1. 不过滤"
            echo "2. 按类型过滤"
            echo "3. 按分类过滤"
            
            read -p "选择（1-3）: " FILTER_CHOICE
            
            case $FILTER_CHOICE in
                1)
                    "$SCRIPT_DIR/content-library.sh" list
                    ;;
                2)
                    read -p "输入类型: " TYPE_FILTER
                    "$SCRIPT_DIR/content-library.sh" list --type "$TYPE_FILTER"
                    ;;
                3)
                    read -p "输入分类: " CATEGORY_FILTER
                    "$SCRIPT_DIR/content-library.sh" list --category "$CATEGORY_FILTER"
                    ;;
                *)
                    "$SCRIPT_DIR/content-library.sh" list
                    ;;
            esac
            ;;
        2)
            "$SCRIPT_DIR/content-library.sh" add
            ;;
        3)
            read -p "输入内容ID: " CONTENT_ID
            "$SCRIPT_DIR/content-library.sh" view "$CONTENT_ID"
            ;;
        4)
            read -p "输入搜索关键词: " KEYWORD
            "$SCRIPT_DIR/content-library.sh" search "$KEYWORD"
            ;;
        5)
            "$SCRIPT_DIR/content-library.sh" stats
            ;;
        6)
            "$SCRIPT_DIR/content-library.sh" backup
            ;;
        7)
            return
            ;;
        *)
            echo -e "${RED}无效选择${NC}"
            ;;
    esac
}

# 系统状态检查
system_status() {
    echo -e "${BLUE}⚙️  系统状态检查${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    # 检查小红书MCP服务
    echo -e "${GREEN}1. 小红书MCP服务状态：${NC}"
    if docker ps | grep -q xiaohongshu; then
        echo -e "   ${GREEN}✅ 运行中${NC}"
        docker ps | grep xiaohongshu
    else
        echo -e "   ${RED}❌ 未运行${NC}"
        echo -e "   ${YELLOW}启动命令：docker run -d -p 18060:18060 xpzouying/xiaohongshu-mcp${NC}"
    fi
    
    echo -e "${CYAN}----------------------------------------${NC}"
    
    # 检查登录状态
    echo -e "${GREEN}2. 小红书登录状态：${NC}"
    LOGIN_STATUS=$(mcporter call xiaohongshu.check_login_status 2>/dev/null | grep -i "已登录\|登录成功" || echo "未登录")
    
    if echo "$LOGIN_STATUS" | grep -q "已登录\|登录成功"; then
        echo -e "   ${GREEN}✅ 已登录${NC}"
    else
        echo -e "   ${RED}❌ 未登录${NC}"
        echo -e "   ${YELLOW}请使用Cookie-Editor导入小红书cookies${NC}"
    fi
    
    echo -e "${CYAN}----------------------------------------${NC}"
    
    # 检查脚本权限
    echo -e "${GREEN}3. 脚本权限状态：${NC}"
    for script in content-generator.sh scheduler.sh analytics.sh content-library.sh publish.sh verify.sh; do
        if [ -x "$SCRIPT_DIR/$script" ]; then
            echo -e "   ${GREEN}✅ $script 可执行${NC}"
        else
            echo -e "   ${YELLOW}⚠️  $script 不可执行${NC}"
        fi
    done
    
    echo -e "${CYAN}----------------------------------------${NC}"
    
    # 检查依赖工具
    echo -e "${GREEN}4. 依赖工具状态：${NC}"
    for tool in docker mcporter jq; do
        if command -v $tool >/dev/null 2>&1; then
            echo -e "   ${GREEN}✅ $tool 已安装${NC}"
        else
            echo -e "   ${RED}❌ $tool 未安装${NC}"
        fi
    done
    
    echo -e "${CYAN}----------------------------------------${NC}"
    
    # 检查文件系统
    echo -e "${GREEN}5. 文件系统状态：${NC}"
    for dir in ../content-library ../logs ../reports ../backups; do
        if [ -d "$dir" ]; then
            file_count=$(find "$dir" -type f | wc -l)
            echo -e "   ${GREEN}✅ $(basename "$dir") 目录存在（$file_count 个文件）${NC}"
        else
            echo -e "   ${YELLOW}⚠️  $(basename "$dir") 目录不存在${NC}"
        fi
    done
    
    echo -e "${CYAN}========================================${NC}"
}

# 使用指南
user_guide() {
    echo -e "${BLUE}📖 使用指南${NC}"
    echo -e "${CYAN}========================================${NC}"
    
    echo -e "${GREEN}快速开始：${NC}"
    echo "1. ${YELLOW}系统准备${NC}"
    echo "   • 确保Docker运行小红书MCP服务"
    echo "   • 使用Cookie-Editor导入小红书cookies"
    echo "   • 运行系统状态检查确认一切正常"
    echo ""
    echo "2. ${YELLOW}内容生成${NC}"
    echo "   • 选择内容类型（办公设计/家具行业/商业案例）"
    echo "   • 使用模板快速生成高质量内容"
    echo "   • 自定义标题和关键词优化内容"
    echo ""
    echo "3. ${YELLOW}发布管理${NC}"
    echo "   • 添加发布计划，设置发布时间"
    echo "   • 执行发布计划，自动发布内容"
    echo "   • 测试发布计划，确保配置正确"
    echo ""
    echo "4. ${YELLOW}数据分析${NC}"
    echo "   • 查看发布统计和成功率"
    echo "   • 分析内容效果和用户互动"
    echo "   • 获取优化建议和改进方向"
    echo ""
    echo "5. ${YELLOW}内容库管理${NC}"
    echo "   • 保存成功的内容模板"
    echo "   • 建立可重复使用的内容库"
    echo "   • 定期备份内容数据"
    echo ""
    echo -e "${CYAN}----------------------------------------${NC}"
    
    echo -e "${GREEN}成功案例：${NC}"
    echo "• ${YELLOW}2026-03-26 10:17${NC}: 成功发布'未来办公空间设计'"
    echo "• ${YELLOW}2026-03-26 10:41${NC}: 成功发布'Cadence总部改造ENR获奖项目'"
    echo ""
    echo -e "${GREEN}已验证功能：${NC}"
    echo "✅ 内容标准化生成"
    echo "✅ 自动化发布流程"
    echo "✅ 错误处理和恢复"
    echo "✅ 数据分析和优化"
    echo ""
    echo -e "${CYAN}----------------------------------------${NC}"
    
    echo -e "${GREEN}注意事项：${NC}"
    echo "1. ${YELLOW}图片必须使用HTTP URL${NC}，不能使用本地路径"
    echo "2. ${YELLOW}标签最多10个${NC}，超出的自动截取前10个"
    echo "3. ${YELLOW}命令超时（30秒）不代表发布失败${NC}，后台可能仍在处理"
    echo "4. ${YELLOW}发布后等待2-3分钟${NC}搜索验证结果"
    echo ""
    echo -e "${CYAN}========================================${NC}"
}

# 主程序
main() {
    # 显示横幅
    show_banner
    
    while true; do
        # 显示菜单
        show_menu
        
        # 读取用户选择
        read -r CHOICE
        
        case $CHOICE in
            1)
                content_generation
                ;;
            2)
                publish_management
                ;;
            3)
                data_analysis
                ;;
            4)
                content_library
                ;;
            5)
                system_status
                ;;
            6)
                user_guide
                ;;
            0)
                echo -e "${GREEN}感谢使用小红书自动化发布管理器！${NC}"
                echo -e "${BLUE}========================================${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}无效选择，请重新输入${NC}"
                ;;
        esac
        
        # 等待用户按回车继续
        if [ "$CHOICE" != "0" ]; then
            echo -e "${CYAN}----------------------------------------${NC}"
            echo -e "${YELLOW}按回车键返回主菜单...${NC}"
            read -r
        fi
    done
}

# 运行主程序
main "$@"