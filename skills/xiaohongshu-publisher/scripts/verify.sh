#!/bin/bash
# 小红书发布验证脚本
# 使用方法：./verify.sh "搜索关键词"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 参数检查
if [ $# -lt 1 ]; then
    echo -e "${RED}错误：需要搜索关键词${NC}"
    echo -e "${BLUE}使用方法：${NC}"
    echo "  $0 \"搜索关键词\""
    echo ""
    echo -e "${BLUE}示例：${NC}"
    echo "  $0 \"办公空间设计\""
    echo "  $0 \"未来办公\""
    exit 1
fi

KEYWORD="$1"

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}小红书发布验证${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "搜索关键词：${YELLOW}$KEYWORD${NC}"
echo -e "${BLUE}========================================${NC}"

# 检查MCP服务器状态
echo -e "${BLUE}检查MCP服务器状态...${NC}"
DOCKER_STATUS=$(docker ps | grep xiaohongshu-mcp)

if [ -n "$DOCKER_STATUS" ]; then
    echo -e "${GREEN}✅ MCP服务器运行正常${NC}"
else
    echo -e "${RED}❌ MCP服务器未运行${NC}"
    echo -e "${YELLOW}请启动小红书MCP服务器：${NC}"
    echo "  docker run -d -p 18060:18060 --name xiaohongshu-mcp xpzouying/xiaohongshu-mcp"
    exit 1
fi

# 检查登录状态
echo -e "${BLUE}检查登录状态...${NC}"
LOGIN_STATUS=$(mcporter call xiaohongshu.check_login_status 2>/dev/null | grep -i "已登录\|登录成功" || echo "未登录")

if echo "$LOGIN_STATUS" | grep -q "已登录\|登录成功"; then
    echo -e "${GREEN}✅ 登录状态正常${NC}"
else
    echo -e "${RED}❌ 登录状态异常${NC}"
    echo -e "${YELLOW}请先登录小红书账号${NC}"
    exit 1
fi

# 搜索内容
echo -e "${BLUE}搜索相关内容...${NC}"
echo -e "${YELLOW}这可能需要10-15秒${NC}"

SEARCH_RESULT=$(timeout 20 mcporter call xiaohongshu.search_feeds keyword="$KEYWORD" 2>&1)

if echo "$SEARCH_RESULT" | grep -q "displayTitle.*$KEYWORD"; then
    echo -e "${GREEN}✅ 找到相关笔记${NC}"
    
    # 提取笔记信息
    NOTE_TITLE=$(echo "$SEARCH_RESULT" | grep -o '"displayTitle":"[^"]*"' | head -1 | cut -d'"' -f4)
    NOTE_USER=$(echo "$SEARCH_RESULT" | grep -o '"nickname":"[^"]*"' | head -1 | cut -d'"' -f4)
    NOTE_LIKES=$(echo "$SEARCH_RESULT" | grep -o '"likedCount":"[^"]*"' | head -1 | cut -d'"' -f4)
    NOTE_COMMENTS=$(echo "$SEARCH_RESULT" | grep -o '"commentCount":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    echo -e "${BLUE}========================================${NC}"
    echo -e "${GREEN}搜索结果${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo -e "笔记标题：${YELLOW}$NOTE_TITLE${NC}"
    echo -e "发布用户：${YELLOW}$NOTE_USER${NC}"
    echo -e "点赞数量：${YELLOW}$NOTE_LIKES${NC}"
    echo -e "评论数量：${YELLOW}$NOTE_COMMENTS${NC}"
    echo -e "${BLUE}========================================${NC}"
else
    echo -e "${YELLOW}⚠️  未找到相关笔记${NC}"
    echo -e "${YELLOW}可能原因：${NC}"
    echo "  1. 笔记尚未发布成功"
    echo "  2. 关键词不匹配"
    echo "  3. 需要更多时间索引"
fi

# 查看发布日志
echo -e "${BLUE}查看最近发布日志...${NC}"
RECENT_LOGS=$(docker logs xiaohongshu-mcp --tail 30 2>/dev/null | grep -i "发布\|图片\|标签\|原创\|成功\|失败" | tail -10)

if [ -n "$RECENT_LOGS" ]; then
    echo -e "${BLUE}========================================${NC}"
    echo -e "${GREEN}最近发布日志${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo "$RECENT_LOGS"
    echo -e "${BLUE}========================================${NC}"
    
    # 分析日志状态
    if echo "$RECENT_LOGS" | grep -q "图片上传完成\|已声明原创\|发布成功"; then
        echo -e "${GREEN}✅ 发布流程正常${NC}"
    elif echo "$RECENT_LOGS" | grep -q "图片文件不存在\|标签数量超过\|发布失败"; then
        echo -e "${RED}❌ 发布过程有问题${NC}"
        echo -e "${YELLOW}请检查错误信息并修正${NC}"
    else
        echo -e "${YELLOW}⚠️  发布状态未知${NC}"
        echo -e "${YELLOW}建议等待几分钟后重试${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  未找到相关发布日志${NC}"
fi

# 提供建议
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}验证完成${NC}"
echo -e "${BLUE}========================================${NC}"

if echo "$SEARCH_RESULT" | grep -q "displayTitle.*$KEYWORD"; then
    echo -e "${GREEN}✅ 发布成功确认！${NC}"
    echo -e "${YELLOW}下一步：${NC}"
    echo "1. 在小红书APP查看完整笔记"
    echo "2. 监控互动数据变化"
    echo "3. 回复评论增加互动"
    echo "4. 记录发布效果数据"
else
    echo -e "${YELLOW}⚠️  发布状态待确认${NC}"
    echo -e "${YELLOW}建议：${NC}"
    echo "1. 等待5-10分钟让内容完全索引"
    echo "2. 使用更具体的关键词搜索"
    echo "3. 检查小红书账号的新发布"
    echo "4. 查看Docker容器完整日志："
    echo "   docker logs xiaohongshu-mcp --tail 50"
fi

echo ""
echo -e "${BLUE}常用命令：${NC}"
echo "  搜索笔记：mcporter call xiaohongshu.search_feeds keyword=\"关键词\""
echo "  查看日志：docker logs xiaohongshu-mcp --tail 30"
echo "  登录状态：mcporter call xiaohongshu.check_login_status"
echo "  发布新内容：使用 publish.sh 脚本"