---
name: scrapling
description: >
  Scrapling - 自适应网页爬虫框架，支持从单页抓取到全站级并发爬取，内置浏览器指纹伪装，
  可自动处理Cloudflare Turnstile等常见验证。提供MCP服务器集成，适合AI辅助的网页数据提取。
metadata:
  openclaw:
    homepage: https://github.com/D4Vinci/Scrapling
    author: Karim Shoair (D4Vinci)
    version: 1.0.0
    created: 2026-03-26
    category: web-scraping
    tags: [爬虫, 网页抓取, 数据提取, 反爬虫绕过, Cloudflare, MCP, 自动化]
---

# Scrapling 爬虫技能

## 🎯 技能概述

Scrapling是一个自适应的网页爬虫框架，支持从单页抓取到全站级并发爬取。内置浏览器指纹伪装，可自动处理Cloudflare Turnstile等常见验证。提供MCP服务器集成，适合AI辅助的网页数据提取。

## ✨ 核心特性

### 🛡️ 反爬虫绕过
- **Cloudflare Turnstile/Interstitial**：自动绕过
- **浏览器指纹伪装**：TLS指纹、HTTP头、浏览器特征
- **智能会话管理**：多会话类型支持
- **代理轮换**：内置代理轮换策略

### ⚡ 高性能爬取
- **并发爬取**：可配置的并发请求限制
- **流式处理**：实时流式处理爬取结果
- **内存优化**：优化的数据结构和懒加载
- **快速JSON序列化**：比标准库快10倍

### 🔄 自适应解析
- **智能元素追踪**：网站结构变化后自动重新定位元素
- **多种选择器**：CSS选择器、XPath、文本搜索、正则搜索
- **相似元素查找**：自动定位相似元素
- **自动选择器生成**：为任何元素生成健壮的CSS/XPath选择器

### 🤖 AI集成
- **内置MCP服务器**：用于AI辅助的网页爬取和数据提取
- **减少token使用**：先提取目标内容再传递给AI
- **交互式Shell**：内置IPython Shell进行快速开发

## 🚀 快速开始

### 安装Scrapling
```bash
# 基础安装（仅解析引擎）
pip install scrapling

# 完整安装（包含所有功能）
pip install "scrapling[all]"

# 安装浏览器依赖
scrapling install

# 或使用Docker
docker pull pyd4vinci/scrapling
```

### 基本使用示例

#### 1. 简单HTTP请求
```python
from scrapling.fetchers import Fetcher

page = Fetcher.get('https://quotes.toscrape.com/')
quotes = page.css('.quote .text::text').getall()
print(f"找到 {len(quotes)} 条引用")
```

#### 2. 隐身模式（绕过Cloudflare）
```python
from scrapling.fetchers import StealthyFetcher

page = StealthyFetcher.fetch('https://nopecha.com/demo/cloudflare', solve_cloudflare=True)
data = page.css('#padded_content a').getall()
```

#### 3. 完整爬虫示例
```python
from scrapling.spiders import Spider, Response

class QuotesSpider(Spider):
    name = "quotes"
    start_urls = ["https://quotes.toscrape.com/"]
    concurrent_requests = 10

    async def parse(self, response: Response):
        for quote in response.css('.quote'):
            yield {
                "text": quote.css('.text::text').get(),
                "author": quote.css('.author::text').get(),
            }

        next_page = response.css('.next a')
        if next_page:
            yield response.follow(next_page[0].attrib['href'])

# 运行爬虫
result = QuotesSpider().start()
print(f"爬取了 {len(result.items)} 条引用")
result.items.to_json("quotes.json")
```

## 📋 使用场景

### 场景1：单页数据提取
```python
from scrapling.fetchers import Fetcher

def extract_product_info(url):
    """提取产品信息"""
    page = Fetcher.get(url)
    
    return {
        "title": page.css('h1::text').get(),
        "price": page.css('.price::text').get(),
        "description": page.css('.description::text').get(),
        "images": page.css('.product-image img::attr(src)').getall()
    }
```

### 场景2：绕过反爬虫网站
```python
from scrapling.fetchers import StealthySession

def scrape_protected_site(url):
    """爬取受保护的网站"""
    with StealthySession(headless=True, solve_cloudflare=True) as session:
        page = session.fetch(url)
        
        # 执行JavaScript后提取数据
        data = page.css('.dynamic-content::text').getall()
        return data
```

### 场景3：并发爬取多个网站
```python
from scrapling.spiders import Spider, Response
import asyncio

class MultiSiteSpider(Spider):
    name = "multi_site"
    start_urls = [
        "https://site1.com/products",
        "https://site2.com/items",
        "https://site3.com/goods"
    ]
    
    async def parse(self, response: Response):
        # 根据域名使用不同的解析逻辑
        if "site1.com" in response.url:
            return await self.parse_site1(response)
        elif "site2.com" in response.url:
            return await self.parse_site2(response)
        else:
            return await self.parse_site3(response)
```

