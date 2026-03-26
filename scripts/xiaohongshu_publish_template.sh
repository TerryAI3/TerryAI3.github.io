#!/bin/bash
# 小红书自动化发布脚本模板
# 使用方法：修改下面的变量，然后运行脚本

# ===== 配置区域 =====
# 发布内容配置
TITLE="你的笔记标题"
CONTENT="这是笔记的正文内容。

可以有多行内容，支持Markdown格式。

#标签1 #标签2"

# 图片路径（最多9张）
IMAGES=(
    "/path/to/image1.jpg"
    "/path/to/image2.jpg"
)

# 标签（最多20个）
TAGS=(
    "生活记录"
    "日常分享"
    "美好生活"
)

# ===== 发布函数 =====
publish_to_xiaohongshu() {
    echo "开始发布小红书笔记..."
    echo "标题: $TITLE"
    echo "图片数量: ${#IMAGES[@]}"
    echo "标签: ${TAGS[*]}"
    
    # 构建JSON格式的参数
    local images_json="["
    for img in "${IMAGES[@]}"; do
        images_json+="\"$img\","
    done
    images_json="${images_json%,}]"
    
    local tags_json="["
    for tag in "${TAGS[@]}"; do
        tags_json+="\"$tag\","
    done
    tags_json="${tags_json%,}]"
    
    # 执行发布命令
    echo "执行发布命令..."
    mcporter call 'xiaohongshu.publish_content(
        title: "'"$TITLE"'",
        content: "'"$CONTENT"'",
        images: '"$images_json"',
        tags: '"$tags_json"'
    )'
    
    if [ $? -eq 0 ]; then
        echo "✅ 发布成功！"
        # 记录发布日志
        echo "$(date '+%Y-%m-%d %H:%M:%S') - 发布成功: $TITLE" >> /tmp/xiaohongshu_publish.log
    else
        echo "❌ 发布失败，请检查配置和网络"
        echo "$(date '+%Y-%m-%d %H:%M:%S') - 发布失败: $TITLE" >> /tmp/xiaohongshu_publish.log
    fi
}

# ===== 主程序 =====
main() {
    echo "小红书自动化发布脚本 v1.0"
    echo "=========================="
    
    # 检查必要工具
    if ! command -v mcporter &> /dev/null; then
        echo "错误: mcporter 未安装，请先安装 agent-reach"
        exit 1
    fi
    
    # 检查图片文件是否存在
    for img in "${IMAGES[@]}"; do
        if [ ! -f "$img" ]; then
            echo "警告: 图片文件不存在: $img"
        fi
    done
    
    # 确认发布
    read -p "确认发布？(y/n): " confirm
    if [[ $confirm == "y" || $confirm == "Y" ]]; then
        publish_to_xiaohongshu
    else
        echo "发布取消"
    fi
}

# 执行主程序
main "$@"