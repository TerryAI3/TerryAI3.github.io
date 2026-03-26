#!/bin/bash
# Scrapling安装脚本

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Scrapling爬虫框架安装脚本${NC}"
echo -e "${BLUE}========================================${NC}"

# 检查Python版本
echo -e "${BLUE}检查Python版本...${NC}"
PYTHON_VERSION=$(python3 --version 2>/dev/null | cut -d' ' -f2)
if [ -z "$PYTHON_VERSION" ]; then
    echo -e "${RED}错误：未找到Python3${NC}"
    echo -e "${YELLOW}请先安装Python 3.10或更高版本${NC}"
    exit 1
fi

MAJOR_VERSION=$(echo $PYTHON_VERSION | cut -d'.' -f1)
MINOR_VERSION=$(echo $PYTHON_VERSION | cut -d'.' -f2)

if [ $MAJOR_VERSION -lt 3 ] || ([ $MAJOR_VERSION -eq 3 ] && [ $MINOR_VERSION -lt 10 ]); then
    echo -e "${RED}错误：Python版本过低 ($PYTHON_VERSION)${NC}"
    echo -e "${YELLOW}Scrapling需要Python 3.10或更高版本${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python版本符合要求: $PYTHON_VERSION${NC}"

# 检查pip
echo -e "${BLUE}检查pip...${NC}"
if ! command -v pip3 &> /dev/null; then
    echo -e "${YELLOW}未找到pip3，尝试安装...${NC}"
    apt-get update && apt-get install -y python3-pip || {
        echo -e "${RED}pip安装失败${NC}"
        exit 1
    }
fi

echo -e "${GREEN}✅ pip已安装${NC}"

# 安装Scrapling
echo -e "${BLUE}安装Scrapling...${NC}"
echo -e "${YELLOW}这可能需要几分钟，请耐心等待...${NC}"

# 升级pip
pip3 install --upgrade pip

# 安装Scrapling完整版
pip3 install "scrapling[all]" || {
    echo -e "${RED}Scrapling安装失败${NC}"
    echo -e "${YELLOW}尝试基础安装...${NC}"
    pip3 install scrapling
}

echo -e "${GREEN}✅ Scrapling安装完成${NC}"

# 安装浏览器依赖
echo -e "${BLUE}安装浏览器依赖...${NC}"
echo -e "${YELLOW}这可能需要较长时间，请耐心等待...${NC}"

if command -v scrapling &> /dev/null; then
    scrapling install || {
        echo -e "${YELLOW}浏览器依赖安装失败，尝试手动安装...${NC}"
        echo -e "${YELLOW}请参考: https://scrapling.readthedocs.io/en/latest/installation.html${NC}"
    }
else
    echo -e "${YELLOW}未找到scrapling命令，跳过浏览器依赖安装${NC}"
fi

# 验证安装
echo -e "${BLUE}验证安装...${NC}"
cat > /tmp/test_scrapling.py << 'EOF'
try:
    from scrapling.fetchers import Fetcher
    print("✅ Scrapling导入成功")
    
    # 简单测试
    import sys
    print(f"✅ Python版本: {sys.version}")
    
except ImportError as e:
    print(f"❌ 导入失败: {e}")
    sys.exit(1)
except Exception as e:
    print(f"⚠️  警告: {e}")
EOF

python3 /tmp/test_scrapling.py && echo -e "${GREEN}✅ Scrapling安装验证通过${NC}"

# 创建示例目录
echo -e "${BLUE}创建示例文件...${NC}"
mkdir -p /root/.openclaw/workspace/skills/scrapling/examples

# 基础示例
cat > /root/.openclaw/workspace/skills/scrapling/examples/basic_scraping.py << 'EOF'
#!/usr/bin/env python3
"""
Scrapling基础爬取示例
"""

from scrapling.fetchers import Fetcher

def scrape_quotes():
    """爬取名言网站"""
    print("开始爬取名言网站...")
    
    try:
        # 发送HTTP请求
        page = Fetcher.get('https://quotes.toscrape.com/')
        
        # 使用CSS选择器提取数据
        quotes = page.css('.quote .text::text').getall()
        authors = page.css('.quote .author::text').getall()
        
        print(f"成功爬取 {len(quotes)} 条名言")
        
        # 打印结果
        for i, (quote, author) in enumerate(zip(quotes, authors), 1):
            print(f"{i}. {quote} —— {author}")
            
        return quotes, authors
        
    except Exception as e:
        print(f"爬取失败: {e}")
        return [], []

if __name__ == "__main__":
    scrape_quotes()
EOF

# 隐身模式示例
cat > /root/.openclaw/workspace/skills/scrapling/examples/stealth_scraping.py << 'EOF'
#!/usr/bin/env python3
"""
Scrapling隐身爬取示例
绕过Cloudflare等反爬虫机制
"""

from scrapling.fetchers import StealthyFetcher

