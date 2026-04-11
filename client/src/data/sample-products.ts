// 🏷️ 四大品牌整合示例产品数据

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: 'matsu' | 'onlead' | 'onmuse' | 'seewin';
  brandName: string;
  category: string;
  features: string[];
  mainImage: string;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
}

export const sampleProducts: Product[] = [
  // 玛祖铭立 - 高端产品
  {
    id: 'prod-matsu-001',
    name: 'Executive 高管办公桌',
    description: '实木材质高管办公桌，德国工艺，彰显尊贵身份',
    brand: 'matsu',
    brandName: '玛祖铭立',
    category: '高管办公桌',
    features: ['实木材质', '德国工艺', '集成线缆管理', '环保涂料'],
    mainImage: '/images/products/executive-desk.jpg',
    tags: ['高端定制', '实木材质', '德国品质', '高管办公室'],
    isFeatured: true,
    isNew: false
  },
  {
    id: 'prod-matsu-002',
    name: 'Premium 办公屏风系统',
    description: '模块化办公屏风，德国设计，优质隔音材料',
    brand: 'matsu',
    brandName: '玛祖铭立',
    category: '办公屏风系统',
    features: ['模块化设计', '优质隔音', '德国工艺', '多种配置'],
    mainImage: '/images/products/premium-partition.jpg',
    tags: ['模块化', '隔音', '德国设计', '员工办公区'],
    isFeatured: true,
    isNew: true
  },

  // 欧林 - 智能解决方案
  {
    id: 'prod-onlead-001',
    name: 'SmartDesk Pro 智能升降桌',
    description: '电动智能升降桌，记忆高度，静音电机，健康办公',
    brand: 'onlead',
    brandName: '欧林',
    category: '智能升降桌',
    features: ['电动升降', '记忆高度', '静音电机', '健康办公'],
    mainImage: '/images/products/smart-desk.jpg',
    tags: ['智能化', '健康办公', '电动升降', '员工办公区'],
    isFeatured: true,
    isNew: true
  },
  {
    id: 'prod-onlead-002',
    name: 'Conference Master 智能会议桌',
    description: '集成多媒体设备，智能控制，专业会议解决方案',
    brand: 'onlead',
    brandName: '欧林',
    category: '智能会议桌',
    features: ['多媒体集成', '智能控制', '专业会议', '线缆管理'],
    mainImage: '/images/products/conference-table.jpg',
    tags: ['智能化', '多媒体', '专业会议', '会议室'],
    isFeatured: true,
    isNew: false
  },

  // 欧美斯 - 健康办公
  {
    id: 'prod-onmuse-001',
    name: 'ErgoPro 人体工学办公椅',
    description: '德国设计人体工学椅，全方位调节，全天候舒适支撑',
    brand: 'onmuse',
    brandName: '欧美斯',
    category: '人体工学办公椅',
    features: ['多角度调节', '透气网布', '腰椎支撑', '头枕可调'],
    mainImage: '/images/products/ergo-chair.jpg',
    tags: ['人体工学', '健康办公', '现代设计', '员工办公区'],
    isFeatured: true,
    isNew: true
  },
  {
    id: 'prod-onmuse-002',
    name: 'Health Series 健康配件',
    description: '健康办公配件套装，包括脚踏板、显示器支架等',
    brand: 'onmuse',
    brandName: '欧美斯',
    category: '健康办公配件',
    features: ['脚踏板', '显示器支架', '腕托', '健康套装'],
    mainImage: '/images/products/health-accessories.jpg',
    tags: ['健康办公', '配件套装', '现代设计', '员工办公区'],
    isFeatured: false,
    isNew: true
  },

  // 上海诗敏 - 教育专业
  {
    id: 'prod-seewin-001',
    name: 'EduClass 学生课桌椅',
    description: '教育专用课桌椅，耐用安全，符合人体工学',
    brand: 'seewin',
    brandName: '上海诗敏',
    category: '学生课桌椅',
    features: ['教育专用', '耐用安全', '人体工学', '批量采购'],
    mainImage: '/images/products/student-desk.jpg',
    tags: ['教育专用', '耐用安全', '批量采购', '培训教室'],
    isFeatured: true,
    isNew: false
  },
  {
    id: 'prod-seewin-002',
    name: 'Teacher Station 教师讲台',
    description: '多功能教师讲台，集成存储，移动便捷',
    brand: 'seewin',
    brandName: '上海诗敏',
    category: '教师讲台',
    features: ['多功能设计', '集成存储', '移动便捷', '教育专用'],
    mainImage: '/images/products/teacher-desk.jpg',
    tags: ['教育专用', '多功能', '移动便捷', '培训教室'],
    isFeatured: false,
    isNew: true
  }
];

// 品牌数据
export const brands = [
  { id: 'matsu', name: '玛祖铭立', description: '高端办公家具领军品牌' },
  { id: 'onlead', name: '欧林', description: '智能办公解决方案提供商' },
  { id: 'onmuse', name: '欧美斯', description: '现代健康办公理念倡导者' },
  { id: 'seewin', name: '上海诗敏', description: '教育专业家具解决方案' }
];

// 分类数据
export const categories = [
  { id: 'executive-desk', name: '高管办公桌', count: 1 },
  { id: 'partition-system', name: '办公屏风系统', count: 1 },
  { id: 'smart-desk', name: '智能升降桌', count: 1 },
  { id: 'conference-table', name: '智能会议桌', count: 1 },
  { id: 'ergo-chair', name: '人体工学办公椅', count: 1 },
  { id: 'health-accessories', name: '健康办公配件', count: 1 },
  { id: 'student-desk', name: '学生课桌椅', count: 1 },
  { id: 'teacher-desk', name: '教师讲台', count: 1 }
];

// 标签数据
export const tags = [
  { id: 'high-end', name: '高端定制', count: 1 },
  { id: 'smart', name: '智能化', count: 2 },
  { id: 'ergonomic', name: '人体工学', count: 2 },
  { id: 'education', name: '教育专用', count: 2 },
  { id: 'health', name: '健康办公', count: 2 },
  { id: 'german-design', name: '德国设计', count: 2 },
  { id: 'bulk-purchase', name: '批量采购', count: 1 }
];
