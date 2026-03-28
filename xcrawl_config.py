#!/usr/bin/env python3
"""
XCrawl API 配置和测试脚本
API密钥: xc-iI1VUeF20qTQYNI0magehYoUZPNN1QOQwSegIdXoS8KPt1hp
"""

import requests
import json
import os
from typing import Dict, List, Optional

class XCrawlClient:
    """XCrawl API客户端"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.xcrawl.com/v1"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def search(self, query: str, language: str = "zh", limit: int = 10) -> Dict:
        """网页搜索"""
        url = f"{self.base_url}/search"
        payload = {
            "query": query,
            "language": language,
            "limit": limit
        }
        
        response = requests.post(url, headers=self.headers, json=payload)
        return response.json()
    
    def scrape(self, url: str, output_format: str = "markdown") -> Dict:
        """单网页抓取"""
        url_endpoint = f"{self.base_url}/scrape"
        payload = {
            "url": url,
            "output": output_format
        }
        
        response = requests.post(url_endpoint, headers=self.headers, json=payload)
        return response.json()
    
    def crawl(self, url: str, max_pages: int = 10, depth: int = 2) -> Dict:
        """全站爬取"""
        url_endpoint = f"{self.base_url}/crawl"
        payload = {
            "url": url,
            "max_pages": max_pages,
            "depth": depth
        }
        
        response = requests.post(url_endpoint, headers=self.headers, json=payload)
        return response.json()
    
    def sitemap(self, url: str) -> Dict:
        """网站地图"""
        url_endpoint = f"{self.base_url}/map"
        payload = {
            "url": url
        }
        
        response = requests.post(url_endpoint, headers=self.headers, json=payload)
        return response.json()
    
    def get_credits(self) -> Dict:
        """获取剩余credits"""
        url = f"{self.base_url}/credits"
        response = requests.get(url, headers=self.headers)
        return response.json()

def test_xcrawl_api():
    """测试XCrawl API"""
    api_key = "xc-iI1VUeF20qTQYNI0magehYoUZPNN1QOQwSegIdXoS8KPt1hp"
    
    print("=" * 60)
    print("XCrawl API 测试")
    print("=" * 60)
    
    client = XCrawlClient(api_key)
    
    # 1. 测试剩余credits
    print("\n1. 检查剩余credits...")
    try:
        credits_info = client.get_credits()
        print(f"✅ Credits信息: {json.dumps(credits_info, indent=2, ensure_ascii=False)}")
    except Exception as e:
        print(f"❌ 获取credits失败: {e}")
    
    # 2. 测试搜索功能
    print("\n2. 测试搜索功能...")
    try:
        search_results = client.search("办公空间设计", limit=3)
        print(f"✅ 搜索成功，结果数量: {len(search_results.get('results', []))}")
        
        # 显示前3个结果
        for i, result in enumerate(search_results.get('results', [])[:3]):
            print(f"  {i+1}. {result.get('title', '无标题')}")
            print(f"     链接: {result.get('url', '无链接')}")
            print(f"     摘要: {result.get('snippet', '无摘要')[:100]}...")
    except Exception as e:
        print(f"❌ 搜索失败: {e}")
    
    # 3. 测试单页抓取（刚才的微信文章）
    print("\n3. 测试单页抓取（微信文章）...")
    wechat_url = "https://mp.weixin.qq.com/s/f-3c8C9yaVEPpe9ERGDoSw"
    try:
        scrape_result = client.scrape(wechat_url, "markdown")
        
        if 'content' in scrape_result:
            content = scrape_result['content']
            print(f"✅ 抓取成功！内容长度: {len(content)} 字符")
            
            # 保存到文件
            output_file = "/root/.openclaw/workspace/xcrawl_wechat_article.md"
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ 内容已保存到: {output_file}")
            
            # 显示前500字符
            print(f"\n内容预览:")
            print("-" * 60)
            print(content[:500] + "...")
            print("-" * 60)
            
            # 检查是否有图片
            if 'images' in scrape_result:
                images = scrape_result['images']
                print(f"\n✅ 发现 {len(images)} 张图片")
                for i, img in enumerate(images[:3]):
                    print(f"  图片{i+1}: {img}")
            else:
                print("\n⚠️  未发现图片")
                
        else:
            print(f"❌ 抓取失败: {scrape_result}")
            
    except Exception as e:
        print(f"❌ 抓取失败: {e}")
    
    # 4. 测试网站地图
    print("\n4. 测试网站地图...")
    test_site = "https://www.popoffices.com"
    try:
        sitemap_result = client.sitemap(test_site)
        if 'links' in sitemap_result:
            links = sitemap_result['links']
            print(f"✅ 发现 {len(links)} 个链接")
            print(f"   示例链接: {links[:3]}")
        else:
            print(f"❌ 网站地图失败: {sitemap_result}")
    except Exception as e:
        print(f"❌ 网站地图失败: {e}")
    
    print("\n" + "=" * 60)
    print("测试完成！")
    print("=" * 60)

def create_openclaw_skill():
    """创建OpenClaw XCrawl技能"""
    skill_dir = "/root/.openclaw/workspace/skills/xcrawl"
    os.makedirs(skill_dir, exist_ok=True)
    
    # 创建SKILL.md
    skill_content = """---
