#!/bin/bash
# Scrapling MCP服务器启动脚本

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Scrapling MCP服务器启动脚本${NC}"
echo -e "${BLUE}========================================${NC}"

# 检查Scrapling是否安装
echo -e "${BLUE}检查Scrapling安装...${NC}"
if ! python3 -c "import scrapling" 2>/dev/null; then
    echo -e "${RED}错误：Scrapling未安装${NC}"
    echo -e "${YELLOW}请先运行 install.sh 安装Scrapling${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Scrapling已安装${NC}"

# 检查MCP功能是否安装
echo -e "${BLUE}检查MCP功能...${NC}"
if ! python3 -c "from scrapling.mcp.server import main" 2>/dev/null; then
    echo -e "${YELLOW}MCP功能未安装，尝试安装...${NC}"
    pip3 install "scrapling[ai]" || {
        echo -e "${RED}MCP功能安装失败${NC}"
        echo -e "${YELLOW}请手动安装: pip install \"scrapling[ai]\"${NC}"
        exit 1
    }
    echo -e "${GREEN}✅ MCP功能安装完成${NC}"
else
    echo -e "${GREEN}✅ MCP功能已安装${NC}"
fi

# 解析参数
PORT=8000
HOST="0.0.0.0"
LOG_LEVEL="INFO"

while [[ $# -gt 0 ]]; do
    case $1 in
        --port)
            PORT="$2"
            shift 2
            ;;
        --host)
            HOST="$2"
            shift 2
            ;;
        --log-level)
            LOG_LEVEL="$2"
            shift 2
            ;;
        --help)
            echo "使用方法: $0 [选项]"
            echo ""
            echo "选项:"
            echo "  --port PORT      服务器端口 (默认: 8000)"
            echo "  --host HOST      服务器主机 (默认: 0.0.0.0)"
            echo "  --log-level LEVEL 日志级别 (默认: INFO)"
            echo "  --help           显示帮助信息"
            exit 0
            ;;
        *)
            echo -e "${RED}未知选项: $1${NC}"
            echo "使用 --help 查看帮助"
            exit 1
            ;;
    esac
done

# 检查端口是否被占用
echo -e "${BLUE}检查端口 $PORT...${NC}"
if lsof -i :$PORT > /dev/null 2>&1; then
    echo -e "${YELLOW}端口 $PORT 已被占用${NC}"
    echo -e "${YELLOW}尝试查找占用进程...${NC}"
    lsof -i :$PORT
    echo -e "${YELLOW}请选择其他端口或停止占用进程${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 端口 $PORT 可用${NC}"

# 创建日志目录
LOG_DIR="/var/log/scrapling"
echo -e "${BLUE}创建日志目录...${NC}"
mkdir -p "$LOG_DIR"
chmod 755 "$LOG_DIR"
echo -e "${GREEN}✅ 日志目录: $LOG_DIR${NC}"

# 生成OpenClaw配置
echo -e "${BLUE}生成OpenClaw配置...${NC}"
cat > /tmp/scrapling_mcp_config.yaml << EOF
# Scrapling MCP服务器配置
# 将此配置添加到OpenClaw的mcp配置中

mcp:
  scrapling:
    command: python
    args:
      - -m
      - scrapling.mcp.server
      - --port
      - "$PORT"
      - --host
      - "$HOST"
      - --log-level
      - "$LOG_LEVEL"
    env:
      PYTHONUNBUFFERED: "1"
      SCRAPLING_LOG_LEVEL: "$LOG_LEVEL"
    working_dir: /root/.openclaw/workspace
    auto_restart: true
EOF

echo -e "${GREEN}✅ OpenClaw配置已生成${NC}"
echo -e "${YELLOW}配置文件位置: /tmp/scrapling_mcp_config.yaml${NC}"

# 显示配置信息
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}MCP服务器配置信息${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "服务器地址: ${YELLOW}$HOST:$PORT${NC}"
echo -e "日志级别: ${YELLOW}$LOG_LEVEL${NC}"
echo -e "日志目录: ${YELLOW}$LOG_DIR${NC}"
echo -e "${BLUE}========================================${NC}"

# 启动MCP服务器
echo -e "${BLUE}启动MCP服务器...${NC}"
echo -e "${YELLOW}按 Ctrl+C 停止服务器${NC}"
echo -e "${BLUE}========================================${NC}"

# 设置日志文件
LOG_FILE="$LOG_DIR/mcp_server_$(date +%Y%m%d_%H%M%S).log"

# 启动服务器
python3 -m scrapling.mcp.server \
    --port "$PORT" \
    --host "$HOST" \
    --log-level "$LOG_LEVEL" \
    2>&1 | tee "$LOG_FILE" &

SERVER_PID=$!

# 等待服务器启动
echo -e "${BLUE}等待服务器启动...${NC}"
sleep 3

# 检查服务器是否运行
if kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${GREEN}✅ MCP服务器已启动 (PID: $SERVER_PID)${NC}"
    echo -e "${YELLOW}日志文件: $LOG_FILE${NC}"
else
    echo -e "${RED}❌ MCP服务器启动失败${NC}"
    echo -e "${YELLOW}请检查日志文件: $LOG_FILE${NC}"
    exit 1
fi

# 测试服务器连接
echo -e "${BLUE}测试服务器连接...${NC}"
sleep 2

if curl -s "http://$HOST:$PORT/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 服务器健康检查通过${NC}"
else
    echo -e "${YELLOW}⚠️  健康检查失败，但服务器可能仍在启动中${NC}"
fi

# 显示使用说明
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}MCP服务器运行中${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${YELLOW}服务器信息:${NC}"
echo -e "  PID: $SERVER_PID"
echo -e "  地址: http://$HOST:$PORT"
echo -e "  日志: $LOG_FILE"
echo ""
echo -e "${YELLOW}管理命令:${NC}"
echo -e "  停止服务器: kill $SERVER_PID"
echo -e "  查看日志: tail -f $LOG_FILE"
echo -e "  重启服务器: kill $SERVER_PID && $0 --port $PORT"
echo ""
echo -e "${YELLOW}OpenClaw集成:${NC}"
echo -e "  1. 将配置添加到OpenClaw的mcp配置中"
echo -e "  2. 重启OpenClaw服务"
echo -e "  3. 在AI助手工具中应该能看到Scrapling工具"
echo ""
echo -e "${YELLOW}测试连接:${NC}"
echo -e "  curl http://$HOST:$PORT/health"
echo -e "  curl http://$HOST:$PORT/tools"
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}MCP服务器已成功启动！${NC}"
echo -e "${BLUE}现在可以在OpenClaw中使用Scrapling爬虫功能了${NC}"

# 等待用户中断
trap "echo -e '\n${YELLOW}正在停止MCP服务器...${NC}'; kill $SERVER_PID; wait $SERVER_PID; echo -e '${GREEN}✅ MCP服务器已停止${NC}'" INT TERM

# 显示实时日志
echo -e "${BLUE}========================================${NC}"
echo -e "${YELLOW}实时日志 (最后20行):${NC}"
echo -e "${BLUE}========================================${NC}"
tail -f -n 20 "$LOG_FILE" &
TAIL_PID=$!

# 等待服务器进程
wait $SERVER_PID

# 清理
kill $TAIL_PID 2>/dev/null || true

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}MCP服务器运行结束${NC}"
echo -e "${BLUE}========================================${NC}"