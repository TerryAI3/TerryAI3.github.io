// 🔍 产品筛选组件 - 统一产品筛选系统
import React, { useState } from 'react';

interface ProductFilterProps {
  brands: Array<{ id: string; name: string; count: number }>;
  categories: Array<{ id: string; name: string; count: number }>;
  tags: Array<{ id: string; name: string; count: number }>;
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  selectedBrands: string[];
  selectedCategories: string[];
  selectedTags: string[];
  searchQuery: string;
  sortBy: 'featured' | 'new' | 'name' | 'brand';
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  brands,
  categories,
  tags,
  onFilterChange
}) => {
  const [filters, setFilters] = useState<FilterState>({
    selectedBrands: [],
    selectedCategories: [],
    selectedTags: [],
    searchQuery: '',
    sortBy: 'featured'
  });

  const handleBrandToggle = (brandId: string) => {
    const newBrands = filters.selectedBrands.includes(brandId)
      ? filters.selectedBrands.filter(id => id !== brandId)
      : [...filters.selectedBrands, brandId];
    
    const newFilters = { ...filters, selectedBrands: newBrands };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.selectedCategories.includes(categoryId)
      ? filters.selectedCategories.filter(id => id !== categoryId)
      : [...filters.selectedCategories, categoryId];
    
    const newFilters = { ...filters, selectedCategories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagToggle = (tagId: string) => {
    const newTags = filters.selectedTags.includes(tagId)
      ? filters.selectedTags.filter(id => id !== tagId)
      : [...filters.selectedTags, tagId];
    
    const newFilters = { ...filters, selectedTags: newTags };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, searchQuery: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters: FilterState = {
      selectedBrands: [],
      selectedCategories: [],
      selectedTags: [],
      searchQuery: '',
      sortBy: 'featured'
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="product-filter bg-white rounded-xl shadow-md p-6">
      {/* 搜索框 */}
      <div className="search-section mb-6">
        <div className="relative">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="搜索产品..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
          <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 品牌筛选 */}
      <div className="brand-filter mb-6">
        <h3 className="filter-title text-sm font-semibold text-gray-700 mb-3">品牌</h3>
        <div className="brand-list space-y-2">
          {brands.map(brand => (
            <label key={brand.id} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.selectedBrands.includes(brand.id)}
                onChange={() => handleBrandToggle(brand.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {brand.name} <span className="text-gray-400">({brand.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="category-filter mb-6">
        <h3 className="filter-title text-sm font-semibold text-gray-700 mb-3">分类</h3>
        <div className="category-list space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.selectedCategories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {category.name} <span className="text-gray-400">({category.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 标签筛选 */}
      <div className="tag-filter mb-6">
        <h3 className="filter-title text-sm font-semibold text-gray-700 mb-3">特性</h3>
        <div className="tag-list flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => handleTagToggle(tag.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                filters.selectedTags.includes(tag.id)
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag.name} ({tag.count})
            </button>
          ))}
        </div>
      </div>

      {/* 排序选项 */}
      <div className="sort-filter mb-6">
        <h3 className="filter-title text-sm font-semibold text-gray-700 mb-3">排序</h3>
        <div className="sort-options grid grid-cols-2 gap-2">
          {[
            { id: 'featured', label: '推荐优先' },
            { id: 'new', label: '新品优先' },
            { id: 'name', label: '名称排序' },
            { id: 'brand', label: '品牌排序' }
          ].map(option => (
            <button
              key={option.id}
              onClick={() => handleSortChange(option.id as FilterState['sortBy'])}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                filters.sortBy === option.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 清除筛选 */}
      <div className="clear-filters">
        <button
          onClick={clearFilters}
          className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300"
        >
          清除所有筛选
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
