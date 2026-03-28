# Google Drive访问配置指南
## 用于佐迪智能网站图片选取

## 🎯 目标
配置Google Drive访问权限，以便从俊奇的Drive中选取产品图片用于网站更新。

## 🔧 配置步骤

### 第一步：创建Google Cloud项目
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 项目名称：`Zuodii-Website-Images`
4. 项目ID：自动生成或自定义

### 第二步：启用API
1. 在API库中搜索并启用以下API：
   - Google Drive API
   - Google Picker API（可选，用于文件选择器）
2. 创建OAuth 2.0客户端ID
   - 应用类型：桌面应用
   - 名称：`Zuodii Image Selector`
3. 下载客户端密钥文件：`client_secret.json`

### 第三步：配置OAuth同意屏幕
1. 用户类型：内部（如果只有自己使用）或外部
2. 应用名称：`佐迪智能图片选取工具`
3. 用户支持邮箱：你的邮箱
4. 开发者联系信息：你的邮箱
5. 添加范围：
   - `https://www.googleapis.com/auth/drive.readonly`（只读访问）
   - `https://www.googleapis.com/auth/drive.metadata.readonly`（元数据读取）

### 第四步：安装和配置gog CLI
```bash
# 如果尚未安装gog
brew install steipete/tap/gogcli

# 配置认证
gog auth credentials /path/to/client_secret.json
gog auth add your-email@gmail.com --services drive

# 验证配置
gog auth list
```

### 第五步：测试访问
```bash
# 测试列出文件
gog drive list --max 10

# 搜索产品图片
gog drive search "办公家具" --max 20
gog drive search "学校家具" --max 20
gog drive search "佐迪智能" --max 20
```

## 📁 预期的目录结构

### Google Drive中的可能结构
```
Google Drive/
├── 产品图片/
│   ├── 办公家具/
│   │   ├── 座椅/
│   │   ├── 办公桌/
│   │   ├── 存储/
│   │   └── 空间支持/
│   └── 学校家具/
│       ├── 教室家具/
│       ├── 实验室家具/
│       └── 图书馆家具/
├── 项目案例/
│   ├── 科技公司/
│   ├── 学校项目/
│   ├── 设计公司/
│   └── 其他行业/
└── 其他资源/
    ├── 品牌素材/
    ├── 设计文件/
    └── 文档资料/
```

## 🔍 图片搜索策略

### 搜索关键词
```bash
# 办公家具相关
gog drive search "办公椅 OR 办公桌 OR 会议桌 OR 文件柜"
gog drive search "办公家具 product"
gog drive search "office furniture"

# 学校家具相关
gog drive search "课桌椅 OR 实验台 OR 书架"
gog drive search "学校家具 education"
gog drive search "classroom furniture"

# 案例图片
gog drive search "项目案例 OR 实施案例"
gog drive search "case study OR 案例"
gog drive search "项目照片 OR 现场照片"

# 按文件类型
gog drive search "mimeType contains 'image/'"
gog drive search "fileExtension = 'jpg' OR fileExtension = 'png'"
```

### 文件筛选条件
```bash
# 按修改时间
gog drive search "modifiedTime > '2024-01-01T00:00:00'"

# 按文件大小
gog drive search "size > 100000 and size < 500000"  # 100KB-500KB

# 组合条件
gog drive search "(办公家具 OR 学校家具) and modifiedTime > '2024-01-01'"
```

## 📥 图片下载脚本

### 基本下载脚本
```bash
#!/bin/bash
# download_images.sh

# 配置
ACCESS_TOKEN="your_access_token"
FOLDER_ID="your_folder_id"
OUTPUT_DIR="./downloaded_images"

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

# 使用gog下载
gog drive list --folder "$FOLDER_ID" --max 50 --json | \
jq -r '.[] | select(.mimeType | contains("image")) | .id' | \
while read FILE_ID; do
    FILE_NAME=$(gog drive get "$FILE_ID" --json | jq -r '.name')
    echo "下载: $FILE_NAME"
    gog drive download "$FILE_ID" --out "$OUTPUT_DIR/$FILE_NAME"
done
```

### 批量处理脚本
```bash
#!/bin/bash
# batch_download.sh

# 搜索并下载所有产品图片
SEARCH_QUERIES=(
    "办公家具"
    "学校家具"
    "办公椅"
    "办公桌"
    "课桌椅"
    "实验台"
)

for query in "${SEARCH_QUERIES[@]}"; do
    echo "搜索: $query"
    gog drive search "$query" --max 20 --json | \
    jq -r '.[] | select(.mimeType | contains("image")) | "\(.id) \(.name)"' | \
    while read FILE_ID FILE_NAME; do
        SAFE_NAME=$(echo "$FILE_NAME" | tr ' ' '_' | tr -cd '[:alnum:]_.-')
        echo "下载: $SAFE_NAME"
        gog drive download "$FILE_ID" --out "./images/$SAFE_NAME"
        sleep 1  # 避免请求过于频繁
    done
done
```

## 🖼️ 图片处理流程

### 1. 下载原始图片
```bash
# 从特定文件夹下载
gog drive list --folder "产品图片/办公家具" --recursive --json | \
jq -r '.[] | select(.mimeType | contains("image")) | .id' | \
xargs -I {} gog drive download {} --out "./raw_images/"
```

