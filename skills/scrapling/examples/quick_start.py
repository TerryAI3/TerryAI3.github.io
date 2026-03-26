#!/usr/bin/env python3
"""
Scrapling快速入门示例
展示最常见的爬虫使用场景
"""

import json
from typing import List, Dict, Any
from scrapling.fetchers import Fetcher, StealthyFetcher, DynamicFetcher
from scrapling.spiders import Spider, Response


def example1_simple_scraping():
    """示例1: 简单网页爬取"""
    print("=" * 50)
    print("示例1: 简单网页爬取")
    print("=" * 50)
    
    # 使用Fetcher进行简单的HTTP请求
    page = Fetcher.get('https://quotes.toscrape.com/')
    
    # 提取数据
    quotes = page.css('.quote .text::text').getall()
    authors = page.css('.quote .author::text').getall()
    tags = [quote.css('.tag::text').getall() for quote in page.css('.quote')]
    
    print(f"爬取到 {len(quotes)} 条名言:")
    for i, (quote, author, tag_list) in enumerate(zip(quotes, authors, tags), 1):
        print(f"{i}. {quote}")
        print(f"   作者: {author}")
        print(f"   标签: {', '.join(tag_list)}")
        print()
    
    return quotes, authors, tags


def example2_stealth_scraping():
    """示例2: 隐身模式爬取（绕过反爬虫）"""
    print("=" * 50)
    print("示例2: 隐身模式爬取")
    print("=" * 50)
    
    try:
        # 使用StealthyFetcher绕过Cloudflare等反爬虫
        page = StealthyFetcher.fetch(
            'https://httpbin.org/headers',
            headless=True,
            solve_cloudflare=False  # 这个网站不需要Cloudflare
        )
        
        # 提取返回的headers
        headers_text = page.css('pre::text').get()
        if headers_text:
            headers = json.loads(headers_text)
            print("成功获取headers:")
            print(f"  User-Agent: {headers.get('headers', {}).get('User-Agent', 'N/A')}")
            print(f"  请求IP: {headers.get('origin', 'N/A')}")
        
        return headers_text
        
    except Exception as e:
        print(f"隐身爬取失败: {e}")
        return None


def example3_dynamic_scraping():
    """示例3: 动态网页爬取（执行JavaScript）"""
    print("=" * 50)
    print("示例3: 动态网页爬取")
    print("=" * 50)
    
    try:
        # 使用DynamicFetcher执行JavaScript
        page = DynamicFetcher.fetch(
            'https://httpbin.org/html',
            headless=True,
            network_idle=True  # 等待网络空闲
        )
        
        # 提取动态加载的内容
        title = page.css('h1::text').get()
        print(f"页面标题: {title}")
        
        # 获取所有链接
        links = page.css('a::attr(href)').getall()
        print(f"找到 {len(links)} 个链接")
        
        return title, links
        
    except Exception as e:
        print(f"动态爬取失败: {e}")
        return None, []


def example4_data_extraction():
    """示例4: 结构化数据提取"""
    print("=" * 50)
    print("示例4: 结构化数据提取")
    print("=" * 50)
    
    # 模拟一个产品页面
    html_content = """
    <html>
    <body>
        <div class="product" data-id="1">
            <h2 class="name">笔记本电脑</h2>
            <p class="price">¥5,999</p>
            <p class="description">高性能游戏笔记本</p>
            <div class="specs">
                <span>CPU: i7</span>
                <span>RAM: 16GB</span>
                <span>SSD: 512GB</span>
            </div>
        </div>
        <div class="product" data-id="2">
            <h2 class="name">智能手机</h2>
            <p class="price">¥3,299</p>
            <p class="description">旗舰拍照手机</p>
            <div class="specs">
                <span>摄像头: 108MP</span>
                <span>电池: 5000mAh</span>
                <span>存储: 256GB</span>
            </div>
        </div>
    </body>
    </html>
    """
    
    # 创建Selector对象
    from scrapling.parser import Selector
    page = Selector(html_content)
    
    # 提取结构化数据
    products = []
    for product in page.css('.product'):
        product_data = {
            'id': product.attrib.get('data-id'),
            'name': product.css('.name::text').get(),
            'price': product.css('.price::text').get(),
            'description': product.css('.description::text').get(),
            'specs': [spec.strip() for spec in product.css('.specs span::text').getall()]
        }
        products.append(product_data)
    
    print(f"提取到 {len(products)} 个产品:")
    for product in products:
        print(f"  {product['name']} - {product['price']}")
        print(f"    描述: {product['description']}")
        print(f"    规格: {', '.join(product['specs'])}")
        print()
    
    return products


def example5_batch_scraping():
    """示例5: 批量爬取多个页面"""
    print("=" * 50)
    print("示例5: 批量爬取")
    print("=" * 50)
    
    urls = [
        'https://httpbin.org/status/200',
        'https://httpbin.org/status/404',
        'https://httpbin.org/status/500',
        'https://httpbin.org/html',
        'https://httpbin.org/json'
    ]
    
    results = []
    
    for url in urls:
        try:
            page = Fetcher.get(url, timeout=10)
            status = page.status_code
            
            result = {
                'url': url,
                'status': status,
                'success': 200 <= status < 400,
                'content_type': page.headers.get('content-type', 'unknown'),
                'size': len(page.content) if hasattr(page, 'content') else 0
            }
            
            results.append(result)
            
            print(f"  {url}: HTTP {status} ({'成功' if result['success'] else '失败'})")
            
        except Exception as e:
            print(f"  {url}: 错误 - {type(e).__name__}")
            results.append({
                'url': url,
                'error': str(e),
                'success': False
            })
    
    success_count = sum(1 for r in results if r.get('success'))
    print(f"\n批量爬取完成: {success_count}/{len(urls)} 成功")
    
    return results