def scrape_protected_site():
    """爬取受保护的网站"""
    print("开始爬取受保护网站（使用隐身模式）...")
    
    try:
        # 使用隐身模式，绕过Cloudflare
        page = StealthyFetcher.fetch(
            'https://nopecha.com/demo/cloudflare',
            solve_cloudflare=True,
            headless=True
        )
        
        # 提取数据
        data = page.css('#padded_content a').getall()
        
        print(f"成功爬取 {len(data)} 个链接")
        
        for i, link in enumerate(data[:10], 1):  # 只显示前10个
            print(f"{i}. {link}")
            
        return data
        
    except Exception as e:
        print(f"爬取失败: {e}")
        return []

if __name__ == "__main__":
    scrape_protected_site()
EOF

# 完整爬虫示例
cat > /root/.openclaw/workspace/skills/scrapling/examples/full_spider.py << 'EOF'
#!/usr/bin/env python3
"""
Scrapling完整爬虫示例
支持并发爬取、翻页、数据导出
"""

from scrapling.spiders import Spider, Response
import json

class QuotesSpider(Spider):
    """名言爬虫"""
    name = "quotes"
    start_urls = ["https://quotes.toscrape.com/"]
    concurrent_requests = 5  # 并发数
    
    async def parse(self, response: Response):
        """解析页面"""
        quotes = []
        
        for quote in response.css('.quote'):
            item = {
                "text": quote.css('.text::text').get(),
                "author": quote.css('.author::text').get(),
                "tags": quote.css('.tag::text').getall(),
                "url": response.url
            }
            quotes.append(item)
            yield item
        
        print(f"从 {response.url} 爬取了 {len(quotes)} 条名言")
        
        # 翻页
        next_page = response.css('.next a')
        if next_page:
            next_url = next_page[0].attrib['href']
            yield response.follow(next_url)

def run_spider():
    """运行爬虫"""
    print("启动名言爬虫...")
    
    try:
        # 创建并运行爬虫
        spider = QuotesSpider()
        result = spider.start()
        
        print(f"爬虫完成！总共爬取 {len(result.items)} 条名言")
        
        # 保存到JSON文件
        with open('quotes.json', 'w', encoding='utf-8') as f:
            json.dump(result.items, f, ensure_ascii=False, indent=2)
        
        print("数据已保存到 quotes.json")
        
        # 显示统计信息
        stats = spider.stats
        print(f"\n统计信息:")
        print(f"  总请求数: {stats.get('downloader/request_count', 0)}")
        print(f"  成功响应: {stats.get('downloader/response_status_count/200', 0)}")
        print(f"  失败数: {stats.get('downloader/exception_count', 0)}")
        
        return result.items
        
    except Exception as e:
        print(f"爬虫运行失败: {e}")
        return []

if __name__ == "__main__":
    run_spider()
EOF

echo -e "${GREEN}✅ 示例文件创建完成${NC}"

# 创建配置目录
echo -e "${BLUE}创建配置文件...${NC}"
mkdir -p /root/.openclaw/workspace/skills/scrapling/config

# 代理配置示例
cat > /root/.openclaw/workspace/skills/scrapling/config/proxies.json << 'EOF'
{
  "proxy_config": {
    "rotation_strategy": "cyclic",
    "proxies": [
      "http://proxy1.example.com:8080",
      "http://proxy2.example.com:8080",
      "http://proxy3.example.com:8080"
    ],
    "retry_times": 3,
    "retry_delay": 5
  },
  "user_agents": [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
  ]
}
EOF

# 使用说明
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}安装完成！${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${YELLOW}使用说明:${NC}"
echo ""
echo -e "${BLUE}1. 测试安装${NC}"
echo "   python3 -c \"from scrapling.fetchers import Fetcher; print('Scrapling安装成功！')\""
echo ""
echo -e "${BLUE}2. 运行示例${NC}"
echo "   cd /root/.openclaw/workspace/skills/scrapling/examples"
echo "   python3 basic_scraping.py"
echo "   python3 stealth_scraping.py"
echo "   python3 full_spider.py"
echo ""
echo -e "${BLUE}3. 命令行工具${NC}"
echo "   # 启动交互式Shell"
echo "   scrapling shell"
echo ""
echo "   # 直接提取网页内容"
echo "   scrapling extract get 'https://example.com' output.html"
echo ""
echo -e "${BLUE}4. MCP服务器${NC}"
echo "   # 启动MCP服务器（用于AI集成）"
echo "   scrapling mcp-server --port 8000"
echo ""
echo -e "${BLUE}5. 文档和帮助${NC}"
echo "   # 查看帮助"
echo "   scrapling --help"
echo ""
echo "   # 在线文档"
echo "   https://scrapling.readthedocs.io"
echo ""
echo -e "${BLUE}6. 故障排除${NC}"
echo "   # 重新安装浏览器依赖"
echo "   scrapling install --force"
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Scrapling已成功安装！${NC}"
echo -e "${BLUE}现在你可以开始使用这个强大的爬虫框架了！${NC}"