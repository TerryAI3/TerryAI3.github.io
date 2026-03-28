#!/bin/bash
echo "发布小红书笔记..."

# 使用mcporter发布
mcporter call xiaohongshu.publish_content \
  title="Cadence总部改造ENR获奖项目" \
  content="美国Cadence圣何塞园区改造案例分享！🏢

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

#办公空间设计 #未来办公 #办公室改造 #智能办公室 #员工福祉 #可持续设计 #办公家具 #空间规划 #工作效率 #企业文化" \
  images='["https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg", "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg", "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg", "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg", "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg"]' \
  tags='["办公空间设计","未来办公","办公室改造","智能办公室","员工福祉","可持续设计","办公家具","空间规划","工作效率","企业文化"]' \
  is_original=true

echo ""
echo "发布完成！请在小红书APP中查看结果。"