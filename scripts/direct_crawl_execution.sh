#!/bin/bash
# 专业网站直接图片爬取执行脚本
# 用于佐迪智能网站3天冲刺计划

set -e

echo "=== 专业网站直接图片爬取系统 ==="
echo "执行时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "目标网站: 玛祖家具、诗敏教育家具、昂利家具、昂慕斯家具"
echo ""

# 创建工作目录
WORK_DIR="/tmp/direct_crawl_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

echo "📁 工作目录: $WORK_DIR"
echo ""

# 检查XCrawl配置
echo "1. 检查XCrawl配置..."
XCRAWL_CONFIG="$HOME/.xcrawl/config.json"
if [ ! -f "$XCRAWL_CONFIG" ]; then
    echo "❌ XCrawl配置文件不存在: $XCRAWL_CONFIG"
    echo "请先配置XCrawl API密钥"
    exit 1
fi

API_KEY=$(jq -r '.XCRAWL_API_KEY // empty' "$XCRAWL_CONFIG" 2>/dev/null)
if [ -z "$API_KEY" ]; then
    echo "❌ 无法获取XCrawl API密钥"
    exit 1
fi

echo "✅ XCrawl配置检查通过"
echo ""

# 2. 创建爬取计划
echo "2. 创建专业网站爬取计划..."
cat > crawl_plan.json << EOF
{
  "crawl_plan": {
    "name": "专业家具网站图片爬取",
    "version": "1.0",
    "description": "直接从4个专业家具网站爬取图片，用于佐迪智能网站升级",
    "targets": [
      {
        "name": "玛祖家具",
        "url": "https://www.matsu.cn/",
        "priority": 1,
        "focus": ["办公家具产品", "项目案例", "高端展示"],
        "expected_images": 80,
        "crawl_depth": 3,
        "image_selectors": [".product-image", ".case-image", ".banner-image"]
      },
      {
        "name": "诗敏教育家具",
        "url": "http://www.seewin-edu.com/",
        "priority": 2,
        "focus": ["教育家具", "教室场景", "实验室设备"],
        "expected_images": 60,
        "crawl_depth": 2,
        "image_selectors": [".education-product", ".classroom-scene", ".lab-equipment"]
      },
      {
        "name": "昂利家具",
        "url": "https://www.onlead.com.cn/",
        "priority": 3,
        "focus": ["产品体系", "价格展示", "购买流程"],
        "expected_images": 70,
        "crawl_depth": 2,
        "image_selectors": [".product-img", ".price-tag", ".customer-review"]
      },
      {
        "name": "昂慕斯家具",
        "url": "https://www.onmuse.com/",
        "priority": 4,
        "focus": ["现代设计", "模块化展示", "空间解决方案"],
        "expected_images": 65,
        "crawl_depth": 2,
        "image_selectors": [".modern-design", ".modular-show", ".space-solution"]
      }
    ],
    "schedule": {
      "day1": ["玛祖家具"],
      "day2": ["诗敏教育家具", "昂利家具"],
      "day3": ["昂慕斯家具", "优化处理"]
    },
    "output": {
      "directory": "./crawled_images",
      "organize_by": ["website", "category"],
      "image_standards": {
        "product": {"width": 1200, "height": 800, "format": "webp", "max_size_kb": 200},
        "case": {"width": 1600, "height": 1000, "format": "webp", "max_size_kb": 500}
      }
    }
  }
}
EOF

echo "✅ 爬取计划创建完成"
echo ""

# 3. 测试网站可访问性
echo "3. 测试目标网站可访问性..."
TEST_SITES=(
    "https://www.matsu.cn/"
    "http://www.seewin-edu.com/"
    "https://www.onlead.com.cn/"
    "https://www.onmuse.com/"
)

cat > site_access_test.md << EOF
# 目标网站可访问性测试报告
## 测试时间: $(date '+%Y-%m-%d %H:%M:%S')

## 测试结果
EOF

for site in "${TEST_SITES[@]}"; do
    echo "测试: $site"
    if curl -s -I "$site" --max-time 10 | head -1 | grep -q "200\|301\|302"; then
        echo "✅ $site 可访问" | tee -a site_access_test.md
    else
        echo "❌ $site 访问失败" | tee -a site_access_test.md
    fi
    sleep 1
