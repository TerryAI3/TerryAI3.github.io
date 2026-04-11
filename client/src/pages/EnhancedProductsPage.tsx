// 🏷️ 增强产品页面 - 使用完整产品数据
import React, { useState, useMemo } from 'react';
import UnifiedProductCard from '../product-integration/UnifiedProductCard';
import ProductFilter from '../product-integration/ProductFilter';
import { enhancedProducts, brandStats, categoryStats, popularTags } from '../data/enhanced-products';

const EnhancedProductsPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState({
    selectedBrands: [] as string[],
    selectedCategories: [] as string[],
    selectedTags: [] as string[],
    searchQuery: '',
    sortBy: 'featured' as 'featured' | 'new' | 'name' | 'brand'
  });

  // 过滤和排序产品
  const filteredProducts = useMemo(() => {
    let filtered = [...enhancedProducts];
    
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
        p.tags.some(tag => tag.toLowerCase().includes(query)) ||
        p.brandName.toLowerCase().includes(query)
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

  // 准备筛选数据
  const brands = Object.entries(brandStats).map(([id, stats]) => ({
    id,
    name: stats.name,
    count: stats.count
  }));

  const categories = categoryStats.map(cat => ({
    id: cat.name,
    name: cat.name,
    count: cat.count
  }));

  const tags = popularTags.map(tag => ({
    id: tag.name,
    name: tag.name,
    count: tag.count
  }));

  return (
    <div className="enhanced-products-page min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            四大品牌完整产品库
          </h1>
          <p className="text-gray-600 text-lg">
            探索玛祖铭立、欧林、欧美斯、上海诗敏四大品牌共 {enhancedProducts.length} 款优质产品
          </p>
          
          {/* 品牌统计 */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(brandStats).map(([brandId, stats]) => (
              <div key={brandId} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{stats.name}</h3>
                    <p className="text-sm text-gray-500">{stats.count} 款产品</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    brandId === 'matsu' ? 'bg-blue-100 text-blue-600' :
                    brandId === 'onlead' ? 'bg-green-100 text-green-600' :
                    brandId === 'onmuse' ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    <span className="font-bold">{stats.name.charAt(0)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 筛选侧边栏 */}
          <div className="lg:col-span-1">
            <ProductFilter
              brands={brands}
              categories={categories}
              tags={tags}
              onFilterChange={handleFilterChange}
            />
            
            {/* 产品统计 */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">产品统计</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">总产品数</span>
                  <span className="font-semibold">{enhancedProducts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">推荐产品</span>
                  <span className="font-semibold text-green-600">
                    {enhancedProducts.filter(p => p.isFeatured).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">新品上市</span>
                  <span className="font-semibold text-red-600">
                    {enhancedProducts.filter(p => p.isNew).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">筛选结果</span>
                  <span className="font-semibold text-primary">{filteredProducts.length}</span>
                </div>
              </div>
            </div>

            {/* 热门分类 */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">热门分类</h3>
              <div className="space-y-2">
                {categories.slice(0, 6).map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleFilterChange({
                      ...activeFilters,
                      selectedCategories: [category.id]
                    })}
                    className="w-full flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                  >
                    <span className="text-gray-700">{category.name}</span>
                    <span className="text-gray-400 text-sm">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* 产品列表 */}
          <div className="lg:col-span-3">
            {/* 结果统计和操作 */}
            <div className="mb-6 bg-white rounded-xl shadow-sm p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-gray-700">
                    找到 <span className="font-bold text-primary text-xl">{filteredProducts.length}</span> 个产品
                    {activeFilters.selectedBrands.length > 0 && (
                      <span className="ml-2 text-sm text-gray-500">
                        （已筛选 {activeFilters.selectedBrands.length} 个品牌）
                      </span>
                    )}
                  </p>
                  {activeFilters.searchQuery && (
                    <p className="text-sm text-gray-500 mt-1">
                      搜索关键词: "{activeFilters.searchQuery}"
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500 hidden md:block">
                    四大品牌 • 专业选择 • 品质保证
                  </div>
                  <button
                    onClick={() => setActiveFilters({
                      selectedBrands: [],
                      selectedCategories: [],
                      selectedTags: [],
                      searchQuery: '',
                      sortBy: 'featured'
                    })}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                  >
                    重置筛选
                  </button>
                </div>
              </div>
            </div>
            
            {/* 产品网格 */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="text-gray-400 mb-6">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">没有找到符合条件的产品</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  请尝试调整筛选条件或搜索其他关键词。我们拥有四大品牌丰富产品线，一定能满足您的需求。
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setActiveFilters({
                      selectedBrands: [],
                      selectedCategories: [],
                      selectedTags: [],
                      searchQuery: '',
                      sortBy: 'featured'
                    })}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors duration-300"
                  >
                    查看所有产品
                  </button>
                  <button
                    onClick={() => setActiveFilters({
                      ...activeFilters,
                      searchQuery: '办公椅'
                    })}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300"
                  >
                    搜索办公椅
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 产品网格 */}
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
                
                {/* 分页信息 */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    显示 {Math.min(filteredProducts.length, 9)} 个产品，共 {filteredProducts.length} 个
                  </p>
                  {filteredProducts.length > 9 && (
                    <button className="mt-4 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300">
                      加载更多产品
                    </button>
                  )}
                </div>
              </>
            )}
            
            {/* 品牌优势总结 */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">四大品牌整合优势</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 品牌特色 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">品牌特色</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-bold">M</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">玛祖铭立</h4>
                        <p className="text-sm text-gray-600">高端国际化，德国品质保证，精致细节处理</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-bold">O</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">欧林</h4>
                        <p className="text-sm text-gray-600">智能专业解决方案，系统化设计，专业领域覆盖</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-bold">O</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">欧美斯</h4>
                        <p className="text-sm text-gray-600">现代健康办公理念，创意空间设计，色彩个性化</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-bold">S</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">上海诗敏</h4>
                        <p className="text-sm text-gray-600">教育专业家具，耐用安全设计，批量采购方案</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 整合优势 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">整合优势</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">一站式采购，覆盖所有办公需求</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">专业选择，各品牌最优质产品</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">智能筛选，快速找到合适产品</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">品质保证，四大品牌联合背书</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">专业咨询，定制解决方案</span>
                    </li>
                  </ul