// 🏠 首页 - 四大品牌整合展示
import React from 'react';
import { Link } from 'react-router-dom';
import { sampleProducts } from '../data/sample-products';
import UnifiedProductCard from '../product-integration/UnifiedProductCard';

const HomePage: React.FC = () => {
  // 获取推荐产品
  const featuredProducts = sampleProducts.filter(p => p.isFeatured).slice(0, 6);
  
  // 获取新品
  const newProducts = sampleProducts.filter(p => p.isNew).slice(0, 3);

  const handleInquire = (productId: string, inquiryType: string) => {
    console.log('咨询产品:', productId, inquiryType);
    alert(`咨询产品: ${productId}, 类型: ${inquiryType}`);
  };

  const handleViewDetails = (productId: string) => {
    console.log('查看产品详情:', productId);
    alert(`查看产品详情: ${productId}`);
  };

  return (
    <div className="home-page">
      {/* Hero 区域 */}
      <section className="hero-section bg-gradient-to-r from-primary to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              四大品牌整合，一站式办公家具解决方案
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              玛祖铭立·欧林·欧美斯·上海诗敏
              <br />
              高端、智能、健康、专业，满足所有办公需求
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 text-center"
              >
                浏览所有产品
              </Link>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-300">
                立即咨询
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 四大品牌介绍 */}
      <section className="brands-section py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            四大品牌优势整合
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* 玛祖铭立 */}
            <div className="brand-card bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">M</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">玛祖铭立</h3>
              <p className="text-gray-600 mb-4">高端国际化，德国品质</p>
              <ul className="text-sm text-gray-500 space-y-1 text-left">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  高端设计品质
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  德国合作背景
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  国际化视觉
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  精致细节处理
                </li>
              </ul>
            </div>

            {/* 欧林 */}
            <div className="brand-card bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">O</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">欧林</h3>
              <p className="text-gray-600 mb-4">智能专业，解决方案</p>
              <ul className="text-sm text-gray-500 space-y-1 text-left">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  智能化办公
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  专业领域覆盖
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  系统化设计
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  整体解决方案
                </li>
              </ul>
            </div>

            {/* 欧美斯 */}
            <div className="brand-card bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">O</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">欧美斯</h3>
              <p className="text-gray-600 mb-4">现代健康，创意设计</p>
              <ul className="text-sm text-gray-500 space-y-1 text-left">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  健康办公理念
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  现代设计风格
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  色彩个性化
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  创意空间设计
                </li>
              </ul>
            </div>

            {/* 上海诗敏 */}
            <div className="brand-card bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">S</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">上海诗敏</h3>
              <p className="text-gray-600 mb-4">教育专业，实用耐用</p>
              <ul className="text-sm text-gray-500 space-y-1 text-left">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  教育专业领域
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  耐用安全设计
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  功能实用性
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  批量采购方案
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 推荐产品 */}
      <section className="featured-products py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">推荐产品</h2>
              <p className="text-gray-600">四大品牌精选优质产品</p>
            </div>
            <Link
              to="/products"
              className="text-primary font-semibold hover:text-primary-dark transition-colors duration-300"
            >
              查看所有产品 →
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <UnifiedProductCard
                  key={product.id}
                  product={product}
                  onInquire={handleInquire}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">暂无推荐产品</p>
            </div>
          )}
        </div>
      </section>

      {/* 新品上市 */}
      {newProducts.length > 0 && (
        <section className="new-products py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">新品上市</h2>
                <p className="text-gray-600">最新产品，抢先体验</p>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></span>
                <span className="text-red-600 font-semibold">新品</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        新品
                      </div>
                    </div>
                    <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        product.brand === 'matsu' ? 'bg-blue-100 text-blue-800' :
                        product.brand === 'onlead' ? 'bg-green-100 text-green-800' :
                        product.brand === 'onmuse' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {product.brandName}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <button
                      onClick={() => handleInquire(product.id, 'new-product')}
                      className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-300"
                    >
                      咨询新品
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 联系我们 */}
      <section className="contact-section py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">专业咨询，定制解决方案</h2>
            <p className="text-lg mb-8 opacity-90">
              无论您需要高端定制、智能办公、健康环境还是专业教育家具，
              我们都能为您提供最适合的解决方案
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                立即咨询
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-300">
                400-123-4567
              </button>
            </div>
            <p className="text-sm opacity-75 mt-6">
              工作日 9:00-18:00，专业顾问随时为您服务
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