## 🔧 高级功能

### 1. MCP服务器集成
```bash
# 启动MCP服务器
scrapling mcp-server

# 在OpenClaw中配置MCP服务器
# 编辑OpenClaw配置，添加Scrapling MCP服务器
```

### 2. 命令行工具
```bash
# 启动交互式Shell
scrapling shell

# 直接提取网页内容
scrapling extract get 'https://example.com' content.md
scrapling extract stealthy-fetch 'https://protected.com' data.html --solve-cloudflare
```

### 3. 暂停和恢复
```python
# 启动爬虫并设置检查点目录
spider = QuotesSpider(crawldir="./crawl_data")
spider.start()

# 按Ctrl+C暂停，进度自动保存
# 重新启动时从上次停止的地方继续
spider = QuotesSpider(crawldir="./crawl_data")
spider.start()  # 从检查点恢复
```

### 4. 多会话管理
```python
from scrapling.spiders import Spider, Response
from scrapling.fetchers import FetcherSession, AsyncStealthySession

class SmartSpider(Spider):
    name = "smart"
    start_urls = ["https://example.com/"]
    
    def configure_sessions(self, manager):
        # 添加快速会话（HTTP请求）
        manager.add("fast", FetcherSession(impersonate="chrome"))
        # 添加隐身会话（浏览器自动化）
        manager.add("stealth", AsyncStealthySession(headless=True), lazy=True)
    
    async def parse(self, response: Response):
        for link in response.css('a::attr(href)').getall():
            # 受保护的页面使用隐身会话
            if "protected" in link or "login" in link:
                yield Request(link, sid="stealth")
            else:
                yield Request(link, sid="fast")
```

## ⚙️ 配置选项

### 会话配置
```python
# HTTP会话配置
session = FetcherSession(
    impersonate='chrome',      # 浏览器伪装
    stealthy_headers=True,     # 隐身头
    http3=True,               # 启用HTTP/3
    proxy='http://proxy:port' # 代理设置
)

# 隐身会话配置
stealth_session = StealthySession(
    headless=True,            # 无头模式
    solve_cloudflare=True,    # 解决Cloudflare
    max_pages=5,             # 最大页面数
    google_search=False       # 禁用Google搜索
)

# 动态会话配置（完整浏览器）
dynamic_session = DynamicSession(
    headless=False,           # 显示浏览器
    network_idle=True,        # 等待网络空闲
    disable_resources=False   # 加载所有资源
)
```

### 爬虫配置
```python
class CustomSpider(Spider):
    name = "custom"
    
    # 并发设置
    concurrent_requests = 20
    concurrent_domains = 5
    download_delay = 1.0
    
    # 请求设置
    default_headers = {'User-Agent': 'Custom Agent'}
    respect_robots_txt = True
    
    # 代理设置
    proxy_rotation = 'cyclic'  # cyclic, random, custom
    proxies = ['http://proxy1:port', 'http://proxy2:port']
    
    # 检查点设置
    checkpoint_interval = 100  # 每100个请求保存一次
```

## 🛠️ 工具脚本

### 安装脚本
```bash
#!/bin/bash
# scripts/install.sh

echo "安装Scrapling爬虫框架..."
pip install "scrapling[all]"

echo "安装浏览器依赖..."
scrapling install

echo "验证安装..."
python -c "from scrapling.fetchers import Fetcher; print('Scrapling安装成功！')"
```

### 测试脚本
```bash
#!/bin/bash
# scripts/test_scraping.sh

URL="$1"
SELECTOR="$2"

if [ -z "$URL" ] || [ -z "$SELECTOR" ]; then
    echo "使用方法: $0 <URL> <CSS选择器>"
    echo "示例: $0 'https://example.com' '.title::text'"
    exit 1
fi

cat > /tmp/test_scrape.py << EOF
from scrapling.fetchers import Fetcher

try:
    page = Fetcher.get('$URL')
    results = page.css('$SELECTOR').getall()
    
    print(f"成功爬取: {len(results)} 个结果")
    for i, result in enumerate(results, 1):
        print(f"{i}. {result}")
        
except Exception as e:
    print(f"爬取失败: {e}")
EOF

python /tmp/test_scrape.py
```

### MCP服务器启动脚本
```bash
#!/bin/bash
# scripts/start_mcp.sh

echo "启动Scrapling MCP服务器..."
echo "MCP服务器将在端口 8000 启动"
echo "在OpenClaw配置中添加:"
echo "  - mcp:"
echo "      command: python -m scrapling.mcp.server"
echo "      args: []"

scrapling mcp-server --port 8000
```

## 📊 性能优化

