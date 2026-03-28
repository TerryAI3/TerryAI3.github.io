#!/usr/bin/env python3
"""
XCrawl微信文章抓取解决方案
由于微信文章可能被安全策略阻止，这里提供多种解决方案
"""

import requests
import json
import os
import time
from typing import Dict, List, Optional

class XCrawlWeChatSolution:
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
    
    def method1_direct_scrape(self, url: str) -> Optional[Dict]:
        """方法1: 直接抓取（可能被阻止）"""
        print("方法1: 直接抓取")
        try:
            endpoint = f"{self.base_url}/scrape"
            payload = {
                "url": url,
                "mode": "sync",
                "output": {
                    "formats": ["markdown", "links", "images"]
                }
            }
            
            response = requests.post(endpoint, headers=self.headers, json=payload, timeout=60)
            
            if response.status_code == 200:
                print("✅ 直接抓取成功")
                return response.json()
            else:
                print(f"❌ 直接抓取失败: {response.status_code}")
                error_data = response.json()
                print(f"错误信息: {error_data.get('message', '未知错误')}")
                return None
                
        except Exception as e:
            print(f"❌ 直接抓取异常: {e}")
            return None
    
    def method2_use_proxy(self, url: str, proxy_location: str = "SG") -> Optional[Dict]:
        """方法2: 使用代理（不同地区）"""
        print(f"方法2: 使用{proxy_location}代理")
        try:
            endpoint = f"{self.base_url}/scrape"
            payload = {
                "url": url,
                "mode": "sync",
                "output": {
                    "formats": ["markdown"]
                },
                "proxy": {
                    "location": proxy_location
                }
            }
            
            response = requests.post(endpoint, headers=self.headers, json=payload, timeout=60)
            
            if response.status_code == 200:
                print(f"✅ {proxy_location}代理抓取成功")
                return response.json()
            else:
                print(f"❌ {proxy_location}代理抓取失败: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ 代理抓取异常: {e}")
            return None
    
    def method3_alternative_url(self, original_url: str) -> Optional[Dict]:
        """方法3: 使用替代URL（如存档网站）"""
        print("方法3: 尝试替代URL")
        
        # 尝试archive.is存档
        archive_url = f"https://archive.is/?run=1&url={original_url}"
        
        try:
            endpoint = f"{self.base_url}/scrape"
            payload = {
                "url": archive_url,
                "mode": "sync",
                "output": {
                    "formats": ["markdown"]
                }
            }
            
            response = requests.post(endpoint, headers=self.headers, json=payload, timeout=60)
            
            if response.status_code == 200:
                print("✅ 存档网站抓取成功")
                return response.json()
            else:
                print(f"❌ 存档网站抓取失败: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ 存档网站抓取异常: {e}")
            return None
    
    def method4_text_only(self, url: str) -> Optional[Dict]:
        """方法4: 只提取文本（可能绕过某些限制）"""
        print("方法4: 文本提取模式")
        try:
            endpoint = f"{self.base_url}/scrape"
            payload = {
                "url": url,
                "mode": "sync",
                "output": {
                    "formats": ["text"]  # 只提取文本，可能限制较少
                },
                "options": {
                    "extract_main_content": True
                }
            }
            
            response = requests.post(endpoint, headers=self.headers, json=payload, timeout=60)
            
            if response.status_code == 200:
                print("✅ 文本提取成功")
                return response.json()
            else:
                print(f"❌ 文本提取失败: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ 文本提取异常: {e}")
            return None
    
    def method5_combined_approach(self, url: str) -> Dict:
        """方法5: 组合方法获取内容"""
        print("方法5: 组合方法获取内容")
        
        results = {
            "original_url": url,
            "methods_tried": [],
            "successful_method": None,
            "content": None,
            "images": [],
            "metadata": {}
        }
        
        # 尝试不同方法
        methods = [
            ("直接抓取", self.method1_direct_scrape),
            ("新加坡代理", lambda u: self.method2_use_proxy(u, "SG")),
            ("日本代理", lambda u: self.method2_use_proxy(u, "JP")),
            ("文本提取", self.method4_text_only),
        ]
        
        for method_name, method_func in methods:
            print(f"\n尝试: {method_name}")
            results["methods_tried"].append(method_name)
            
            result = method_func(url)
            if result and 'data' in result:
                data = result['data']
                
                # 提取内容
                if 'markdown' in data and data['markdown']:
                    results["content"] = data['markdown']
                    results["successful_method"] = method_name
                    print(f"✅ 通过{method_name}获取到Markdown内容")
                    break
                elif 'text' in data and data['text']:
                    results["content"] = data['text']
                    results["successful_method"] = method_name
                    print(f"✅ 通过{method_name}获取到文本内容")
                    break
        
        # 如果所有方法都失败，使用备用方案
        if not results["content"]:
            print("\n所有方法都失败，使用备用方案...")
            results["content"] = self.create_fallback_content(url)
            results["successful_method"] = "备用方案"
        
        return results
    
    def create_fallback_content(self, url: str) -> str:
        """创建备用内容（当无法抓取时）"""
        print("创建备用内容...")
        
        # 这里可以：
        # 1. 使用其他来源获取类似内容
        # 2. 基于URL生成摘要
        # 3. 返回提示信息
        
        fallback_content = f"""# 微信文章内容获取失败

**原文链接**: {url}

## 原因分析
由于微信文章的安全策略，直接抓取可能被阻止。

## 解决方案建议
1. **手动复制粘贴**: 在浏览器中打开文章，复制内容后粘贴
2. **使用截图工具**: 对文章进行截图，然后使用OCR提取文字
3. **联系作者**: 直接联系文章作者获取内容
4. **使用其他来源**: 寻找类似主题的其他文章

## 自动化建议
对于微信文章，建议：
1. 建立白名单机制，只抓取允许的公众号
2. 使用官方API（如果有权限）
3. 结合人工审核和自动化处理

---
*此内容由XCrawl备用方案生成*"""
        
        return fallback_content
    
    def save_results(self, results: Dict, filename: str = "wechat_results.json"):
        """保存结果"""
        output_dir = "/root/.openclaw/workspace/xcrawl_results"
        os.makedirs(output_dir, exist_ok=True)
        
        output_path = os.path.join(output_dir, filename)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 结果已保存到: {output_path}")
        
        # 如果有关内容，也保存为markdown
        if results.get("content"):
            md_path = os.path.join(output_dir, "content.md")
            with open(md_path, 'w', encoding='utf-8') as f:
                f.write(results["content"])
            print(f"✅ 内容已保存到: {md_path}")
        
        return output_path

