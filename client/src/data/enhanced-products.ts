// 🏷️ 增强产品数据 - 四大品牌完整产品线

import { Product } from './sample-products';

export const enhancedProducts: Product[] = [
  // ========== 玛祖铭立 - 高端产品系列 ==========
  {
    id: 'matsu-executive-desk',
    name: 'Executive Pro 高管办公桌',
    description: '进口实木材质，德国精密工艺，集成智能线缆管理系统',
    brand: 'matsu',
    brandName: '玛祖铭立',
    category: '高管办公桌',
    features: ['进口实木', '德国工艺', '智能线缆管理', '环保涂料', '十年质保'],
    mainImage: '/images/products/matsu-executive-desk.jpg',
    tags: ['高端定制', '实木材质', '德国工艺', '智能管理', '高管办公室'],
    isFeatured: true,
    isNew: false
  },
  {
    id: 'matsu-ergo-chair',
    name: 'ErgoMaster 人体工学椅',
    description: '德国设计人体工学椅，全方位调节系统，顶级网布材质',
    brand: 'matsu',
    brandName: '玛祖铭立',
    category: '人体工学办公椅',
    features: ['德国设计', '全方位调节', '顶级网布', '腰椎支撑', '头枕记忆'],
    mainImage: '/images/products/matsu-ergo-chair.jpg',
    tags: ['人体工学', '德国设计', '高端座椅', '健康办公', '员工办公区'],
    isFeatured: true,
    isNew: true
  },
  {
    id: 'matsu-conference-table',
    name: 'Conference Elite 会议桌',
    description: '大型会议桌，集成多媒体设备，优质实木桌面',
    brand: 'matsu',
    brandName: '玛祖铭立',
    category: '智能会议桌',
    features: ['大型设计', '多媒体集成', '实木桌面', '线缆隐藏', '扩展模块'],
    mainImage: '/images/products/matsu-conference-table.jpg',
    tags: ['会议桌', '多媒体', '实木材质', '大型会议', '会议室'],
    isFeatured: false,
    isNew: false
  },
  {
    id: 'matsu-file-cabinet',
    name: 'SecureFile 智能文件柜',
    description: '智能电子锁文件柜，防火防潮设计，模块化存储',
    brand: 'matsu',
    brandName: '玛祖铭立',
    category: '文件柜系列',
    features: ['智能电子锁', '防火防潮', '模块化设计', '静音滑轮', '多层存储'],
    mainImage: '/images/products/matsu-file-cabinet.jpg',
    tags: ['文件柜', '智能锁', '防火防潮', '模块化', '存储解决方案'],
    isFeatured: false,
    isNew: true
  },

  // ========== 欧林 - 智能解决方案系列 ==========
  {
    id: 'onlead-smart-desk',
    name: 'SmartDesk Elite 智能升降桌',
    description: '电动智能升降桌，四电机驱动，APP控制，健康办公',
    brand: 'onlead',
    brandName: '欧林',
    category: '智能升降桌',
    features: ['四电机驱动', 'APP控制', '记忆高度', '超静音', '健康提醒'],
    mainImage: '/images/products/onlead-smart-desk.jpg',
    tags: ['智能化', '电动升降', '健康办公', 'APP控制', '员工办公区'],
    isFeatured: true,
    isNew: true
  },
  {
    id: 'onlead-medical-cabinet',
    name: 'MediStore 医疗存储柜',
    description: '医疗专用存储柜，抗菌材料，智能温控，安全锁设计',
    brand: 'onlead',
    brandName: '欧林',
    category: '医疗家具',
    features: ['抗菌材料', '智能温控', '安全锁', '医疗专用', '易清洁'],
    mainImage: '/images/products/onlead-medical-cabinet.jpg',
    tags: ['医疗家具', '抗菌材料', '智能温控', '专业领域', '医疗环境'],
    isFeatured: true,
    isNew: false
  },
  {
    id: 'onlead-training-desk',
    name: 'TrainPro 培训桌椅',
    description: '培训专用桌椅，可折叠设计，移动便捷，耐用材质',
    brand: 'onlead',
    brandName: '欧林',
    category: '培训桌椅',
    features: ['可折叠设计', '移动便捷', '耐用材质', '培训专用', '快速布置'],
    mainImage: '/images/products/onlead-training-desk.jpg',
    tags: ['培训家具', '可折叠', '移动便捷', '培训教室', '批量采购'],
    isFeatured: false,
    isNew: false
  },
  {
    id: 'onlead-hotel-furniture',
    name: 'HotelSuite 酒店家具',
    description: '酒店专用家具，现代设计，耐用材质，定制服务',
    brand: 'onlead',
    brandName: '欧林',
    category: '酒店家具',
    features: ['酒店专用', '现代设计', '耐用材质', '定制服务', '快速交付'],
    mainImage: '/images/products/onlead-hotel-furniture.jpg',
    tags: ['酒店家具', '现代设计', '定制服务', '专业领域', '酒店环境'],
    isFeatured: false,
    isNew: true
  },

  // ========== 欧美斯 - 健康办公系列 ==========
  {
    id: 'onmuse-health-chair',
    name: 'HealthPro 健康办公椅',
    description: '健康办公理念设计，动态支撑系统，透气环保材料',
    brand: 'onmuse',
    brandName: '欧美斯',
    category: '人体工学办公椅',
    features: ['动态支撑', '透气材料', '环保认证', '健康设计', '多色可选'],
    mainImage: '/images/products/onmuse-health-chair.jpg',
    tags: ['健康办公', '环保材料', '动态支撑', '多色可选', '员工办公区'],
    isFeatured: true,
    isNew: true
  },
  {
    id: 'onmuse-standing-desk',
    name: 'StandWell 站立办公桌',
    description: '手动升降站立桌，环保材质，简约设计，健康办公',
    brand: 'onmuse',
    brandName: '欧美斯',
    category: '升降办公桌',
    features: ['手动升降', '环保材质', '简约设计', '健康办公', '经济实用'],
    mainImage: '/images/products/onmuse-standing-desk.jpg',
    tags: ['站立办公', '环保材质', '简约设计', '健康办公', '经济型'],
    isFeatured: false,
    isNew: false
  },
  {
    id: 'onmuse-acoustic-panel',
    name: 'SoundPeace 声学隔断',
    description: '办公声学隔断，吸音材料，现代设计，灵活组合',
    brand: 'onmuse',
    brandName: '欧美斯',
    category: '声学隔断',
    features: ['吸音材料', '现代设计', '灵活组合', '安装简便', '多色可选'],
    mainImage: '/images/products/onmuse-acoustic-panel.jpg',
    tags: ['声学隔断', '吸音材料', '现代设计', '办公环境', '空间优化'],
    isFeatured: true,
    isNew: true
  },
  {
    id: 'onmuse-color-accessories',
    name: 'ColorWorks 色彩配件',
    description: '办公色彩配件系列，个性化选择，提升办公环境',
    brand: 'onmuse',
    brandName: '欧美斯',
    category: '办公配件',
    features: ['个性化色彩', '环保材料', '易安装', '提升环境', '多种选择'],
    mainImage: '/images/products/onmuse-color-accessories.jpg',
    tags: ['色彩配件', '个性化', '环保材料', '办公环境', '创意设计'],
    isFeatured: false,
    isNew: true
  },

  // ========== 上海诗敏 - 教育专业系列 ==========
  {
    id: 'seewin-student-desk',
    name: 'EduDesk Pro 学生课桌',
    description: '学生专用课桌，人体工学设计，耐用材质，安全环保',
    brand: 'seewin',
    brandName: '上海诗敏',
    category: '学生课桌椅',
    features: ['人体工学', '耐用材质', '安全环保', '学生专用', '批量采购'],
    mainImage: '/images/products/seewin-student-desk.jpg',
    tags: ['学生课桌', '人体工学', '耐用安全', '教育专用', '批量采购'],
    isFeatured: true,
    isNew: false
  },
  {
    id: 'seewin-teacher-desk',
    name: 'Teacher Pro 教师讲台',
    description: '多功能教师讲台，集成存储，移动设计，耐用材质',
    brand: 'seewin',
    brandName: '上海诗敏',
    category: '教师讲台',
    features: ['多功能设计', '集成存储', '移动便捷', '耐用材质', '教育专用'],
    mainImage: '/images/products/seewin-teacher-desk.jpg',
    tags: ['教师讲台', '多功能', '集成存储', '教育专用', '耐用材质'],
    isFeatured: false,
    isNew: false
  },
  {
    id: 'seewin-lab-furniture',
    name: 'LabSmart 实验室家具',
    description: '实验室专用家具，耐腐蚀材料，安全设计，专业配置',
    brand: 'seewin',
    brandName: '上海诗敏',
    category: '实验室家具',
    features: ['耐腐蚀材料', '安全设计', '专业配置', '实验室专用', '定制服务'],
    mainImage: '/images/products/seewin-lab-furniture.jpg',
    tags: ['实验室家具', '耐腐蚀', '安全设计', '专业领域', '定制服务'],
    isFeatured: true,
    isNew: true
  },
  {
    id: 'seewin-library-shelf',
    name: 'LibraryPro 图书馆书架',
    description: '图书馆专用书架，钢木结构，承重设计，灵活组合',
    brand: 'seewin',
    brandName: '上海诗敏',
    category: '图书馆家具',
    features: ['钢木结构', '承重设计', '灵活组合', '图书馆专用', '耐用安全'],
    mainImage: '/images/products/seewin-library-shelf.jpg',
    tags: ['图书馆书架', '钢木结构', '承重设计', '教育专用', '耐用安全'],
    isFeatured: false,
    isNew: false
  },

  // ========== 补充产品 ==========
  {
    id: 'matsu-reception-desk',
    name: 'Reception Elite 接待台',
    description: '高端接待台，大理石台面，LED照明，品牌形象展示',
    brand: 'matsu',
    brandName: '玛祖铭立',
    category: '接待家具',
    features: ['大理石台面', 'LED照明', '品牌展示', '高端设计', '定制尺寸'],
    mainImage: '/images/products/matsu-reception-desk.jpg',
    tags: ['接待台', '大理石', 'LED照明', '品牌形象', '公共空间'],
    isFeatured: true,
    isNew: true
  },
  {
    id: 'onlead-waiting-chair',
    name: 'WaitComfort 等候椅',
    description: '公共空间等候椅，舒适耐用，现代设计，多种配置',
    brand: 'onlead',
    brandName: '欧林',
    category: '公共空间家具',
    features: ['舒适耐用', '现代设计', '多种配置', '公共空间', '快速安装'],
    mainImage: '/images/products/onlead-waiting-chair.jpg',
    tags: ['等候椅', '公共空间', '舒适耐用', '现代设计', '多种配置'],
    isFeatured: false,
    isNew: true
  },
  {
    id: 'onmuse-collaboration-table',
    name: 'CollabTable 协作桌',
    description: '团队协作桌，灵活组合，集成电源，创意空间设计',
    brand: 'onmuse',
    brandName: '欧美斯',
    category: '协作家具',
    features: ['灵活组合', '集成电源', '创意设计', '团队协作', '现代风格'],
    mainImage: '/images/products/onmuse-collaboration-table.jpg',
    tags: ['协作桌', '灵活组合', '集成电源', '团队协作', '创意空间'],
    isFeatured: true,
    isNew: false
  },
  {
    id: 'seewin-dormitory-furniture',
    name: 'DormComfort 宿舍家具',
    description: '学生宿舍家具，安全耐用，空间优化，批量采购优惠',
    brand: 'seewin',
    brandName: '上海诗敏',
    category: '宿舍家具',
    features: ['安全耐用', '空间优化', '批量采购', '学生宿舍', '经济实用'],
    mainImage: '/images/products/seewin-dormitory-furniture.jpg',
    tags: ['宿舍家具', '安全耐用', '空间优化', '批量采购', '教育专用'],
    isFeatured: false,
    isNew: true
  }
];

