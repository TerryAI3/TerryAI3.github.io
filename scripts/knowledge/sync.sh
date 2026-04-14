#!/bin/bash

# 知识库同步脚本
# 作者：极客 (Geek)
# 日期：2026年4月12日

set -e

echo "🔄 开始同步知识库..."

# 检查必要命令
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ 命令 $1 未安装，请先安装"
        exit 1
    fi
}

check_command "git"
check_command "find"

# 定义颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 知识库根目录
KNOWLEDGE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
echo "知识库根目录: $KNOWLEDGE_ROOT"

# 1. 检查知识库完整性
echo -e "\n${BLUE}1. 检查知识库完整性...${NC}"

# 检查必要目录是否存在
required_dirs=(
    "knowledge/project"
    "knowledge/domain"
    "knowledge/operations"
    "process/development"
    "process/deployment"
    "process/maintenance"
    "technical/frontend"
    "technical/backend"
    "technical/infrastructure"
    "decisions"
    "metrics/build"
    "metrics/runtime"
    "metrics/business"
)

missing_dirs=()
for dir in "${required_dirs[@]}"; do
    if [ ! -d "$KNOWLEDGE_ROOT/$dir" ]; then
        missing_dirs+=("$dir")
    fi
done

if [ ${#missing_dirs[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ 所有必要目录都存在${NC}"
else
    echo -e "${YELLOW}⚠️  缺少以下目录:${NC}"
    for dir in "${missing_dirs[@]}"; do
        echo "  - $dir"
    done
    
    # 创建缺失的目录
    read -p "是否创建缺失的目录？ (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        for dir in "${missing_dirs[@]}"; do
            mkdir -p "$KNOWLEDGE_ROOT/$dir"
            echo -e "${GREEN}✅ 创建目录: $dir${NC}"
        done
    fi
fi

# 2. 检查必要文件
echo -e "\n${BLUE}2. 检查必要文件...${NC}"

required_files=(
    "README_KNOWLEDGE.md"
    "LLM_WIKI_ARCHITECTURE.md"
    "decisions/template.md"
    "knowledge/project/vision.md"
    "knowledge/project/tech_stack.md"
    "knowledge/operations/deployment.md"
    "knowledge/operations/monitoring.md"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$KNOWLEDGE_ROOT/$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ 所有必要文件都存在${NC}"
else
    echo -e "${YELLOW}⚠️  缺少以下文件:${NC}"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
fi

# 3. 生成知识库索引
echo -e "\n${BLUE}3. 生成知识库索引...${NC}"

INDEX_FILE="$KNOWLEDGE_ROOT/knowledge/INDEX.md"
cat > "$INDEX_FILE" << 'EOF'
# 知识库索引

## 概述
本文档是佐迪网站项目知识库的索引文件，帮助快速查找相关知识。

## 核心知识 (knowledge/)
### 项目知识 (project/)
- [vision.md](project/vision.md) - 项目愿景和使命
- [tech_stack.md](project/tech_stack.md) - 技术栈选择
- [architecture.md](project/architecture.md) - 系统架构设计
- [decisions.md](project/decisions.md) - 重要决策记录

### 领域知识 (domain/)
- [smart_furniture.md](domain/smart_furniture.md) - 智能家具行业知识
- [market_analysis.md](domain/market_analysis.md) - 市场分析
- [customer_insights.md](domain/customer_insights.md) - 用户洞察

### 运维知识 (operations/)
- [deployment.md](operations/deployment.md) - 部署流程
- [monitoring.md](operations/monitoring.md) - 监控体系
- [troubleshooting.md](operations/troubleshooting.md) - 故障排除

## 过程知识 (process/)
### 开发流程 (development/)
- [workflow.md](development/workflow.md) - 开发工作流
- [code_review.md](development/code_review.md) - 代码审查标准
- [testing.md](development/testing.md) - 测试策略

### 部署流程 (deployment/)
- [cdn_setup.md](deployment/cdn_setup.md) - CDN配置
- [automation.md](deployment/automation.md) - 自动化部署
- [rollback.md](deployment/rollback.md) - 回滚流程

### 维护流程 (maintenance/)
- [daily_checklist.md](maintenance/daily_checklist.md) - 日常检查清单
- [performance_audit.md](maintenance/performance_audit.md) - 性能审计
- [security_scan.md](maintenance/security_scan.md) - 安全扫描

## 技术知识 (technical/)
### 前端技术 (frontend/)
- [vite_config.md](frontend/vite_config.md) - Vite配置详解
- [react_patterns.md](frontend/react_patterns.md) - React最佳实践
- [performance_opt.md](frontend/performance_opt.md) - 性能优化技巧

### 后端技术 (backend/)
- [api_design.md](backend/api_design.md) - API设计
- [database.md](backend/database.md) - 数据库设计
- [auth.md](backend/auth.md) - 认证授权

### 基础设施 (infrastructure/)
- [cdn_config.md](infrastructure/cdn_config.md) - CDN配置详解
- [cloudflare.md](infrastructure/cloudflare.md) - Cloudflare配置
- [monitoring_tools.md](infrastructure/monitoring_tools.md) - 监控工具

## 决策日志 (decisions/)
- [template.md](decisions/template.md) - 决策文档模板
- [2026-04-12-vite-optimization.md](decisions/2026-04-12-vite-optimization.md) - Vite优化决策
- [2026-04-12-cloudflare-cdn.md](decisions/2026-04-12-cloudflare-cdn.md) - Cloudflare CDN决策

## 性能指标 (metrics/)
### 构建指标 (build/)
- [build_time.md](build/build_time.md) - 构建时间记录
- [bundle_size.md](build/bundle_size.md) - 包大小记录

### 运行时指标 (runtime/)
- [page_load.md](runtime/page_load.md) - 页面加载时间
- [cdn_hit_rate.md](runtime/cdn_hit_rate.md) - CDN命中率
- [error_rate.md](runtime/error_rate.md) - 错误率

### 业务指标 (business/)
- [traffic.md](business/traffic.md) - 流量统计
- [conversions.md](business/conversions.md) - 转化率
- [user_engagement.md](business/user_engagement.md) - 用户参与度

## 统计信息
最后更新: $(date +%Y-%m-%d)
总文档数: 统计中...
知识覆盖率: 统计中...

## 搜索提示
使用以下命令搜索知识库:
```bash
# 搜索特定关键词
grep -r "关键词" knowledge/ process/ technical/

# 查找最近更新的文档
find . -name "*.md" -type f -exec stat -c "%Y %n" {} \; | sort -nr | head -10

# 统计文档数量
find knowledge/ process/ technical/ decisions/ metrics/ -name "*.md" | wc -l
```

## 维护说明
1. 添加新文档后，请更新此索引文件
2. 定期运行同步脚本检查完整性
3. 保持文档链接的正确性
4. 及时更新统计信息
EOF

echo -e "${GREEN}✅ 索引文件已生成: knowledge/INDEX.md${NC}"

# 4. 统计文档信息
echo -e "\n${BLUE}4. 统计文档信息...${NC}"

# 统计各目录文档数量
echo "文档统计:"
echo "=========="

total_count=0
for dir in knowledge process technical decisions metrics; do
    if [ -d "$KNOWLEDGE_ROOT/$dir" ]; then
        count=$(find "$KNOWLEDGE_ROOT/$dir" -name "*.md" -type f | wc -l)
        total_count=$((total_count + count))
        echo -e "${BLUE}$dir/${NC}: $count 个文档"
        
        # 显示具体文件（最多5个）
        if [ $count -gt 0 ]; then
            find "$KNOWLEDGE_ROOT/$dir" -name "*.md" -type f | head -5 | while read file; do
                filename=$(basename "$file")
                echo "  - $filename"
            done
            if [ $count -gt 5 ]; then
                echo "  ... 还有 $((count - 5)) 个文档"
            fi
        fi
        echo
    fi
done

echo -e "${GREEN}总文档数: $total_count${NC}"

# 5. 检查文档质量
echo -e "\n${BLUE}5. 检查文档质量...${NC}"

# 检查文档是否包含必要部分
check_document_structure() {
    local file=$1
    local issues=()
    
    # 检查文件是否存在
    if [ ! -f "$file" ]; then
        echo "  ❌ 文件不存在: $file"
        return 1
    fi
    
    # 检查文件大小
    local size=$(wc -c < "$file")
    if [ $size -lt 100 ]; then
        issues+=("文件过小 (<100字节)")
    fi
    
    # 检查是否包含标题
    if ! grep -q "^# " "$file"; then
        issues+=("缺少标题 (# Title)")
    fi
    
    # 检查是否包含更新日期
    if ! grep -qi "最后更新\|updated\|date" "$file"; then
        issues+=("缺少更新日期")
    fi
    
    # 检查是否包含维护者
    if ! grep -qi "维护者\|author\|maintainer" "$file"; then
        issues+=("缺少维护者信息")
    fi
    
    # 输出检查结果
    if [ ${#issues[@]} -eq 0 ]; then
        echo "  ✅ $(basename "$file")"
    else
        echo "  ⚠️  $(basename "$file") - 问题:"
        for issue in "${issues[@]}"; do
            echo "    - $issue"
        done
    fi
}

# 检查核心文档
echo "核心文档质量检查:"
core_docs=(
    "$KNOWLEDGE_ROOT/knowledge/project/vision.md"
    "$KNOWLEDGE_ROOT/knowledge/project/tech_stack.md"
    "$KNOWLEDGE_ROOT/knowledge/operations/deployment.md"
    "$KNOWLEDGE_ROOT/knowledge/operations/monitoring.md"
    "$KNOWLEDGE_ROOT/decisions/2026-04-12-vite-optimization.md"
    "$KNOWLEDGE_ROOT/decisions/2026-04-12-cloudflare-cdn.md"
)

for doc in "${core_docs[@]}"; do
    check_document_structure "$doc"
done

# 6. 更新README中的统计信息
echo -e "\n${BLUE}6. 更新统计信息...${NC}"

# 更新README_KNOWLEDGE.md中的统计信息
if [ -f "$KNOWLEDGE_ROOT/README_KNOWLEDGE.md" ]; then
    # 备份原文件
    cp "$KNOWLEDGE_ROOT/README_KNOWLEDGE.md" "$KNOWLEDGE_ROOT/README_KNOWLEDGE.md.backup"
    
    # 计算知识覆盖率（简单估算）
    total_possible=50  # 预计总文档数
    coverage=$((total_count * 100 / total_possible))
    
    # 更新统计信息部分
    sed -i "/^### 统计信息/,/^###/ {
        s/总文档数:.*/总文档数: $total_count/
        s/知识覆盖率:.*/知识覆盖率: ${coverage}%/
        s/最近更新:.*/最近更新: $(date +%Y年%m月%d日)/
    }" "$KNOWLEDGE_ROOT/README_KNOWLEDGE.md"
    
    echo -e "${GREEN}✅ README统计信息已更新${NC}"
fi

# 7. Git操作（可选）
echo -e "\n${BLUE}7. Git状态检查...${NC}"

if [ -d "$KNOWLEDGE_ROOT/.git" ]; then
    echo "Git仓库状态:"
    git -C "$KNOWLEDGE_ROOT" status --short
    
    # 检查是否有未提交的更改
    if ! git -C "$KNOWLEDGE_ROOT" diff --quiet; then
        echo -e "${YELLOW}⚠️  有未提交的更改${NC}"
        
        read -p "是否提交更改？ (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git -C "$KNOWLEDGE_ROOT" add .
            git -C "$KNOWLEDGE_ROOT" commit -m "docs: 更新知识库索引和统计信息 [$(date +%Y-%m-%d)]"
            echo -e "${GREEN}✅ 更改已提交${NC}"
            
            read -p "是否推送到远程仓库？ (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git -C "$KNOWLEDGE_ROOT" push
                echo -e "${GREEN}✅ 更改已推送${NC}"
            fi
        fi
    else
        echo -e "${GREEN}✅ 没有未提交的更改${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  当前目录不是Git仓库${NC}"
fi

# 8. 生成同步报告
echo -e "\n${BLUE}8. 生成同步报告...${NC}"

REPORT_FILE="$KNOWLEDGE_ROOT/scripts/knowledge/sync-report-$(date +%Y%m%d).md"
cat > "$REPORT_FILE" << EOF
# 知识库同步报告

## 基本信息
- **同步时间**: $(date)
- **知识库目录**: $KNOWLEDGE_ROOT
- **同步脚本版本**: 1.0

## 检查结果
### 目录完整性
$(if [ ${#missing_dirs[@]} -eq 0 ]; then echo "✅ 所有必要目录都存在"; else echo "⚠️  缺少目录: ${missing_dirs[*]}"; fi)

### 文件完整性
$(if [ ${#missing_files[@]} -eq 0 ]; then echo "✅ 所有必要文件都存在"; else echo "⚠️  缺少文件: ${missing_files[*]}"; fi)

### 文档统计
- **总文档数**: $total_count
- **知识覆盖率**: ${coverage}%

### 文档质量
核心文档质量检查完成，详情见上方输出。

## 执行的操作
1. ✅ 检查目录完整性
2. ✅ 检查文件完整性  
3. ✅ 生成知识库索引
4. ✅ 统计文档信息
5. ✅ 检查文档质量
6. ✅ 更新统计信息
7. ✅ 检查Git状态
8. ✅ 生成同步报告

## 建议和待办事项
$(if [ ${#missing_dirs[@]} -gt 0 ] || [ ${#missing_files[@]} -gt 0 ]; then
    echo "1. 补充缺失的目录和文件"
fi)
1. 定期运行此同步脚本
2. 完善文档质量检查标准
3. 建立文档审核流程
4. 集成到CI/CD流程中

## 下次同步计划
建议每周执行一次完整同步，每日执行快速检查。

---
*报告生成时间: $(date)*
*生成脚本: sync.sh*
EOF

echo -e "${GREEN}✅ 同步报告已生成: $REPORT_FILE${NC}"

echo -e "\n${GREEN}🎉 知识库同步完成！${NC}"
echo -e "总文档数: ${BLUE}$total_count${NC}"
echo -e "知识覆盖率: ${BLUE}${coverage}%${NC}"
echo -e "同步报告: ${BLUE}$REPORT_FILE${NC}"
echo -e "\n下次同步建议: ${YELLOW}每周一次${NC}"