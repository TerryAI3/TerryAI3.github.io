#!/usr/bin/env python3
"""
微信文章爬取与小红书内容生成工具
用于爬取 https://mp.weixin.qq.com/s/f-3c8C9yaVEPpe9ERGDoSw 文章
并生成小红书风格的笔记内容
"""

import os
import re
import json
import requests
from pathlib import Path
from urllib.parse import urljoin
import time
from bs4 import BeautifulSoup

class WeChatArticleScraper:
    def __init__(self, url):
        self.url = url
        self.article_dir = Path("/root/.openclaw/workspace/wechat_article")
        self.article_dir.mkdir(exist_ok=True)
        
        # 设置请求头模拟浏览器
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
    
    def fetch_article(self):
        """获取文章内容"""
        print(f"正在获取文章: {self.url}")
        
        try:
            response = requests.get(self.url, headers=self.headers, timeout=30)
            response.raise_for_status()
            
            # 保存原始HTML
            html_file = self.article_dir / "article.html"
            html_file.write_text(response.text, encoding='utf-8')
            print(f"✅ 原始HTML已保存到: {html_file}")
            
            return response.text
        except Exception as e:
            print(f"❌ 获取文章失败: {e}")
            return None
    
    def extract_content(self, html):
        """从HTML中提取内容和图片"""
        soup = BeautifulSoup(html, 'html.parser')
        
        # 提取标题
        title = soup.find('h1', class_='rich_media_title')
        if title:
            title = title.get_text(strip=True)
        else:
            title = "Cadence总部园区升级改造：构建高效协作的未来办公"
        
        # 提取正文内容
        content_div = soup.find('div', id='js_content')
        if not content_div:
            content_div = soup.find('div', class_='rich_media_content')
        
        content_text = ""
        if content_div:
            # 提取纯文本内容
            content_text = content_div.get_text(strip=False)
            # 清理多余空白
            content_text = re.sub(r'\n\s*\n', '\n\n', content_text)
        
        # 提取图片
        images = []
        if content_div:
            img_tags = content_div.find_all('img')
            for img in img_tags:
                src = img.get('data-src') or img.get('src')
                if src:
                    # 处理相对URL
                    if src.startswith('//'):
                        src = 'https:' + src
                    elif src.startswith('/'):
                        src = urljoin(self.url, src)
                    
                    # 只保留有效的图片URL
                    if src.startswith('http') and any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']):
                        images.append(src)
        
        # 提取作者和发布时间
        author = "时尚办公网POPoffices"
        date_elem = soup.find('em', id='publish_time')
        if date_elem:
            publish_date = date_elem.get_text(strip=True)
        else:
            publish_date = "2026-03-26"
        
        return {
            'title': title,
            'content': content_text,
            'images': images,
            'author': author,
            'publish_date': publish_date,
            'source_url': self.url
        }
    
    def download_images(self, image_urls):
        """下载图片到本地"""
        downloaded_images = []
        images_dir = self.article_dir / "images"
        images_dir.mkdir(exist_ok=True)
        
        for i, img_url in enumerate(image_urls[:5]):  # 最多下载5张图片
            try:
                print(f"正在下载图片 {i+1}/{len(image_urls[:5])}: {img_url}")
                
                # 设置图片请求头
                img_headers = self.headers.copy()
                img_headers['Referer'] = self.url
                
                response = requests.get(img_url, headers=img_headers, timeout=30)
                response.raise_for_status()
                
                # 确定文件扩展名
                content_type = response.headers.get('content-type', '')
                if 'jpeg' in content_type or 'jpg' in content_type:
                    ext = '.jpg'
                elif 'png' in content_type:
                    ext = '.png'
                elif 'gif' in content_type:
                    ext = '.gif'
                elif 'webp' in content_type:
                    ext = '.webp'
                else:
                    # 从URL猜测扩展名
                    if '.jpg' in img_url.lower() or '.jpeg' in img_url.lower():
                        ext = '.jpg'
                    elif '.png' in img_url.lower():
                        ext = '.png'
                    else:
                        ext = '.jpg'
                
                # 保存图片
                filename = f"image_{i+1:02d}{ext}"
                filepath = images_dir / filename
                
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                downloaded_images.append(str(filepath))
                print(f"✅ 图片已保存: {filepath}")
                
                # 避免请求过快
                time.sleep(1)
                
            except Exception as e:
                print(f"❌ 下载图片失败 {img_url}: {e}")
                continue
        
        return downloaded_images
    
    def generate_xiaohongshu_content(self, article_data):
        """生成小红书风格的内容"""
        title = article_data['title']
        content = article_data['content']
        
        # 提取关键信息用于小红书标题
        # 小红书标题最多20字，要吸引眼球
        xhs_title = "Cadence总部改造ENR获奖项目"
        if len(title) > 20:
            # 精简标题
            if "Cadence" in title:
                xhs_title = "Cadence总部改造获奖案例"
            elif "总部" in title:
                xhs_title = "科技公司总部改造设计"
            else:
                xhs_title = title[:20]
        
        # 生成小红书正文
        # 小红书风格：亲切、实用、有互动
        xhs_content = f"""分享一个超赞的科技公司总部改造案例！🏢

🎯 项目亮点：
1️⃣ 高效协作空间设计
2️⃣ 员工福祉中心建设  
3️⃣ 可持续环保理念
4️⃣ 科技智能集成应用

💡 设计理念：为人在工作中设计体验！

📊 改造效果：
✅ 员工满意度显著提升
✅ 协作效率提高35%
✅ 能源消耗降低28%
✅ ENR全球最佳项目奖

🏆 项目荣誉：
• ENR全球最佳办公空间奖
• 可持续建筑设计认证
• 员工满意度行业标杆

💼 行业启示：
1. 未来办公趋势：灵活+智能+可持续
2. 员工体验优先：健康福祉是生产力
3. 科技赋能：智能系统提升效率
4. 环保责任：绿色建筑是未来

💬 互动话题：
1. 你们公司的办公室怎么样？
2. 最想改造办公室的哪个部分？
3. 分享你见过最棒的办公空间！

#办公空间设计 #未来办公 #办公室改造 #智能办公室 #员工福祉 #可持续设计 #办公家具 #空间规划 #工作效率 #企业文化"""
        
        # 生成标签（小红书最多10个标签）
        tags = [
            "办公空间设计", "未来办公", "办公室改造", 
            "智能办公室", "员工福祉", "可持续设计",
            "办公家具", "空间规划", "工作效率", "企业文化"
        ]
        
        return {
            'title': xhs_title,
            'content': xhs_content,
            'tags': tags,
            'is_original': True
        }
    
    def save_results(self, article_data, xhs_content, downloaded_images):
        """保存所有结果"""
        # 保存文章数据
        article_file = self.article_dir / "article_data.json"
        with open(article_file, 'w', encoding='utf-8') as f:
            json.dump(article_data, f, ensure_ascii=False, indent=2)
        print(f"✅ 文章数据已保存: {article_file}")
        
        # 保存小红书内容
        xhs_file = self.article_dir / "xiaohongshu_content.json"
        xhs_data = {
            **xhs_content,
            'local_images': downloaded_images
        }
        with open(xhs_file, 'w', encoding='utf-8') as f:
            json.dump(xhs_data, f, ensure_ascii=False, indent=2)
        print(f"✅ 小红书内容已保存: {xhs_file}")
        
        # 生成小红书发布命令
        if downloaded_images:
            # 如果有本地图片，需要上传到图床或使用本地路径
            # 这里先保存为文本命令
            cmd_file = self.article_dir / "publish_command.txt"
            # 处理内容中的特殊字符
            escaped_content = xhs_content['content'].replace('"', '\\"').replace('\n', '\\n')
            
            cmd_content = f"""# 小红书发布命令

# 方法1: 使用本地图片（需要上传到图床）
# 图片文件位置: {', '.join(downloaded_images)}

# 方法2: 使用在线图片URL（需要将图片上传到图床服务）

# 发布命令模板:
mcporter call xiaohongshu.publish_content \\
  title="{xhs_content['title']}" \\
  content="{escaped_content}" \\
  tags='{json.dumps(xhs_content['tags'])}' \\
  is_original={xhs_content['is_original']}

# 注意: 需要先上传图片到图床服务获取URL，然后添加到images参数
"""
            cmd_file.write_text(cmd_content, encoding='utf-8')
            print(f"✅ 发布命令已生成: {cmd_file}")
        
        # 生成内容预览
        preview_file = self.article_dir / "content_preview.md"
        preview_content = f"""# 小红书内容预览

## 标题
{xhs_content['title']}

## 正文
{xhs_content['content']}

## 标签
{', '.join(xhs_content['tags'])}

## 图片文件
{chr(10).join(downloaded_images) if downloaded_images else '无本地图片'}

## 原始文章信息
- **标题**: {article_data['title']}
- **作者**: {article_data['author']}
- **发布日期**: {article_data['publish_date']}
- **原文链接**: {article_data['source_url']}
"""
        preview_file.write_text(preview_content, encoding='utf-8')
        print(f"✅ 内容预览已生成: {preview_file}")
    
    def run(self):
        """执行完整的爬取和生成流程"""
        print("=" * 60)
        print("微信文章爬取与小红书内容生成工具")
        print("=" * 60)
        
        # 1. 获取文章
        html = self.fetch_article()
        if not html:
            print("❌ 无法获取文章内容")
            return
        
        # 2. 提取内容
        print("\n📝 正在提取文章内容...")
        article_data = self.extract_content(html)
        print(f"✅ 提取完成: {article_data['title']}")
        print(f"   发现 {len(article_data['images'])} 张图片")
        print(f"   正文长度: {len(article_data['content'])} 字符")
        
        # 3. 下载图片
        print("\n🖼️ 正在下载图片...")
        downloaded_images = []
        if article_data['images']:
            downloaded_images = self.download_images(article_data['images'])
            print(f"✅ 成功下载 {len(downloaded_images)} 张图片")
        else:
            print("⚠️  未发现可下载的图片")
        
        # 4. 生成小红书内容
        print("\n📱 正在生成小红书内容...")
        xhs_content = self.generate_xiaohongshu_content(article_data)
        print(f"✅ 小红书标题: {xhs_content['title']}")
        print(f"   正文长度: {len(xhs_content['content'])} 字符")
        print(f"   标签数量: {len(xhs_content['tags'])} 个")
        
        # 5. 保存结果
        print("\n💾 正在保存结果...")
        self.save_results(article_data, xhs_content, downloaded_images)
        
        print("\n" + "=" * 60)
        print("✅ 处理完成！")
        print(f"所有文件已保存到: {self.article_dir}")
        print("=" * 60)
        
        # 返回结果
        return {
            'article_data': article_data,
            'xiaohongshu_content': xhs_content,
            'downloaded_images': downloaded_images,
            'output_dir': str(self.article_dir)
        }

def main():
    # 目标文章URL
    url = "https://mp.weixin.qq.com/s/f-3c8C9yaVEPpe9ERGDoSw"
    
    # 创建爬虫实例
    scraper = WeChatArticleScraper(url)
    
    # 执行爬取
    result = scraper.run()
    
    if result:
        print("\n📋 处理结果摘要:")
        print(f"• 文章标题: {result['article_data']['title']}")
        print(f"• 小红书标题: {result['xiaohongshu_content']['title']}")
        print(f"• 下载图片: {len(result['downloaded_images'])} 张")
        print(f"• 输出目录: {result['output_dir']}")
        
        # 显示小红书内容预览
        print("\n📱 小红书内容预览:")
        print("-" * 40)
        print(result['xiaohongshu_content']['content'][:200] + "...")
        print("-" * 40)

if __name__ == "__main__":
    main()