def main():
    print("=" * 60)
    print("XCrawl微信文章抓取解决方案")
    print("=" * 60)
    
    # 目标文章
    wechat_url = "https://mp.weixin.qq.com/s/f-3c8C9yaVEPpe9ERGDoSw"
    print(f"目标文章: {wechat_url}")
    print()
    
    # 创建解决方案
    solution = XCrawlWeChatSolution()
    
    # 使用组合方法
    print("开始尝试多种方法抓取...")
    results = solution.method5_combined_approach(wechat_url)
    
    print("\n" + "=" * 60)
    print("抓取结果总结")
    print("=" * 60)
    
    print(f"原文链接: {results['original_url']}")
    print(f"尝试的方法: {', '.join(results['methods_tried'])}")
    print(f"成功的方法: {results['successful_method']}")
    
    if results['content']:
        content_preview = results['content'][:200] + "..." if len(results['content']) > 200 else results['content']
        print(f"\n获取到的内容 (预览):")
        print("-" * 50)
        print(content_preview)
        print("-" * 50)
        print(f"内容长度: {len(results['content'])} 字符")
    else:
        print("\n❌ 未能获取到内容")
    
    # 保存结果
    saved_file = solution.save_results(results)
    
    print("\n" + "=" * 60)
    print("建议的后续步骤:")
    print("=" * 60)
    
    if "备用方案" in results['successful_method']:
        print("1. 📋 手动处理: 在浏览器中打开文章，复制内容")
        print("2. 🖼️  截图OCR: 对文章截图，使用OCR工具提取文字")
        print("3. 🔍 替代来源: 搜索类似主题的其他文章")
        print("4. 🤖 AI辅助: 使用AI根据URL生成摘要")
    else:
        print("1. ✅ 内容已获取，可以继续处理")
        print("2. 📝 生成小红书内容")
        print("3. 🚀 发布到社交媒体")
        print("4. 🔄 建立自动化流程")
    
    print("\n" + "=" * 60)
    print("完成！")
    print("=" * 60)

if __name__ == "__main__":
    main()