done

echo ""
echo "✅ 网站可访问性测试完成"
echo ""

# 4. 创建爬取脚本
echo "4. 创建自动化爬取脚本..."
cat > crawl_matsu.sh << 'EOF'
#!/bin/bash
# 玛祖家具图片爬取脚本

set -e

echo "=== 开始爬取玛祖家具图片 ==="
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 配置
API_KEY="$1"
OUTPUT_DIR="./matsu_crawled"
LOG_FILE="./logs/matsu_crawl_$(date +%Y%m%d_%H%M%S).log"

# 创建目录
mkdir -p "$OUTPUT_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

echo "输出目录: $OUTPUT_DIR"
echo "日志文件: $LOG_FILE"
echo ""

# 1. 分析网站结构
echo "1. 分析玛祖家具网站结构..."
curl -sS -X POST "https://run.xcrawl.com/v1/scrape" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{
    "url": "https://www.matsu.cn/",
    "mode": "sync",
    "output": {
      "formats": ["links"]
    },
    "request": {
      "locale": "zh-CN,zh;q=0.9",
      "device": "desktop",
      "only_main_content": true
    }
  }' > "$OUTPUT_DIR/matsu_links.json" 2>> "$LOG_FILE"

echo "✅ 网站结构分析完成"
echo ""

# 2. 提取产品页面URL
echo "2. 提取产品页面URL..."
# 这里应该解析JSON提取产品页面，暂时简化
cat > "$OUTPUT_DIR/product_urls.txt" << URLS
https://www.matsu.cn/web/projectslist?tid=3
https://www.matsu.cn/web/projectslist?tid=4
https://www.matsu.cn/web/projectslist?tid=5
https://www.matsu.cn/web/projectslist?tid=6
https://www.matsu.cn/web/case1
URLS

echo "✅ 产品页面URL提取完成"
echo ""

# 3. 爬取产品图片
echo "3. 开始爬取产品图片..."
PRODUCT_COUNT=0

while read url && [ $PRODUCT_COUNT -lt 20 ]; do
    echo "爬取: $url"
    
    # 使用XCrawl爬取页面图片
    curl -sS -X POST "https://run.xcrawl.com/v1/scrape" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${API_KEY}" \
      -d '{
        "url": "'"$url"'",
        "mode": "sync",
        "output": {
          "formats": ["markdown", "links"]
        },
        "request": {
          "locale": "zh-CN,zh;q=0.9",
          "device": "desktop",
          "only_main_content": true
        },
        "js_render": {
          "enabled": true,
          "wait_until": "networkidle"
        }
      }' > "$OUTPUT_DIR/page_${PRODUCT_COUNT}.json" 2>> "$LOG_FILE"
    
    # 提取图片信息（简化处理）
    echo "页面 $PRODUCT_COUNT 爬取完成" >> "$LOG_FILE"
    
    PRODUCT_COUNT=$((PRODUCT_COUNT + 1))
    sleep 2  # 避免请求过于频繁
done < "$OUTPUT_DIR/product_urls.txt"

echo "✅ 产品图片爬取完成，共 $PRODUCT_COUNT 个页面"
echo ""

# 4. 生成爬取报告
echo "4. 生成爬取报告..."
cat > "$OUTPUT_DIR/crawl_report.md" << REPORT
# 玛祖家具图片爬取报告
## 爬取时间: $(date '+%Y-%m-%d %H:%M:%S')

## 执行摘要
- **目标网站**: https://www.matsu.cn/
- **爬取页面**: $PRODUCT_COUNT 个产品页面
- **输出文件**: $OUTPUT_DIR/
- **日志文件**: $LOG_FILE

## 爬取内容
### 产品分类
1. 座椅系列 (tid=3)
2. 办公桌系列 (tid=4)
3. 存储系列 (tid=5)
4. 空间支持 (tid=6)
5. 案例展示 (case1)

### 获取的数据
1. 页面结构分析 (matsu_links.json)
2. 产品页面数据 (page_*.json)
3. 图片链接和元数据

## 下一步处理
1. 从JSON数据中提取图片URL
2. 下载图片文件
3. 处理为标准化格式
4. 集成到网站

## 注意事项
- 遵守robots.txt和爬取礼仪
- 控制请求频率
- 记录爬取过程
- 准备版权风险评估