### 1. 并发优化
```python
# 根据目标网站调整并发数
class OptimizedSpider(Spider):
    concurrent_requests = 50    # 总并发请求数
    concurrent_domains = 10     # 每个域名的并发数
    download_delay = 0.5        # 下载延迟（秒）
    
    # 域名特定的延迟
    domain_delays = {
        'example.com': 2.0,
        'api.example.com': 0.1
    }
```

### 2. 内存优化
```python
# 使用流式处理避免内存溢出
spider = MySpider()
async for item in spider.stream():
    # 立即处理每个项目
    process_item(item)
    # 不需要保存所有项目到内存
```

### 3. 网络优化
```python
# 使用HTTP/3提高速度
session = FetcherSession(http3=True)

# 启用连接池
session = FetcherSession(
    pool_connections=100,
    pool_maxsize=100,
    max_retries=3
)
```

## 🚨 注意事项

### 法律和道德
1. **遵守robots.txt**：尊重网站的爬取规则
2. **遵守服务条款**：不要违反网站的使用条款
3. **数据隐私**：不要爬取个人隐私信息
4. **速率限制**：合理控制爬取频率，避免对网站造成负担

### 技术限制
1. **JavaScript渲染**：动态内容需要使用DynamicFetcher
2. **验证码**：复杂验证码可能需要人工干预
3. **IP封锁**：使用代理轮换避免IP被封
4. **资源消耗**：浏览器模式消耗较多内存

### 最佳实践
1. **错误处理**：实现完善的错误处理和重试机制
2. **日志记录**：记录爬取过程和错误信息
3. **数据验证**：验证爬取数据的完整性和准确性
4. **定期维护**：定期更新选择器和爬取逻辑

## 🔍 故障排除

### 常见问题

#### 1. 安装失败
```bash
# 检查Python版本（需要3.10+）
python --version

# 清理缓存重试
pip cache purge
pip install "scrapling[all]" --no-cache-dir
```

#### 2. 浏览器依赖问题
```bash
# 强制重新安装浏览器
scrapling install --force

# 检查系统依赖
apt-get install -y wget curl chromium chromium-driver
```

#### 3. Cloudflare绕过失败
```python
# 尝试不同的配置
session = StealthySession(
    headless=True,
    solve_cloudflare=True,
    google_search=False,  # 某些网站需要禁用
    fingerprint_spoofing='aggressive'
)
```

#### 4. 内存泄漏
```python
# 使用上下文管理器确保资源释放
with StealthySession() as session:
    # 爬取代码
    pass

# 或手动清理
session.close()
```

## 📈 监控和日志

### 日志配置
```python
import logging

# 配置Scrapling日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scrapling.log'),
        logging.StreamHandler()
    ]
)

# 爬虫进度监控
spider = MySpider()
spider.start()

# 获取统计信息
stats = spider.stats
print(f"总请求数: {stats['downloader/request_count']}")
print(f"成功数: {stats['downloader/response_status_count/200']}")
print(f"失败数: {stats['downloader/exception_count']}")
```

### 性能监控
```python
import time
from memory_profiler import profile

@profile
def run_spider():
    start_time = time.time()
    
    spider = MySpider()
    result = spider.start()
    
    end_time = time.time()
    
    print(f"爬取时间: {end_time - start_time:.2f}秒")
    print(f"爬取数量: {len(result.items)}")
    print(f"平均速度: {len(result.items)/(end_time - start_time):.2f} 条/秒")
    
    return result
```

## 🔗 相关资源

### 官方资源
- **GitHub**: https://github.com/D4Vinci/Scrapling
- **文档**: https://scrapling.readthedocs.io
- **PyPI**: https://pypi.org/project/scrapling/
- **Docker Hub**: https://hub.docker.com/r/pyd4vinci/scrapling

### 社区支持
- **Discord**: https://discord.gg/EMgGbDceNQ
- **Twitter**: https://x.com/Scrapling_dev
- **问题追踪**: GitHub Issues

### 学习资源
- **教程视频**: https://www.youtube.com/watch?v=qyFk3ZNwOxE
- **博客文章**: The Web Scraping Club的完整评测
- **示例代码**: GitHub仓库中的examples目录

## 🎯 使用建议

### 对于初学者
1. 从简单的HTTP请求开始
2. 使用命令行工具快速测试
3. 逐步学习高级功能
4. 参考官方文档和示例

### 对于进阶用户
1. 利用MCP服务器与AI集成
2. 实现自定义的代理轮换策略
3. 优化爬虫性能配置
4. 构建分布式爬虫系统

### 对于生产环境
1. 实现完善的错误处理和监控
2. 使用Docker容器化部署
3. 配置自动化的数据管道
4. 定期维护和更新爬取逻辑

---

**技能版本：1.0.0**
**创建时间：2026年3月26日**
**基于Scrapling最新版本，功能完整且经过验证**