class ExampleSpider(Spider):
    """示例6: 完整爬虫示例"""
    name = "example_spider"
    start_urls = ["https://quotes.toscrape.com/page/1/"]
    concurrent_requests = 3
    
    async def parse(self, response: Response):
        """解析页面"""
        page_number = response.url.split('/')[-2] if response.url.split('/')[-1] == '' else response.url.split('/')[-1]
        
        print(f"正在爬取第 {page_number} 页...")
        
        quotes = []
        for quote in response.css('.quote'):
            item = {
                'text': quote.css('.text::text').get(),
                'author': quote.css('.author::text').get(),
                'tags': quote.css('.tag::text').getall(),
                'page': page_number,
                'url': response.url
            }
            quotes.append(item)
            yield item
        
        print(f"  从第 {page_number} 页爬取 {len(quotes)} 条名言")
        
        # 翻页逻辑
        next_page = response.css('.next a')
        if next_page:
            next_url = next_page[0].attrib['href']
            yield response.follow(next_url)


def example6_full_spider():
    """示例6: 运行完整爬虫"""
    print("=" * 50)
    print("示例6: 完整爬虫")
    print("=" * 50)
    
    try:
        # 创建并运行爬虫
        spider = ExampleSpider()
        result = spider.start()
        
        print(f"爬虫完成！总共爬取 {len(result.items)} 条名言")
        
        # 保存结果
        with open('quotes_results.json', 'w', encoding='utf-8') as f:
            json.dump(result.items, f, ensure_ascii=False, indent=2)
        
        print("结果已保存到 quotes_results.json")
        
        # 显示统计信息
        stats = spider.stats
        print(f"\n统计信息:")
        print(f"  总请求数: {stats.get('downloader/request_count', 0)}")
        print(f"  成功响应: {stats.get('downloader/response_status_count/200', 0)}")
        print(f"  失败数: {stats.get('downloader/exception_count', 0)}")
        print(f"  爬取页面: {stats.get('page_count', 0)}")
        
        return result.items
        
    except Exception as e:
        print(f"爬虫运行失败: {e}")
        return []


def main():
    """主函数：运行所有示例"""
    print("🚀 Scrapling快速入门示例")
    print("=" * 60)
    
    all_results = {}
    
    try:
        # 运行示例1
        quotes, authors, tags = example1_simple_scraping()
        all_results['example1'] = {
            'quotes_count': len(quotes),
            'authors': authors[:3]  # 只保存前3个作者
        }
        
        # 运行示例2
        headers = example2_stealth_scraping()
        all_results['example2'] = {'headers_extracted': bool(headers)}
        
        # 运行示例3
        title, links = example3_dynamic_scraping()
        all_results['example3'] = {
            'title': title,
            'links_count': len(links)
        }
        
        # 运行示例4
        products = example4_data_extraction()
        all_results['example4'] = {
            'products_count': len(products),
            'products': products
        }
        
        # 运行示例5
        batch_results = example5_batch_scraping()
        all_results['example5'] = {
            'total_urls': len(batch_results),
            'success_count': sum(1 for r in batch_results if r.get('success'))
        }
        
        # 运行示例6
        spider_results = example6_full_spider()
        all_results['example6'] = {
            'quotes_count': len(spider_results),
            'sample_quote': spider_results[0] if spider_results else None
        }
        
        # 保存所有结果
        with open('all_examples_results.json', 'w', encoding='utf-8') as f:
            json.dump(all_results, f, ensure_ascii=False, indent=2)
        
        print("\n" + "=" * 60)
        print("✅ 所有示例运行完成！")
        print("=" * 60)
        
        # 总结报告
        print("\n📊 运行总结:")
        print(f"  示例1: 爬取 {all_results['example1']['quotes_count']} 条名言")
        print(f"  示例2: {'成功' if all_results['example2']['headers_extracted'] else '失败'}")
        print(f"  示例3: 提取标题 '{all_results['example3']['title']}'")
        print(f"  示例4: 解析 {all_results['example4']['products_count']} 个产品")
        print(f"  示例5: {all_results['example5']['success_count']}/{all_results['example5']['total_urls']} 成功")
        print(f"  示例6: 爬虫获取 {all_results['example6']['quotes_count']} 条数据")
        
        print("\n📁 生成文件:")
        print("  - quotes_results.json: 爬虫完整结果")
        print("  - all_examples_results.json: 所有示例汇总结果")
        
        print("\n🎯 下一步:")
        print("  1. 查看生成的文件了解数据结构")
        print("  2. 修改示例代码适应你的需求")
        print("  3. 参考文档学习高级功能: https://scrapling.readthedocs.io")
        print("  4. 尝试爬取你自己的目标网站")
        
    except KeyboardInterrupt:
        print("\n\n⏹️  用户中断")
    except Exception as e:
        print(f"\n❌ 运行出错: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()