// 🏷️ 统一产品数据模型

export interface ProductBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
  strengths: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  level: number; // 1: 一级分类, 2: 二级分类, 3: 三级分类
}

export interface ProductFeature {
  id: string;
  name: string;
  value: string;
  icon?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  type: 'main' | 'detail' | 'scene' | '360';
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  attributes: {
    color?: string;
    size?: string;
    material?: string;
    configuration?: string;
  };
  images: ProductImage[];
}

export interface UnifiedProduct {
  // 基础信息
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  
  // 品牌信息
  brandId: string;
  originalBrand: string; // 原始品牌名称
  brandTags: string[];   // 品牌特性标签
  
  // 分类信息
  categoryIds: string[];
  applicationTags: string[]; // 应用场景标签
  featureTags: string[];     // 产品特性标签
  
  // 产品特性
  features: ProductFeature[];
  specifications: Record<string, string>;
  
  // 媒体资源
  mainImage: string;
  images: ProductImage[];
  variants: ProductVariant[];
  
  // 展示信息
  displayPriority: number; // 1-10, 数字越小优先级越高
  isFeatured: boolean;     // 是否推荐产品
  isNew: boolean;          // 是否新品
  
  // 咨询信息
  inquiryTypes: string[];  // 支持的咨询类型
  leadTime: string;        // 交货周期
  warranty: string;        // 保修信息
  
  // 元数据
  createdAt: string;
  updatedAt: string;
  sourceBrand: 'matsu' | 'onlead' | 'onmuse' | 'seewin';
}

export interface ProductCollection {
  id: string;
  name: string;
  description: string;
  products: UnifiedProduct[];
  coverImage: string;
  theme: string; // 主题色或风格
}

export interface SolutionPackage {
  id: string;
  name: string;
  description: string;
  targetCustomer: string;
  products: UnifiedProduct[];
  caseStudies: string[]; // 关联的案例ID
  benefits: string[];
}

// 品牌数据
export const BRANDS: ProductBrand[] = [
  {
    id: 'matsu',
    name: '玛祖铭立',
    logo: '/brands/matsu-logo.svg',
    description: '高端办公家具领军品牌，德国合作背景，极致设计品质',
    strengths: ['高端设计', '德国品质', '国际化', '精致细节']
  },
  {
    id: 'onlead', 
    name: '欧林',
    logo: '/brands/onlead-logo.svg',
    description: '智能办公和商用空间整体解决方案提供商',
    strengths: ['智能化', '解决方案', '专业领域', '系统集成']
  },
  {
    id: 'onmuse',
    name: '欧美斯',
    logo: '/brands/onmuse-logo.svg',
    description: '现代健康办公理念，创意空间设计专家',
    strengths: ['健康办公', '现代设计', '色彩个性化', '用户体验']
  },
  {
    id: 'seewin',
    name: '上海诗敏',
    logo: '/brands/seewin-logo.svg',
    description: '教育专业家具和设备解决方案提供商',
    strengths: ['教育专业', '耐用安全', '批量采购', '功能实用']
  }
];

// 产品分类数据
export const CATEGORIES: ProductCategory[] = [
  // 一级分类
  { id: 'cat-1', name: '办公座椅系列', description: '各类办公座椅产品', level: 1 },
  { id: 'cat-2', name: '办公桌系列', description: '各类办公桌产品', level: 1 },
  { id: 'cat-3', name: '存储解决方案', description: '文件柜和存储系统', level: 1 },
  { id: 'cat-4', name: '空间解决方案', description: '屏风和隔断系统', level: 1 },
  { id: 'cat-5', name: '专业领域家具', description: '特定行业家具', level: 1 },
  
  // 二级分类 - 办公座椅
  { id: 'cat-1-1', name: '人体工学办公椅', description: '健康办公座椅', parentId: 'cat-1', level: 2 },
  { id: 'cat-1-2', name: '高管办公椅', description: '高端管理座椅', parentId: 'cat-1', level: 2 },
  { id: 'cat-1-3', name: '会议培训椅', description: '会议和培训用椅', parentId: 'cat-1', level: 2 },
  
  // 二级分类 - 办公桌
  { id: 'cat-2-1', name: '高管办公桌', description: '高端管理办公桌', parentId: 'cat-2', level: 2 },
  { id: 'cat-2-2', name: '员工办公桌', description: '普通员工办公桌', parentId: 'cat-2', level: 2 },
  { id: 'cat-2-3', name: '升降办公桌', description: '电动升降办公桌', parentId: 'cat-2', level: 2 },
  
  // 三级分类 - 示例
  { id: 'cat-1-1-1', name: '网布人体工学椅', description: '透气网布材质', parentId: 'cat-1-1', level: 3 },
  { id: 'cat-1-1-2', name: '皮质人体工学椅', description: '高级皮质材质', parentId: 'cat-1-1', level: 3 }
];

// 应用场景标签
export const APPLICATION_TAGS = [
  '高管办公室', '员工办公区', '会议室', '培训教室', '公共空间',
  '接待区', '休闲区', '专注工作区', '协作空间', '多功能厅'
];

// 产品特性标签  
export const FEATURE_TAGS = [
  '人体工学', '智能化', '模块化', '定制化', '批量采购',
  '健康办公', '环保材料', '快速安装', '易维护', '多功能'
];
