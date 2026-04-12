// 🚀 主应用组件 - 四大品牌整合网站
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import IntelligencePage from './pages/Intelligence';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        {/* 导航栏 */}
        <nav className="navbar bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <div className="text-2xl font-bold text-primary">
                  佐迪家具
                </div>
                <div className="ml-2 text-sm text-gray-500 hidden sm:block">
                  智能智造
                </div>
              </Link>

              {/* 导航链接 */}
              <div className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium">
                  首页
                </Link>
                <Link to="/products" className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium">
                  产品中心
                </Link>
                <Link to="/intelligence" className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium">
                  数字情报
                </Link>
                <Link to="/cases" className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium">
                  案例展示
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium">
                  联系我们
                </Link>
              </div>

              {/* 移动端菜单按钮 */}
              <button className="md:hidden text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* 咨询按钮 */}
              <button className="hidden md:block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-300">
                立即咨询
              </button>
            </div>
          </div>
        </nav>

        {/* 主要内容 */}
        <main className="main-content min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            {/* 可以添加更多路由 */}
            <Route path="*" element={
              <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">页面未找到</p>
                <Link 
                  to="/" 
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-300"
                >
                  返回首页
                </Link>
              </div>
            } />
          </Routes>
        </main>

        {/* 页脚 */}
        <footer className="footer bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* 品牌介绍 */}
              <div>
                <h3 className="text-xl font-bold mb-4">佐迪家具</h3>
                <p className="text-gray-400 text-sm">
                  整合四大品牌优势，提供一站式办公家具解决方案
                </p>
                <div className="mt-4 flex space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                    M
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
                    O
                  </div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                    O
                  </div>
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
                    S
                  </div>
                </div>
              </div>

              {/* 四大品牌 */}
              <div>
                <h4 className="font-semibold mb-4 text-lg">四大品牌</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    玛祖铭立 - 高端国际化
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    欧林 - 智能专业
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    欧美斯 - 现代健康
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    上海诗敏 - 教育专业
                  </li>
                </ul>
              </div>

              {/* 快速链接 */}
              <div>
                <h4 className="font-semibold mb-4 text-lg">快速链接</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300">
                      首页
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="text-gray-400 hover:text-white transition-colors duration-300">
                      产品中心
                    </Link>
                  </li>
                  <li>
                    <Link to="/cases" className="text-gray-400 hover:text-white transition-colors duration-300">
                      案例展示
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">
                      联系我们
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 联系我们 */}
              <div>
                <h4 className="font-semibold mb-4 text-lg">联系我们</h4>
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>400-123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>contact@zuodii.com</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>上海市办公家具中心</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 版权信息 */}
            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
              <p>© 2026 佐迪家具 - 四大品牌整合解决方案. 保留所有权利.</p>
              <p className="mt-2">玛祖铭立·欧林·欧美斯·上海诗敏 联合展示</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;