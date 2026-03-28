#!/usr/bin/env python3
"""
测试XCrawl API
API密钥: xc-iI1VUeF20qTQYNI0magehYoUZPNN1QOQwSegIdXoS8KPt1hp
"""

import requests
import json
import os

class XCrawlTester:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.xcrawl.com/v1"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def test_credits(self):
        """测试剩余credits"""
        print("1. 测试剩余credits...")
        try:
            url = f"{self.base_url}/credits"
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            print(f"✅ Credits信息: {json.dumps(data, indent=2, ensure_ascii=False)}")
            return data
        except Exception as e:
            print(f"❌ 获取credits失败: {e}")
            return None
    
    def test_search(self, query="办公空间设计"):
        """测试搜索功能"""
        print(f"\n2. 测试搜索功能: '{query}'...")
        try:
            url = f"{self.base_url}/search"
            payload = {
                "query": query,
                "language": "zh",
                "limit": 3
            }
            response = requests.post(url, headers=self.headers, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            print(f"✅ 搜索成功")
            if 'results' in data:
                print(f"   结果数量: {len(data['results'])}")
                for i, result in enumerate(data['results'][:3]):
                    print(f"   {i+1}. {result.get('title', '无标题')}")
                    print(f"      链接: {result.get('url', '无链接')[:80]}...")
            return data
        except Exception as e:
            print(f"❌ 搜索失败: {e}")
            return None
    
    def test_scrape(self, url):
        """测试单页抓取"""
        print(f"\n3. 测试单页抓取: {url}")
        try:
            endpoint = f"{self.base_url}/scrape"
            payload = {
                "url": url,
                "output": "markdown"
            }
            response = requests.post(endpoint, headers=self.headers, json=payload, timeout=60)
            response.raise_for_status()
            data = response.json()
            
            print(f"✅ 抓取成功")
            
            # 保存到文件
            output_file = "/root/.openclaw/workspace/xcrawl_test_result.md"
            if 'content' in data:
                content = data['content']
                print(f"   内容长度: {len(content)} 字符")
                
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ 内容已保存到: {output_file}")
                
                # 显示前300字符
                print(f"\n   内容预览:")
                print("   " + "-" * 50)
                print(f"   {content[:300]}...")
                print("   " + "-" * 50)
            
            # 检查其他字段
            for key in ['title', 'images', 'metadata']:
                if key in data:
                    if key == 'images' and data[key]:
                        print(f"   发现 {len(data[key])} 张图片")
                        for i, img in enumerate(data[key][:2]):
                            print(f"     图片{i+1}: {img[:80]}...")
                    elif key == 'title':
                        print(f"   标题: {data[key]}")
            
            return data
        except Exception as e:
            print(f"❌ 抓取失败: {e}")
            return None

def main():
    api_key = "xc-iI1VUeF20qTQYNI0magehYoUZPNN1QOQwSegIdXoS8KPt1hp"
    
    print("=" * 60)
    print("XCrawl API 测试")
    print("=" * 60)
    
    tester = XCrawlTester(api_key)
    
    # 1. 测试credits
    credits_info = tester.test_credits()
    
    # 2. 测试搜索
    search_results = tester.test_search("办公空间设计")
    
    # 3. 测试抓取微信文章
    wechat_url = "https://mp.weixin.qq.com/s/f-3c8C9yaVEPpe9ERGDoSw"
    scrape_result = tester.test_scrape(wechat_url)
    
    print("\n" + "=" * 60)
    print("测试完成！")
    
    # 总结
    if credits_info:
        print(f"\n📊 总结:")
        print(f"   API密钥: {api_key[:20]}...")
        if 'remaining' in credits_info:
            print(f"   剩余credits: {credits_info['remaining']}")
        if 'total' in credits_info:
            print(f"   总额度: {credits_info['total']}")
    
    print("=" * 60)

if __name__ == "__main__":
    main()