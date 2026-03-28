#!/bin/bash
# 小红书发布脚本

echo "准备发布小红书笔记..."
echo "标题: Cadence总部改造获奖案例"
echo ""

# 使用mcporter发布
mcporter call xiaohongshu.publish_content \
  title="Cadence总部改造获奖案例" \
  content="分享一个超赞的科技公司总部改造案例！🏢

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

#办公空间设计 #未来办公 #办公室改造 #智能办公室 #员工福祉 #可持续设计 #办公家具 #空间规划 #工作效率 #企业文化" \
  images='["https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg", "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg", "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg", "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg", "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg"]' \
  tags='["办公空间设计","未来办公","办公室改造","智能办公室","员工福祉","可持续设计","办公家具","空间规划","工作效率","企业文化"]' \
  is_original=true

echo ""
echo "发布命令已执行！"