#!/bin/bash
# 小红书发布脚本
# 使用方法：./publish.sh "标题" "内容文件" '["图片URL"]' '["标签"]'

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 参数检查
if [ $# -lt 4 ]; then
    echo -e "${RED}错误：参数不足${NC}"
    echo -e "${BLUE}使用方法：${NC}"
    echo "  $0 \"标题\" \"内容文件\" '\"[\"图片URL\"]\"' '\"[\"标签\"]\"'"
    echo ""
    echo -e "${BLUE}示例：${NC}"
    echo "  $0 \"办公空间设计案例\" content.md '[\"https://example.com/image.jpg\"]' '[\"办公设计\",\"未来办公\"]'"
    exit 1
fi

TITLE="$1"
CONTENT_FILE="$2"
IMAGES="$3"
TAGS="$4"

# 检查内容文件
if [ ! -f "$CONTENT_FILE" ]; then
    echo -e "${RED}错误：内容文件不存在 - $CONTENT_FILE${NC}"
    exit 1
fi

# 读取内容
CONTENT=$(cat "$CONTENT_FILE")

# 检查标题长度
TITLE_LENGTH=${#TITLE}
if [ $TITLE_LENGTH -gt 20 ]; then
    echo -e "${YELLOW}警告：标题长度 $TITLE_LENGTH 字符，建议不超过20字符${NC}"
fi

# 检查标签数量
TAG_COUNT=$(echo "$TAGS" | grep -o ',' | wc -l)
TAG_COUNT=$((TAG_COUNT + 1))
if [ $TAG_COUNT -gt 10 ]; then
    echo -e "${YELLOW}警告：标签数量 $TAG_COUNT 个，小红书限制最多10个标签${NC}"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}小红书发布准备${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "标题：${YELLOW}$TITLE${NC} (${TITLE_LENGTH}字符)"
echo -e "内容文件：${YELLOW}$CONTENT_FILE${NC}"
echo -e "图片数量：${YELLOW}$(echo "$IMAGES" | grep -o 'http' | wc -l)${NC}"
echo -e "标签数量：${YELLOW}$TAG_COUNT${NC}"
echo -e "${BLUE}========================================${NC}"

# 检查登录状态
echo -e "${BLUE}检查小红书登录状态...${NC}"
LOGIN_STATUS=$(mcporter call xiaohongshu.check_login_status 2>/dev/null | grep -i "已登录\|登录成功" || echo "未登录")

if echo "$LOGIN_STATUS" | grep -q "已登录\|登录成功"; then
    echo -e "${GREEN}✅ 登录状态正常${NC}"
else
    echo -e "${RED}❌ 登录状态异常${NC}"
    echo -e "${YELLOW}请先登录小红书账号${NC}"
    exit 1
fi

# 执行发布
echo -e "${BLUE}开始发布小红书内容...${NC}"
echo -e "${YELLOW}这可能需要30-60秒，请耐心等待${NC}"

# 构建发布命令
PUBLISH_CMD="mcporter call xiaohongshu.publish_content \
  title=\"$TITLE\" \
  content=\"$CONTENT\" \
  images='$IMAGES' \
  tags='$TAGS' \
  is_original=true"

# 执行发布（带超时）
timeout 60 bash -c "$PUBLISH_CMD" 2>&1

PUBLISH_EXIT=$?

echo -e "${BLUE}========================================${NC}"

# 处理发布结果
if [ $PUBLISH_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ 发布命令执行完成${NC}"
    echo -e "${YELLOW}提示：即使命令超时，后台可能仍在处理${NC}"
elif [ $PUBLISH_EXIT -eq 124 ]; then
    echo -e "${YELLOW}⚠️  发布命令超时（60秒）${NC}"
    echo -e "${YELLOW}提示：这是正常现象，后台可能仍在处理发布${NC}"
else
    echo -e "${RED}❌ 发布命令执行失败${NC}"
    echo -e "${YELLOW}请检查参数和网络连接${NC}"
fi

# 记录发布
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
echo "$TIMESTAMP | 标题: $TITLE | 状态: $PUBLISH_EXIT" >> ../../小红书发布记录.md

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}发布流程完成${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${YELLOW}下一步操作：${NC}"
echo "1. 等待2-3分钟让内容处理完成"
echo "2. 在小红书搜索标题关键词验证发布"
echo "3. 查看互动数据并记录"
echo ""
echo -e "${BLUE}验证命令：${NC}"
echo "  mcporter call xiaohongshu.search_feeds keyword=\"${TITLE:0:10}\""
echo ""
echo -e "${BLUE}查看日志：${NC}"
echo "  docker logs xiaohongshu-mcp --tail 20"