name: xcrawl
description: >
  XCrawl网页抓取技能 - 支持搜索、单页抓取、网站地图、全站爬取四大功能。
  提供结构化输出，适合AI直接使用。免费额度1000 credits。
metadata:
  openclaw:
    homepage: https://xcrawl.com
    author: XCrawl Team
    version: 1.0.0
    created: 2026-03-26
    category: web-scraping
    tags: [网页抓取, 数据提取, 搜索, 爬虫, 结构化输出]
---

# XCrawl 网页抓取技能

## 🎯 技能概述

XCrawl是一个强大的网页抓取工具，提供四大核心功能：
1. **搜索** - 任意语言网页关键词搜索
2. **单页抓取** - 支持markdown/网页/链接/json/截图/总结输出
3. **网站地图** - 快速发现网站所有链接
4. **全站爬取** - 批量爬取，可设置深度和页面限制

## 🔑 API配置

### 环境变量
```bash
export XCRAWL_API_KEY="xc-iI1VUeF20qTQYNI0magehYoUZPNN1QOQwSegIdXoS8KPt1hp"
```

### Python客户端
```python
import os
from xcrawl_client import XCrawlClient

api_key = os.getenv("XCRAWL_API_KEY", "xc-iI1VUeF20qTQYNI0magehYoUZPNN1QOQwSegIdXoS8KPt1hp")
client = XCrawlClient(api_key)
```

## 🚀 快速开始

### 1. 网页搜索
```python
# 搜索办公空间设计相关内容
results = client.search("办公空间设计", language="zh", limit=10)
for result in results['results']:
    print(f"标题: {result['title']}")
    print(f"链接: {result['url']}")
    print(f"摘要: {result['snippet'][:100]}...")
```

### 2. 单页抓取
```python
# 抓取微信文章
article = client.scrape("https://mp.weixin.qq.com/s/f-3c8C9yaVEPpe9ERGDoSw", "markdown")
print(f"标题: {article.get('title', '无标题')}")
print(f"内容长度: {len(article.get('content', ''))} 字符")
print(f"图片数量: {len(article.get('images', []))}")
```

### 3. 网站地图
```python
# 获取网站所有链接
sitemap = client.sitemap("https://example.com")
print(f"发现 {len(sitemap['links'])} 个链接")
```

### 4. 全站爬取
```python
# 爬取整个网站
crawl_result = client.crawl("https://example.com", max_pages=50, depth=3)
print(f"爬取完成，共 {len(crawl_result['pages'])} 个页面")
```

## 📊 应用场景

### 自媒体内容创作
1. **素材收集**：自动抓取优质文章和图片
2. **趋势分析**：监控行业热门话题
3. **竞品分析**：跟踪竞争对手内容更新

### 家具生意
1. **市场监控**：抓取佛山广州家具市场信息
2. **产品分析**：收集竞品产品信息和价格
3. **设计灵感**：获取最新办公空间设计案例

### 学术研究
1. **文献收集**：批量抓取相关研究论文
2. **数据提取**：从网页中提取结构化数据
3. **趋势跟踪**：监控领域最新发展

## ⚙️ 配置说明

### API端点
- 搜索: `POST https://api.xcrawl.com/v1/search`
- 单页抓取: `POST https://api.xcrawl.com/v1/scrape`
- 网站地图: `POST https://api.xcrawl.com/v1/map`
- 全站爬取: `POST https://api.xcrawl.com/v1/crawl`
- Credits查询: `GET https://api.xcrawl.com/v1/credits`

### 输出格式
- `markdown` - Markdown格式（默认）
- `html` - 原始HTML
- `text` - 纯文本
- `json` - JSON结构化数据
- `screenshot` - 页面截图

## 💡 使用技巧

### 1. 处理反爬虫
```python
# 使用JavaScript渲染
result = client.scrape(url, output_format="markdown", render_js=True)

# 设置延迟
result = client.scrape(url, delay=2)  # 2秒延迟
```

### 2. 结构化提取
```python
# 自定义提取字段
schema = {
    "title": "string",
    "price": "number",
    "description": "string",
    "images": "array"
}
result = client.scrape(url, output_format="json", schema=schema)
```

### 3. 批量处理
```python
# 批量抓取多个URL
urls = ["https://example.com/page1", "https://example.com/page2"]
for url in urls:
    result = client.scrape(url)
    # 处理结果...
```

## 📈 成本管理