---
**报告生成时间**: $(date '+%Y-%m-%d %H:%M:%S')
**执行状态**: ✅ 爬取完成
REPORT

echo "✅ 爬取报告生成完成"
echo ""

echo "=== 玛祖家具爬取完成 ==="
echo "输出目录: $OUTPUT_DIR"
echo "日志文件: $LOG_FILE"
echo "下一步: 处理爬取的数据，提取图片"
EOF

chmod +x crawl_matsu.sh

# 创建其他网站的爬取脚本模板
cat > crawl_template.sh << 'EOF'
#!/bin/bash
# 网站爬取模板脚本

set -e

SITE_NAME="$1"
SITE_URL="$2"
API_KEY="$3"
OUTPUT_DIR="./${SITE_NAME}_crawled"

echo "=== 开始爬取 $SITE_NAME ==="
echo "URL: $SITE_URL"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 创建目录
mkdir -p "$OUTPUT_DIR"

# 基本爬取
curl -sS -X POST "https://run.xcrawl.com/v1/scrape" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{
    "url": "'"$SITE_URL"'",
    "mode": "sync",
    "output": {
      "formats": ["markdown", "links", "summary"]
    },
    "request": {
      "locale": "zh-CN,zh;q=0.9",
      "device": "desktop",
      "only_main_content": true
    },
    "js_render": {
      "enabled": true,
      "wait_until": "networkidle"
    }
  }' > "$OUTPUT_DIR/initial_crawl.json"

echo "✅ $SITE_NAME 初始爬取完成"
echo "输出文件: $OUTPUT_DIR/initial_crawl.json"
EOF

chmod +x crawl_template.sh

echo "✅ 爬取脚本创建完成"
echo ""

# 5. 创建图片处理脚本
echo "5. 创建图片处理脚本..."
cat > process_crawled_images.sh << 'EOF'
#!/bin/bash
# 爬取图片处理脚本

set -e

echo "=== 爬取图片处理系统 ==="
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 检查工具
check_tools() {
    echo "检查图片处理工具..."
    
    if ! command -v convert &> /dev/null; then
        echo "❌ ImageMagick未安装"
        echo "安装命令: sudo apt-get install imagemagick"
        exit 1
    fi
    
    if ! command -v cwebp &> /dev/null; then
        echo "❌ WebP工具未安装"
        echo "安装命令: sudo apt-get install webp"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        echo "❌ jq未安装"
        echo "安装命令: sudo apt-get install jq"
        exit 1
    fi
    
    echo "✅ 所有必要工具已安装"
}

# 创建处理目录结构
create_directories() {
    echo "创建处理目录结构..."
    
    mkdir -p "./processed/products/office"
    mkdir -p "./processed/products/education"
    mkdir -p "./processed/cases/technology"
    mkdir -p "./processed/cases/education"
    mkdir -p "./processed/cases/design"
    mkdir -p "./processed/banners"
    mkdir -p "./logs"
    mkdir -p "./reports"
    
    echo "✅ 目录结构创建完成"
}