### 2. 批量处理脚本
```bash
#!/bin/bash
# process_images.sh

INPUT_DIR="./raw_images"
OUTPUT_DIR="./processed_images"

# 创建输出目录
mkdir -p "$OUTPUT_DIR/products"
mkdir -p "$OUTPUT_DIR/cases"

# 处理每张图片
for img in "$INPUT_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
    if [ -f "$img" ]; then
        # 获取文件名和扩展名
        filename=$(basename "$img")
        name="${filename%.*}"
        ext="${filename##*.}"
        
        # 判断图片类型（根据文件名或内容）
        if [[ "$filename" == *"案例"* || "$filename" == *"case"* || "$filename" == *"项目"* ]]; then
            # 案例图片：调整为1600×1000
            convert "$img" -resize 1600x1000 -quality 85 "$OUTPUT_DIR/cases/${name}.jpg"
            # 转换为WebP
            cwebp -q 85 "$OUTPUT_DIR/cases/${name}.jpg" -o "$OUTPUT_DIR/cases/${name}.webp"
        else
            # 产品图片：调整为1200×800
            convert "$img" -resize 1200x800 -quality 85 "$OUTPUT_DIR/products/${name}.jpg"
            # 转换为WebP
            cwebp -q 85 "$OUTPUT_DIR/products/${name}.jpg" -o "$OUTPUT_DIR/products/${name}.webp"
        fi
        
        echo "处理完成: $filename"
    fi
done
```

## 📊 图片质量检查

### 检查脚本
```bash
#!/bin/bash
# check_image_quality.sh

echo "=== 图片质量检查 ==="
echo "检查时间: $(date)"

# 检查WebP图片
for img in ./processed_images/**/*.webp; do
    if [ -f "$img" ]; then
        size=$(stat -f%z "$img")
        dimensions=$(identify -format "%wx%h" "$img" 2>/dev/null || echo "未知")
        
        # 判断图片类型
        if [[ "$img" == *"/cases/"* ]]; then
            expected_size="1600x1000"
            max_size_kb=500
        else
            expected_size="1200x800"
            max_size_kb=200
        fi
        
        size_kb=$((size / 1024))
        
        if [ "$dimensions" = "$expected_size" ] && [ $size_kb -le $max_size_kb ]; then
            echo "✅ $img: $dimensions, ${size_kb}KB"
        else
            echo "❌ $img: $dimensions (期望: $expected_size), ${size_kb}KB (最大: ${max_size_kb}KB)"
        fi
    fi
done
```

## 🔄 集成到3天冲刺计划

### 修改后的3天冲刺计划

#### 第一天 (3月27日) - 增加图片下载任务
**02:00-03:00**：配置Google Drive访问 + 下载办公家具图片
**03:00-04:00**：处理办公家具图片（调整尺寸、转换格式）
**04:00-05:00**：集成办公家具图片到网站
**05:00-06:00**：测试和优化

#### 第二天 (3月28日) - 增加图片下载任务
**02:00-03:00**：下载学校家具和案例图片
**03:00-04:00**：处理学校家具和案例图片
**04:00-05:00**：集成到网站对应位置
**05:00-06:00**：测试和优化

#### 第三天 (3月29日) - 优化和检查
**02:00-03:00**：图片质量全面检查
**03:00-04:00**：图片SEO优化
**04:00-05:00**：最终测试和验证
**05:00-06:00**：生成最终报告

## 🛡️ 安全注意事项

### 访问权限控制
1. **最小权限原则**：只请求`drive.readonly`权限
2. **访问范围限制**：只访问必要的文件夹
3. **定期审查**：定期审查和更新访问令牌
4. **密钥保护**：妥善保管`client_secret.json`文件

### 数据安全
1. **本地存储**：下载的图片只存储在本地
2. **处理安全**：处理完成后删除原始文件（可选）
3. **版权合规**：确保所有图片有合法使用权限
4. **隐私保护**：不下载包含个人隐私信息的图片

## 📝 故障排除

### 常见问题
1. **认证失败**
   - 检查`client_secret.json`文件路径
   - 确认OAuth范围已正确配置
   - 重新运行`gog auth credentials`

2. **权限不足**
   - 确认Drive文件夹的共享设置
   - 检查OAuth范围是否包含`drive.readonly`
   - 尝试使用服务账号（如果需要自动化）

3. **API限制**
   - Google Drive API有每日配额限制
   - 大量下载时可能需要分批进行
   - 考虑使用增量同步

4. **网络问题**
   - 检查网络连接
   - 配置代理（如果需要）
   - 增加请求超时时间

### 调试命令
```bash
# 查看认证状态
gog auth list --verbose

# 测试API访问
gog drive about --json

# 查看配额使用
# 需要在Google Cloud Console查看

# 查看详细错误
gog drive list --debug 2>&1 | tail -50
```

## ✅ 成功标准

### 配置成功
- ✅ gog CLI可以正常认证
- ✅ 可以列出Google Drive文件
- ✅ 可以搜索和下载图片文件

### 下载成功
- ✅ 成功下载所有需要的产品图片
- ✅ 图片质量符合要求
- ✅ 文件命名规范统一

### 处理成功
- ✅ 所有图片尺寸调整正确
- ✅ 成功转换为WebP格式
- ✅ 文件大小控制在标准内

### 集成成功
- ✅ 图片正确集成到网站
- ✅ 显示效果良好
- ✅ 加载性能达标

## 🚀 立即行动清单

### 今天完成
1. [ ] 创建Google Cloud项目
2. [ ] 启用Drive API和创建OAuth客户端
3. [ ] 下载`client_secret.json`文件
4. [ ] 配置gog认证
5. [ ] 测试Drive访问

### 明天开始 (3月27日)
1. [ ] 按计划下载办公家具图片
2. [ ] 处理图片并集成到网站
3. [ ] 测试显示效果

### 后续计划
1. [ ] 建立定期图片更新机制
2. [ ] 自动化图片处理流程
3. [ ] 建立图片质量监控

---
**配置指南版本**: v1.0
**最后更新**: 2026-03-26
**适用场景**: 佐迪智能网站3天冲刺计划
**注意事项**: 确保所有操作符合Google服务条款和数据保护法规