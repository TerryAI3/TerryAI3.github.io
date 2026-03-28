#!/bin/bash

echo "本地测试佐迪网站"
echo "================"

# 检查Python3是否可用
if command -v python3 &> /dev/null; then
    echo "使用Python启动本地服务器..."
    cd "$(dirname "$0")"
    python3 -m http.server 8000 &
    SERVER_PID=$!
    echo "✅ 服务器启动在 http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    wait $SERVER_PID
elif command -v php &> /dev/null; then
    echo "使用PHP启动本地服务器..."
    cd "$(dirname "$0")"
    php -S localhost:8000 &
    SERVER_PID=$!
    echo "✅ 服务器启动在 http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    wait $SERVER_PID
else
    echo "❌ 未找到Python3或PHP，无法启动本地服务器"
    echo "请安装: sudo apt install python3 或 sudo apt install php"
fi
