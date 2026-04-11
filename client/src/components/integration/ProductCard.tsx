// 🪑 产品卡片组件 - 玛祖铭立高端风格 + 欧美斯现代设计
import React from 'react';

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl: string;
  category?: string;
  features?: string[];
  onInquire?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  imageUrl,
  category,
  features = [],
  onInquire
}) => {
  return (
    <div className="product-card group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* 产品图片 - 玛祖铭立高品质展示 */}
      <div className="product-image-container relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="product-image w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* 产品分类标签 - 欧林专业分类 */}
        {category && (
          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            {category}
          </div>
        )}
        
        {/* 悬浮效果层 - 欧美斯现代交互 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button 
            onClick={onInquire}
            className="inquire-button bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-300 transform translate-y-4 group-hover:translate-y-0"
          >
            咨询详情
          </button>
        </div>
      </div>

      {/* 产品内容 - 欧美斯现代设计 */}
      <div className="product-content p-6">
        <h3 className="product-title text-xl font-bold text-gray-900 mb-3">
          {title}
        </h3>
        
        <p className="product-description text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        {/* 产品特点 - 欧林专业展示 */}
        {features.length > 0 && (
          <div className="product-features mb-4">
            <h4 className="features-title text-sm font-semibold text-gray-500 mb-2">产品特点</h4>
            <ul className="features-list space-y-1">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-accent-teal rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 咨询按钮 - 上海诗敏专业咨询 */}
        <div className="product-actions pt-4 border-t border-gray-100">
          <button 
            onClick={onInquire}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            立即咨询
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