// 品牌统计
export const brandStats = {
  matsu: {
    name: '玛祖铭立',
    count: enhancedProducts.filter(p => p.brand === 'matsu').length,
    categories: ['高管办公桌', '人体工学办公椅', '智能会议桌', '文件柜系列', '接待家具']
  },
  onlead: {
    name: '欧林',
    count: enhancedProducts.filter(p => p.brand === 'onlead').length,
    categories: ['智能升降桌', '医疗家具', '培训桌椅', '酒店家具', '公共空间家具']
  },
  onmuse: {
    name: '欧美斯',
    count: enhancedProducts.filter(p => p.brand === 'onmuse').length,
    categories: ['人体工学办公椅', '升降办公桌', '声学隔断', '办公配件', '协作家具']
  },
  seewin: {
    name: '上海诗敏',
    count: enhancedProducts.filter(p => p.brand === 'seewin').length,
    categories: ['学生课桌椅', '教师讲台', '实验室家具', '图书馆家具', '宿舍家具']
  }
};

// 分类统计
export const categoryStats = [
  { name: '高管办公桌', count: enhancedProducts.filter(p => p.category === '高管办公桌').length },
  { name: '人体工学办公椅', count: enhancedProducts.filter(p => p.category === '人体工学办公椅').length },
  { name: '智能升降桌', count: enhancedProducts.filter(p => p.category === '智能升降桌').length },
  { name: '医疗家具', count: enhancedProducts.filter(p => p.category === '医疗家具').length },
  { name: '学生课桌椅', count: enhancedProducts.filter(p => p.category === '学生课桌椅').length },
  { name: '声学隔断', count: enhancedProducts.filter(p => p.category === '声学隔断').length },
  { name: '实验室家具', count: enhancedProducts.filter(p => p.category === '实验室家具').length },
  { name: '协作家具', count: enhancedProducts.filter(p => p.category === '协作家具').length }
];

// 热门标签
export const popularTags = [
  { name: '高端定制', count: enhancedProducts.filter(p => p.tags.includes('高端定制')).length },
  { name: '智能化', count: enhancedProducts.filter(p => p.tags.includes('智能化')).length },
  { name: '健康办公', count: enhancedProducts.filter(p => p.tags.includes('健康办公')).length },
  { name: '教育专用', count: enhancedProducts.filter(p => p.tags.includes('教育专用')).length },
  { name: '批量采购', count: enhancedProducts.filter(p => p.tags.includes('批量采购')).length },
  { name: '德国设计', count: enhancedProducts.filter(p => p.tags.includes('德国设计')).length },
  { name: '环保材料', count: enhancedProducts.filter(p => p.tags.includes('环保材料')).length },
  { name: '定制服务', count: enhancedProducts.filter(p => p.tags.includes('定制服务')).length }
];