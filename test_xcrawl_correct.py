#!/usr/bin/env python3
"""
测试XCrawl API - 使用正确的端点
API密钥: xc-iI1VUeF20qTQYNI0magehYoUZPNN1QOQwSegIdXoS8KPt1hp
"""

import requests
import json
import os

class XCrawlTester:
    def __init__(self):
        # 从配置文件读取API密钥
        config_path = os.path.expanduser("~/.xcrawl/config.json")
        with open(config_path, 'r') as f:
            config = json.load(f)
            self.api_key = config["XCRAWL_API_KEY"]
        
        self.base_url = "https://run.xcrawl.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def test_scrape(self, url, output_format="markdown"):
        """测试单页抓取"""
        print(f"测试单页抓取: {url}")
        print(f"输出格式: {output_format}")
        
        try:
            endpoint = f"{self.base_url}/scrape"
            payload = {
                "url": url,
                "mode": "sync",
                "output": {
                    "formats": [output_format]
                }
            }
            
            print(f"发送请求到: {endpoint}")
            response = requests.post(endpoint, headers=self.headers, json=payload, timeout=60)
            print(f"响应状态码: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ 抓取成功！")
                
                # 保存结果
                output_file = f"/root/.openclaw/workspace/xcrawl_result_{output_format}.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                print(f"✅ 结果已保存到: {output_file}")
                
                # 分析结果
                self.analyze_result(data, output_format)
                return data
            else:
                print(f"❌ 请求失败: {response.status_code}")
                print(f"响应内容: {response.text[:500]}")
                return None
                
        except Exception as e:
            print(f"❌ 抓取失败: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def analyze_result(self, data, output_format):
        """分析抓取结果"""
        print("\n📊 结果分析:")
        print("-" * 50)
        
        # 检查基本字段
        if 'scrape_id' in data:
            print(f"Scrape ID: {data['scrape_id']}")
        
        if 'status' in data:
            print(f"状态: {data['status']}")
        
        # 检查内容
        if 'content' in data:
            content = data['content']
            if output_format == "markdown" and content:
                print(f"Markdown内容长度: {len(content)} 字符")
                print(f"\n内容预览 (前300字符):")
                print("-" * 40)
                print(content[:300] + "...")
                print("-" * 40)
                
                # 保存markdown内容
                md_file = "/root/.openclaw/workspace/xcrawl_content.md"
                with open(md_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Markdown内容已保存到: {md_file}")
        
        # 检查其他字段
        for key in ['title', 'url', 'images', 'metadata', 'links']:
            if key in data and data[key]:
                if key == 'images':
                    print(f"发现 {len(data[key])} 张图片")
                    for i, img in enumerate(data[key][:3]):
                        print(f"  图片{i+1}: {img[:80]}...")
                elif key == 'links':
                    print(f"发现 {len(data[key])} 个链接")
                else:
                    print(f"{key}: {data[key]}")
        
        print("-" * 50)

def main():
    print("=" * 60)
    print("XCrawl API 测试 - 使用正确端点")
    print("=" * 60)
    
    # 创建测试器
    tester = XCrawlTester()
    print(f"API密钥: {tester.api_key[:20]}...")
    
    # 测试1: 抓取微信文章
    print("\n" + "=" * 60)
    print("测试1: 抓取微信文章")
    print("=" * 60)
    
    wechat_url = "https://mp.weixin.qq.com/s/f-3c8C9yaVEPpe9ERGDoSw"
    result1 = tester.test_scrape(wechat_url, "markdown")
    
    # 测试2: 抓取普通网页
    print("\n" + "=" * 60)
    print("测试2: 抓取普通网页")
    print("=" * 60)
    
    test_url = "https://example.com"
    result2 = tester.test_scrape(test_url, "markdown")
    
    # 测试3: 尝试JSON输出
    print("\n" + "=" * 60)
    print("测试3: 尝试JSON输出")
    print("=" * 60)
    
    # 对于JSON输出，需要指定提取提示
    try:
        endpoint = f"{tester.base_url}/scrape"
        payload = {
            "url": "https://example.com",
            "mode": "sync",
            "output": {
                "formats": ["json"]
            },
            "json": {
                "prompt": "Extract the main title and description."
            }
        }
        
        response = requests.post(endpoint, headers=tester.headers, json=payload, timeout=30)
        if response.status_code == 200:
            json_result = response.json()
            print(f"✅ JSON提取成功")
            print(f"结果: {json.dumps(json_result, indent=2, ensure_ascii=False)[:500]}...")
        else:
            print(f"❌ JSON提取失败: {response.status_code}")
    except Exception as e:
        print(f"❌ JSON测试失败: {e}")
    
    print("\n" + "=" * 60)
    print("测试完成！")
    print("=" * 60)

if __name__ == "__main__":
    main()