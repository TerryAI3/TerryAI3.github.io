// 🏷️ 产品展示页面 - 四大品牌整合展示
import React, { useState, useMemo } from 'react';
import UnifiedProductCard from '../product-integration/UnifiedProductCard';
import ProductFilter from '../product-integration/ProductFilter';
import { sampleProducts, brands, categories, tags } from '../data/sample-products';

const ProductsPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState({
    selectedBrands: [] as string[],
    selectedCategories: [] as string[],
    selectedTags: [] as string[],
    searchQuery: '',
    sortBy: 'featured' as 'featured' | 'new' | 'name' | 'brand'
  });

  // 过滤和排序产品
  const filteredProducts = useMemo(() => {
    let filtered = [...sampleProducts];
    
    // 品牌筛选
    if (activeFilters.selectedBrands.length > 0) {
      filtered = filtered.filter(p => 
        activeFilters.selectedBrands.includes(p.brand)
      );
    }
    
    // 分类筛选
    if (activeFilters.selectedCategories.length > 0) {
      filtered = filtered.filter(p => 
        activeFilters.selectedCategories.includes(p.category)
      );
    }
    
    // 标签筛选
    if (activeFilters.selectedTags.length > 0) {
      filtered = filtered.filter(p => 
        p.tags.some(tag => activeFilters.selectedTags.includes(tag))
      );
    }
    
    // 搜索筛选
    if (activeFilters.searchQuery) {
      const query = activeFilters.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // 排序
    switch (activeFilters.sortBy) {
      case 'featured':
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
      case 'new':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'brand':
        filtered.sort((a, b) => a.brandName.localeCompare(b.brandName));
        break;
    }
    
    return filtered;
  }, [activeFilters]);

  const handleInquire = (productId: string, inquiryType: string) => {
    console.log('咨询产品:', productId, inquiryType);
    // 这里可以跳转到咨询页面或打开咨询对话框
    alert(`咨询产品: ${productId}, 类型: ${inquiryType}`);
  };

  const handleViewDetails = (productId: string) => {
    console.log('查看产品详情:', productId);
    // 这里可以跳转到产品详情页
    alert(`查看产品详情: ${productId}`);
  };

  const handleFilterChange = (filters: typeof activeFilters) => {
    setActiveFilters(filters);
  };

  return (
    <div className="products-page min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            四大品牌产品中心
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            整合玛祖铭立、欧林、欧美斯、上海诗敏四大品牌优质产品，
            为您提供一站式办公家具解决方案
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 筛选侧边栏 */}
          <div className="lg:col-span-1">
            <ProductFilter
              brands={brands.map(b => ({ ...b, count: sampleProducts.filter(p => p.brand === b.id).length }))}
              categories={categories}
              tags={tags}
              onFilterChange={handleFilterChange}
            />
            
            {/* 品牌介绍 */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">四大品牌介绍</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-blue-700">玛祖铭立</h4>
                  <p className="text-sm text-gray-600">高端办公家具领军品牌，德国合作背景</p>
                </div>
                <div>
                  <h4 className="font-medium text-green-700">欧林</h4>
                  <p className="text-sm text-gray-600">智能办公和商用空间整体解决方案</p>
                </div>
                <div>
                  <h4 className="font-medium text-purple-700">欧美斯</h4>
                  <p className="text-sm text-gray-600">现代健康办公理念，创意空间设计</p>
                </div>
                <div>
                  <h4 className="font-medium text-orange-700">上海诗敏</h4>
                  <p className="text-sm text-gray-600">教育专业家具和设备解决方案</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 产品列表 */}
          <div className="lg:col-span-3">
            {/* 结果统计 */}
            <div className="mb-6 bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">
                    找到 <span className="font-bold text-primary">{filteredProducts.length}</span> 个产品
                    {activeFilters.selectedBrands.length > 0 && (
                      <span className="ml-2 text-sm text-gray-500">
                        （已筛选品牌）
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  四大品牌 • 专业选择 • 品质保证
                </div>
              </div>
            </div>
            
            {/* 产品网格 */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-2">没有找到符合条件的产品</p>
                <p className="text-gray-400 text-sm">请尝试调整筛选条件或搜索关键词</p>
                <button
                  onClick={() => setActiveFilters({
                    selectedBrands: [],
                    selectedCategories: [],
                    selectedTags: [],
                    searchQuery: '',
                    sortBy: 'featured'
                  })}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
                >
                  清除所有筛选
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <UnifiedProductCard
                    key={product.id}
                    product={product}
                    onInquire={handleInquire}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
            
            {/* 品牌优势展示 */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">四大品牌整合优势</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">一站式采购，覆盖所有需求</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">各品牌最优质产品选择</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">专业咨询，定制解决方案</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">品质保证，知名品牌背书</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
