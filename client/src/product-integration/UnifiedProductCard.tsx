// 🏷️ 统一产品卡片组件 - 整合四个品牌产品展示
import React from 'react';

interface UnifiedProductCardProps {
  product: {
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
  };
  onInquire: (productId: string, inquiryType: string) => void;
  onViewDetails: (productId: string) => void;
}

const UnifiedProductCard: React.FC<UnifiedProductCardProps> = ({
  product,
  onInquire,
  onViewDetails
}) => {
  // 品牌颜色配置
  const brandColors = {
    matsu: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-50'
    },
    onlead: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      hover: 'hover:bg-green-50'
    },
    onmuse: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-50'
    },
    seewin: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-50'
    }
  };

  const colors = brandColors[product.brand];

  return (
    <div className={`unified-product-card group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${colors.border} ${colors.hover}`}>
      {/* 产品头部 - 品牌标识和图片 */}
      <div className="product-header relative">
        {/* 品牌标签 */}
        <div className="absolute top-4 left-4 z-10">
          <div className={`brand-tag px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
            {product.brandName}
          </div>
        </div>

        {/* 新品标签 */}
        {product.isNew && (
          <div className="absolute top-4 right-4 z-10">
            <div className="new-tag bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              新品
            </div>
          </div>
        )}

        {/* 推荐标签 */}
        {product.isFeatured && (
          <div className="absolute top-12 right-4 z-10">
            <div className="featured-tag bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              推荐
            </div>
          </div>
        )}

        {/* 产品图片 */}
        <div className="product-image-container h-64 overflow-hidden">
          <img 
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* 悬浮效果层 */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>
      </div>

      {/* 产品内容 */}
      <div className="product-content p-6">
        {/* 产品分类 */}
        <div className="product-category mb-2">
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>

        {/* 产品名称 */}
        <h3 className="product-name text-lg font-bold text-gray-900 mb-3 line-clamp-1">
          {product.name}
        </h3>

        {/* 产品描述 */}
        <p className="product-description text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* 产品特点 */}
        {product.features.length > 0 && (
          <div className="product-features mb-4">
            <h4 className="features-title text-xs font-semibold text-gray-500 mb-2">产品特点</h4>
            <ul className="features-list space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center text-xs text-gray-700">
                  <svg className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="truncate">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 产品标签 */}
        {product.tags.length > 0 && (
          <div className="product-tags mb-4">
            <div className="tags-container flex flex-wrap gap-1">
              {product.tags.slice(0, 4).map((tag, index) => (
                <span 
                  key={index}
                  className="tag bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="product-actions flex gap-3">
          <button
            onClick={() => onViewDetails(product.id)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300 text-sm"
          >
            查看详情
          </button>
          <button
            onClick={() => onInquire(product.id, 'product')}
            className={`flex-1 ${colors.bg} ${colors.text} py-2 rounded-lg font-medium hover:opacity-90 transition-opacity duration-300 text-sm`}
          >
            立即咨询
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedProductCard;
