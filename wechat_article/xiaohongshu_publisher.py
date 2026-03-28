#!/usr/bin/env python3
"""
小红书发布工具
使用agent-reach的小红书MCP服务器发布内容
"""

import subprocess
import json
import os
import sys

def publish_to_xiaohongshu(title, content, images, tags, is_original=True):
    """
    发布内容到小红书
    
    Args:
        title: 标题（最多20字）
        content: 正文内容
        images: 图片URL列表
        tags: 标签列表（最多10个）
        is_original: 是否原创
    """
    
    print(f"准备发布小红书笔记...")
    print(f"标题: {title}")
    print(f"图片数量: {len(images)}")
    print(f"标签数量: {len(tags)}")
    print()
    
    # 构建mcporter命令
    cmd = [
        "mcporter", "call", "xiaohongshu.publish_content",
        f"title={title}",
        f"content={content}",
        f"images={json.dumps(images)}",
        f"tags={json.dumps(tags)}",
        f"is_original={str(is_original).lower()}"
    ]
    
    print("执行命令:", " ".join(cmd))
    print()
    
    try:
        # 执行命令
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        
        print("标准输出:")
        print(result.stdout)
        
        if result.stderr:
            print("标准错误:")
            print(result.stderr)
        
        print(f"返回码: {result.returncode}")
        
        if result.returncode == 0:
            print("✅ 发布命令执行成功！")
            print("注意：发布可能需要几分钟时间处理，请稍后在小红书APP中查看。")
            return True
        else:
            print("❌ 发布命令执行失败！")
            return False
            
    except subprocess.TimeoutExpired:
        print("⚠️  命令执行超时，但可能仍在后台处理中...")
        print("请等待2-3分钟后在小红书APP中查看是否发布成功。")
        return True
    except Exception as e:
        print(f"❌ 执行命令时出错: {e}")
        return False

def main():
    """主函数"""
    
    # 小红书内容配置
    title = "Cadence总部改造ENR获奖项目"
    
    content = """美国Cadence圣何塞园区改造案例分享！🏢

🎯 项目亮点：
1️⃣ 6栋办公楼全面焕新升级
2️⃣ 双层挑高大堂+开放协作空间
3️⃣ 自然采光+绿植墙设计
4️⃣ 灵活多元的工作环境

💡 设计理念：打破部门隔阂，促进交流互动！

📊 改造效果：
✅ 从过时隔断→开放协作空间
✅ 低矮吊顶→双层挑高大堂
✅ 封闭实验室→透明玻璃立面
✅ 分散布局→社交核心枢纽

🏆 项目荣誉：
• ENR全球最佳办公空间奖
• 可持续建筑设计认证
• 员工满意度行业标杆

🔧 技术亮点：
1. Building 7：施工期间数据中心持续运转
2. Building 8：展会式共享演示室
3. Building 9：中央休息室+灵活工作点
4. Building 5：高管区与员工区无缝衔接

💼 行业启示：
1. 未来办公=灵活+智能+可持续
2. 员工体验=健康福祉+工作效率
3. 空间设计=促进协作+激发创意
4. 企业文化=开放互联+社区精神

💬 互动话题：
1. 你们公司办公室最需要改造什么？
2. 理想的办公空间应该有哪些功能？
3. 分享你见过最有创意的办公室设计！

#办公空间设计 #未来办公 #办公室改造 #智能办公室 #员工福祉 #可持续设计 #办公家具 #空间规划 #工作效率 #企业文化"""
    
    images = [
        "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg",
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
        "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
        "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg",
        "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg"
    ]
    
    tags = [
        "办公空间设计",
        "未来办公",
        "办公室改造",
        "智能办公室",
        "员工福祉",
        "可持续设计",
        "办公家具",
        "空间规划",
        "工作效率",
        "企业文化"
    ]
    
    print("=" * 60)
    print("小红书内容发布工具")
    print("=" * 60)
    print()
    
    # 显示内容预览
    print("📱 内容预览:")
    print("-" * 40)
    print(f"标题: {title}")
    print(f"正文长度: {len(content)} 字符")
    print(f"图片数量: {len(images)} 张")
    print(f"标签: {', '.join(tags)}")
    print("-" * 40)
    print()
    
    # 询问是否发布
    response = input("是否发布到小红书？(y/n): ").strip().lower()
    
    if response == 'y' or response == 'yes':
        print()
        success = publish_to_xiaohongshu(title, content, images, tags, True)
        
        if success:
            print()
            print("✅ 发布流程完成！")
            print("请在小红书APP中查看发布结果。")
        else:
            print()
            print("❌ 发布失败，请检查配置。")
    else:
        print()
        print("已取消发布。")
        
        # 保存内容到文件
        output_file = "/root/.openclaw/workspace/wechat_article/xiaohongshu_ready_to_publish.md"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"# 小红书内容（待发布）\n\n")
            f.write(f"## 标题\n{title}\n\n")
            f.write(f"## 正文\n{content}\n\n")
            f.write(f"## 图片URL\n")
            for img in images:
                f.write(f"- {img}\n")
            f.write(f"\n## 标签\n")
            for tag in tags:
                f.write(f"- {tag}\n")
        
        print(f"内容已保存到: {output_file}")
        print("你可以稍后手动发布。")

if __name__ == "__main__":
    main()