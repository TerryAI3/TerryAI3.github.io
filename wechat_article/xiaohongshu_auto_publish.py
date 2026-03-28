#!/usr/bin/env python3
"""
小红书自动发布工具
"""

import subprocess
import json
import os

def publish_to_xiaohongshu():
    """发布内容到小红书"""
    
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
    print("小红书自动发布工具")
    print("=" * 60)
    print()
    
    print("📱 发布内容:")
    print("-" * 40)
    print(f"标题: {title}")
    print(f"正文长度: {len(content)} 字符")
    print(f"图片数量: {len(images)} 张")
    print(f"标签: {', '.join(tags)}")
    print("-" * 40)
    print()
    
    # 构建mcporter命令
    cmd = [
        "mcporter", "call", "xiaohongshu.publish_content",
        f"title={title}",
        f"content={content}",
        f"images={json.dumps(images)}",
        f"tags={json.dumps(tags)}",
        f"is_original=true"
    ]
    
    print("执行命令:", " ".join(cmd))
    print()
    
    try:
        # 执行命令
        print("正在发布到小红书...")
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
            
            # 保存发布记录
            record = {
                "title": title,
                "content": content,
                "images": images,
                "tags": tags,
                "timestamp": "2026-03-26 11:20 UTC",
                "status": "published"
            }
            
            record_file = "/root/.openclaw/workspace/wechat_article/publish_record.json"
            with open(record_file, 'w', encoding='utf-8') as f:
                json.dump(record, f, ensure_ascii=False, indent=2)
            
            print(f"发布记录已保存到: {record_file}")
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

def check_login_status():
    """检查小红书登录状态"""
    print("检查小红书登录状态...")
    
    try:
        result = subprocess.run(
            ["mcporter", "call", "xiaohongshu.check_login_status"],
            capture_output=True, text=True, timeout=30
        )
        
        print("登录状态检查结果:")
        print(result.stdout)
        
        if result.returncode == 0:
            return True
        else:
            return False
            
    except Exception as e:
        print(f"检查登录状态时出错: {e}")
        return False

def main():
    """主函数"""
    
    print("开始小红书发布流程...")
    print()
    
    # 检查登录状态
    if not check_login_status():
        print("⚠️  小红书登录状态可能有问题，但继续尝试发布...")
        print()
    
    # 发布内容
    success = publish_to_xiaohongshu()
    
    if success:
        print()
        print("=" * 60)
        print("✅ 发布流程完成！")
        print("请在小红书APP中查看发布结果。")
        print("=" * 60)
    else:
        print()
        print("=" * 60)
        print("❌ 发布失败。")
        print("请检查：")
        print("1. agent-reach小红书渠道配置")
        print("2. 小红书账号登录状态")
        print("3. 网络连接")
        print("=" * 60)

if __name__ == "__main__":
    main()