### Credits消耗
- 搜索: 2-10 credits/次
- 单页抓取: 1-5 credits/次
- 网站地图: 5-20 credits/次
- 全站爬取: 根据页面数量

### 免费额度
- 注册赠送: 1000 credits
- 足够测试和初步应用

### 用量监控
```python
# 定期检查剩余credits
credits_info = client.get_credits()
print(f"剩余credits: {credits_info['remaining']}")
print(f"已使用: {credits_info['used']}")
print(f"总额: {credits_info['total']}")
```

## 🔧 故障排除

### 常见问题
1. **API密钥无效**：检查密钥格式和权限
2. **抓取失败**：尝试启用JavaScript渲染
3. **内容为空**：检查网页结构和反爬机制
4. **Credits不足**：监控使用量，合理规划

### 调试方法
```python
# 启用调试模式
import logging
logging.basicConfig(level=logging.DEBUG)

# 检查响应状态
response = client.scrape(url)
if response.get('error'):
    print(f"错误: {response['error']}")
```

## 🎯 最佳实践

### 1. 合理使用Credits
- 优先使用单页抓取
- 批量任务安排在非高峰时段
- 定期监控使用量

### 2. 数据质量
- 验证抓取结果完整性
- 清理和格式化数据
- 建立数据质量检查机制

### 3. 自动化流程
- 定时抓取任务
- 自动数据清洗
- 智能内容推荐

---

**更新记录：2026-03-26**
- 创建XCrawl技能文档
- 集成俊奇的API密钥
- 添加完整使用示例
- 优化应用场景说明
"""
    
    skill_file = os.path.join(skill_dir, "SKILL.md")
    with open(skill_file, 'w', encoding='utf-8') as f:
        f.write(skill_content)
    
    # 创建Python客户端
    client_content = '''"""
XCrawl Python客户端
"""
import requests
import json
from typing import Dict, List, Optional, Any

class XCrawlClient:
    """XCrawl API客户端"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or "xc-iI1VUeF20qTQYNI0magehYoUZPNN1QOQwSegIdXoS8KPt1hp"
        self.base_url = "https://api.xcrawl.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def search(self, query: str, language: str = "zh", limit: int = 10, **kwargs) -> Dict:
        """网页搜索
        
        Args:
            query: 搜索关键词
            language: 语言代码 (zh/en等)
            limit: 结果数量限制
            **kwargs: 其他参数
            
        Returns:
            搜索结果字典
        """
        url = f"{self.base_url}/search"
        payload = {
            "query": query,
            "language": language,
            "limit": limit,
            **kwargs
        }
        
        response = requests.post(url, headers=self.headers, json=payload, timeout=30)
        response.raise_for_status()
        return response.json()
    
    def scrape(self, url: str, output_format: str = "markdown", **kwargs) -> Dict:
        """单网页抓取
        
        Args:
            url: 目标URL
            output_format: 输出格式 (markdown/html/text/json/screenshot)
            **kwargs: 其他参数
            
        Returns:
            抓取结果字典
        """
        endpoint = f"{self.base_url}/scrape"
        payload = {
            "url": url,
            "output": output_format,
            **kwargs
        }
        
        response = requests.post(endpoint, headers=self.headers, json=payload, timeout=60)
        response.raise_for_status()
        return response.json()
    
    def crawl(self, url: str, max_pages: int = 10, depth: int = 2, **kwargs) -> Dict:
        """全站爬取
        
        Args:
            url: 起始URL
            max_pages: 最大页面数
            depth: 爬取深度
            **kwargs: 其他参数
            
        Returns:
            爬取结果字典
        """
        endpoint = f"{self.base_url}/crawl"
        payload = {
            "url": url,
            "max_pages": max_pages,
            "depth": depth,
            **kwargs
        }
        
        response = requests.post(endpoint, headers=self.headers, json=payload, timeout=300)
        response.raise_for_status()
        return response.json()
    
    def sitemap(self, url: str, **kwargs) -> Dict:
        """网站地图
        
        Args:
            url: 目标网站URL
            **kwargs: 其他参数
            
        Returns:
            网站链接列表
        """
        endpoint = f"{self.base_url}/map"
        payload = {
            "url": url,
            **kwargs
        }
        
        response = requests.post(endpoint, headers=self.headers, json=payload, timeout=60)
        response.raise_for_status()
        return response.json()
    
    def get_credits(self) -> Dict:
        """获取剩余credits
        
        Returns:
            credits信息字典
        """
        url = f"{self.base_url}/credits"
        response = requests.get(url, headers=self.headers, timeout=10)
        response.raise_for_status()
        return response.json()
    
    def extract_wechat_article(self, url: str) -> Dict:
        """专门提取微信文章
        
        Args:
            url: 微信文章URL
            
        Returns:
            文章内容字典
        """
        result = self.scrape(url, "markdown