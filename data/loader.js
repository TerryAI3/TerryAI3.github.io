/**
 * 静态数据加载器
 * 用于在 GitHub Pages 环境中加载本地 JSON 数据
 */

// 全局数据缓存
window.__ZUODII_DATA_CACHE__ = {
  products: null,
  categories: null,
  loaded: false
};

/**
 * 加载产品数据
 */
async function loadProductsData() {
  if (window.__ZUODII_DATA_CACHE__.loaded) {
    return window.__ZUODII_DATA_CACHE__;
  }

  try {
    const response = await fetch('/data/products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    window.__ZUODII_DATA_CACHE__.products = data.products || [];
    window.__ZUODII_DATA_CACHE__.categories = data.categories || [];
    window.__ZUODII_DATA_CACHE__.loaded = true;
    
    console.log('[ZUODII] 产品数据加载成功:', data.products.length, '个产品');
    return window.__ZUODII_DATA_CACHE__;
  } catch (error) {
    console.error('[ZUODII] 产品数据加载失败:', error);
    // 返回空数据，防止应用崩溃
    return {
      products: [],
      categories: [],
      loaded: false,
      error: error.message
    };
  }
}

/**
 * 获取所有产品
 */
function getProducts() {
  return window.__ZUODII_DATA_CACHE__.products || [];
}

/**
 * 获取单个产品
 */
function getProduct(id) {
  const products = getProducts();
  return products.find(p => p.id === id);
}

/**
 * 获取分类
 */
function getCategories() {
  return window.__ZUODII_DATA_CACHE__.categories || [];
}

/**
 * 按分类获取产品
 */
function getProductsByCategory(categoryId) {
  const products = getProducts();
  return products.filter(p => {
    const category = getCategories().find(c => c.id === categoryId);
    return category && p.category === category.name;
  });
}

// 页面加载时自动加载数据
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProductsData);
} else {
  loadProductsData();
}

// 导出供其他脚本使用
window.ZUODII = {
  loadProductsData,
  getProducts,
  getProduct,
  getCategories,
  getProductsByCategory
};