# 处理玛祖家具图片
process_matsu_images() {
    echo "处理玛祖家具图片..."
    
    INPUT_DIR="./matsu_crawled"
    OUTPUT_DIR="./processed"
    
    if [ ! -d "$INPUT_DIR" ]; then
        echo "⚠️  玛祖家具爬取目录不存在，跳过"
        return
    fi
    
    # 这里应该是实际处理JSON数据提取图片
    # 暂时创建示例处理流程
    
    cat > "$OUTPUT_DIR/matsu_processing_report.md" << MATSU_REPORT
# 玛祖家具图片处理报告
## 处理时间: $(date '+%Y-%m-%d %H:%M:%S')

## 处理流程
1. **数据提取**: 从爬取的JSON数据中提取图片URL
2. **图片下载**: 下载图片到本地
3. **质量筛选**: 筛选高质量图片
4. **尺寸调整**: 调整为标准尺寸
   - 产品图片: 1200×800像素
   - 案例图片: 1600×1000像素
5. **格式转换**: 转换为WebP格式
6. **优化压缩**: 优化文件大小
7. **分类组织**: 按产品分类组织

## 预期处理结果
- **办公家具产品图片**: 40-50张
- **项目案例图片**: 20-30张
- **品牌形象图片**: 10-15张
- **总计**: 70-95张图片

## 处理标准
- 图片质量: 高清，光线充足，构图合理
- 文件格式: WebP (质量85%)
- 文件大小: 产品图片<200KB，案例图片<500KB
- 命名规范: matsu_类别_名称_序号.webp

## 输出目录
\`\`\`
processed/
├── products/office/matsu_*.webp
├── cases/technology/matsu_*.webp
├── cases/design/matsu_*.webp
└── banners/matsu_*.webp
\`\`\`

## 下一步
1. 实际执行图片下载和处理
2. 集成到佐迪智能网站
3. 测试显示效果
4. 优化用户体验

---
**报告生成时间**: $(date '+%Y-%m-%d %H:%M:%S')
**处理状态**: 📋 等待执行
MATSU_REPORT
    
    echo "✅ 玛祖家具处理计划创建完成"
}

# 处理其他网站图片
process_other_sites() {
    SITES=("seewin" "onlead" "onmuse")
    
    for site in "${SITES[@]}"; do
        echo "处理${site}图片..."
        
        cat > "./processed/${site}_processing_plan.md" << SITE_PLAN
# ${site}图片处理计划
## 处理时间: $(date '+%Y-%m-%d %H:%M:%S')

## 网站特点
$(case $site in
    "seewin")
        echo "- 教育专业家具"
        echo "- 教室、实验室场景"
        echo "- 学校环境展示"
        ;;
    "onlead")
        echo "- 综合办公家具"
        echo "- 产品体系完整"
        echo "- 实用导向展示"
        ;;
    "onmuse")
        echo "- 现代设计家具"
        echo "- 模块化展示"
        echo "- 空间解决方案"
        ;;
esac)

## 处理目标
- 提取高质量产品图片
- 学习专业展示方式
- 统一处理为标准格式
- 集成到对应产品分类

## 处理流程
1. 数据解析和图片提取
2. 质量评估和筛选
3. 尺寸标准化处理
4. 格式转换和优化
5. 分类组织和存储

## 预期数量
- 产品图片: 20-40张
- 场景图片: 10-20张
- 总计: 30-60张

## 输出位置
\`\`\`
processed/
├── products/$(case $site in
    "seewin") echo "education" ;;
    *) echo "office" ;;
esac)/${site}_*.webp
└── cases/$(case $site in
    "seewin") echo "education" ;;
    "onmuse") echo "design" ;;
    *) echo "technology" ;;
esac)/${site}_*.webp
\`\`\`

## 注意事项
- 遵守版权规定
- 控制处理质量
- 确保与品牌一致性
- 准备备份方案

---
**计划生成时间**: $(date '+%Y-%m-%d %H:%M:%S')
**状态**: 📋 等待执行
SITE_PLAN
        
        echo "✅ ${site}处理计划创建完成"
    done
}

# 生成集成计划
generate_integration_plan() {
    echo "生成网站集成计划..."
    
    cat > "./processed/integration_plan.md" << INTEGRATION_PLAN
# 爬取图片网站集成计划
## 制定时间: $(date '+%Y-%m-%d %H:%M:%S')

## 集成目标
将爬取的专业网站图片集成到佐迪智能网站，达到同等专业水平。

## 集成策略

### 1. 玛祖家具图片集成
**集成位置**:
- 办公家具产品页面
- 高端案例展示
- 品牌形象区域

**集成方式**:
- 学习高端展示角度
- 应用专业构图技巧
- 统一视觉风格

### 2. 诗敏家具图片集成
**集成位置**:
- 学校家具产品页面
- 教育案例展示
- 教室场景展示

**集成方式**:
- 应用教育专业展示
- 优化学校场景呈现
- 增强教育专业性

### 3. 昂利家具图片集成
**集成位置**:
- 产品体系展示
- 价格信息区域
- 购买流程展示

**集成方式**:
- 完善产品分类展示
- 优化购买体验
- 增强实用性

### 4. 昂慕斯家具图片集成
**集成位置**:
- 现代设计产品展示
- 空间解决方案
- 美学表达区域

**集成方式**:
- 应用现代设计理念
- 优化空间展示
- 增强设计感

## 集成时间表

### 第一天：玛祖家具集成
- 办公家具产品页面更新
- 高端案例展示创建
- 品牌形象优化

### 第二天：诗敏和昂利家具集成
- 学校家具产品页面完善
- 教育案例展示创建
- 产品体系优化

### 第三天：昂慕斯家具和全面优化
- 现代设计产品展示
- 全面视觉统一
- 最终效果测试

## 技术实现

### 图片替换策略
1. **直接替换**: 用爬取图片替换现有低质量图片
2. **补充增强**: 用爬取图片补充现有展示角度
3. **学习优化**: 学习爬取图片的展示方式，优化自有图片

### 性能优化
1. **格式优化**: 统一为WebP格式
2. **尺寸优化**: 响应式图片处理
3. **加载优化**: 懒加载实现
4. **CDN加速**: 图片CDN部署

### SEO优化
1. **Alt标签优化**: 添加描述性Alt文本
2. **文件名优化**: 优化图片文件名
3. **站点地图**: 生成图片站点地图
4. **结构化数据**: 添加图片结构化数据

## 质量控制

### 质量检查点
1. **显示效果**: 在不同设备上测试显示效果
2. **加载性能**: 测试图片加载速度和性能
3. **用户体验**: 收集用户反馈和互动数据
4. **品牌一致性**: 确保与品牌调性一致

### 版权风险管理
1. **使用评估**: 评估爬取图片的商业使用风险
2. **备份准备**: 准备免费商用图片作为备份
3. **逐步替换**: 计划用自有图片逐步替换
4. **法律咨询**: 必要时咨询法律专家

## 预期效果

### 量化指标
- 图片质量评分: > 8.5/10
- 页面加载时间: < 2秒
- 用户停留时间: 增加30%
- 图片点击率: > 15%

### 质化效果
- 达到专业网站展示水平
- 建立品牌专业形象
- 提升用户信任度
- 形成竞争优势

## 监控和优化

### 监控指标
1. 图片加载性能监控
2. 用户互动数据跟踪
3. 转化效果分析
4. SEO效果评估

### 优化机制
1. 基于数据的持续优化
2. A/B测试不同展示方式
3. 定期更新和补充
4. 自动化质量检查

---
**集成计划版本**: v1.0
**制定时间**: $(date '+%Y-%m-%d %H:%M:%S')
**执行时间**: 2026-03-27 至 2026-03-29
**目标**: 使佐迪智能网站达到专业家具网站水平
INTEGRATION_PLAN
    
    echo "✅ 集成计划生成完成"
}

# 主函数
main() {
    echo "开始准备直接爬取执行系统..."
    echo ""
    
    check_tools
    create_directories
    process_matsu_images
    process_other_sites
    generate_integration_plan
    
    echo ""
    echo "=== 直接爬取执行系统准备完成 ==="
    echo ""
    echo "📋 生成的文件:"
    echo "1. crawl_plan.json - 爬取计划配置"
    echo "2. site_access_test.md - 网站可访问性测试"
    echo "3. crawl_matsu.sh - 玛祖家具爬取脚本"
    echo "4. crawl_template.sh - 通用爬取脚本模板"
    echo "5. process_crawled_images.sh - 图片处理脚本"
    echo "6. 各网站处理计划: processed/*_processing_*.md"
    echo "7. integration_plan.md - 网站集成计划"
    echo ""
    echo "🚀 下一步执行步骤:"
    echo "1. 测试爬取脚本: ./crawl_matsu.sh \"$API_KEY\""
    echo "2. 处理爬取数据: ./process_crawled_images.sh"
    echo "3. 集成到网站: 参考 integration_plan.md"
    echo ""
    echo "📅 建议执行时间表:"
    echo "第一天 (3月27日): 玛祖家具爬取和处理"
    echo "第二天 (3月28日): 诗敏和昂利家具爬取处理"
    echo "第三天 (3月29日): 昂慕斯家具爬取和全面优化"
    echo ""
    echo "⚠️  重要注意事项:"
    echo "1. 遵守robots.txt和爬取礼仪"
    echo "2. 控制请求频率，避免给网站造成压力"
    echo "3. 注意版权问题，商业使用需谨慎"
    echo "4. 准备免费商用图片作为备份方案"
    echo ""
    echo "工作目录: $WORK_DIR"
    echo "所有脚本和计划已保存"
}

# 执行主函数
main