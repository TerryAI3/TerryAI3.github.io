import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

// 几何图形风格的产品分类图标
const CategoryIcons = {
  Chair: () => (
    <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#3E9FFF" />
      {/* 椅子几何图形 */}
      <rect x="35" y="25" width="30" height="20" fill="none" stroke="#fff" strokeWidth="2" />
      <rect x="30" y="45" width="40" height="3" fill="#fff" />
      <line x1="35" y1="48" x2="35" y2="65" stroke="#fff" strokeWidth="2" />
      <line x1="65" y1="48" x2="65" y2="65" stroke="#fff" strokeWidth="2" />
    </svg>
  ),
  Table: () => (
    <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#3E9FFF" />
      {/* 办公会议桌几何图形 */}
      <rect x="20" y="30" width="60" height="25" fill="none" stroke="#fff" strokeWidth="2" />
      <line x1="30" y1="55" x2="30" y2="70" stroke="#fff" strokeWidth="2" />
      <line x1="70" y1="55" x2="70" y2="70" stroke="#fff" strokeWidth="2" />
    </svg>
  ),
  Storage: () => (
    <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#3E9FFF" />
      {/* 存储柜几何图形 */}
      <rect x="30" y="25" width="40" height="50" fill="none" stroke="#fff" strokeWidth="2" />
      <line x1="30" y1="40" x2="70" y2="40" stroke="#fff" strokeWidth="2" />
      <line x1="30" y1="55" x2="70" y2="55" stroke="#fff" strokeWidth="2" />
    </svg>
  ),
  Space: () => (
    <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#3E9FFF" />
      {/* 空间支持几何图形 */}
      <polygon points="50,20 70,35 70,65 50,75 30,65 30,35" fill="none" stroke="#fff" strokeWidth="2" />
      <circle cx="50" cy="50" r="8" fill="#fff" />
    </svg>
  ),
};

export default function Home() {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: cases = [] } = trpc.cases.list.useQuery();
  
  const heroImages = [
    "/images/hero-1.jpg",
    "/images/hero-2.jpg",
    "/images/hero-3.jpg"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const productCategories = [
    { icon: CategoryIcons.Chair, name: "座椅", nameEn: "Seating" },
    { icon: CategoryIcons.Table, name: "办公会议桌", nameEn: "Desks & Tables" },
    { icon: CategoryIcons.Storage, name: "存储", nameEn: "Storage" },
    { icon: CategoryIcons.Space, name: "空间支持", nameEn: "Space Solutions" },
  ];

  const featuredProducts = [
    {
      name: "黎明",
      nameEn: "Dawn",
      image: "/images/products/office-workstation.webp",
    },
    {
      name: "杰瑞",
      nameEn: "Jerry",
      image: "/images/products/ergonomic-chair.webp",
    },
    {
      name: "光芒",
      nameEn: "Sunshine",
      image: "/images/products/meeting-table.webp",
    },
    {
      name: "诺拉",
      nameEn: "Neola",
      image: "/images/products/student-desk.webp",
    },
  ];

  const projects = [
    {
      name: "科技企业总部",
      image: "/images/hero-office.jpg",
    },
    {
      name: "金融机构办公空间",
      image: "/images/hero-office.jpg",
    },
    {
      name: "教育机构图书馆",
      image: "/images/hero-office.jpg",
    },
    {
      name: "联合办公空间",
      image: "/images/hero-office.jpg",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Banner - Minimalist Design with Carousel */}
      <section className="relative w-full h-[600px] overflow-hidden">
        {/* Image Carousel */}
        <div className="absolute inset-0 w-full h-full">
          {heroImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Office Space ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30 z-5"></div>
        
        {/* Carousel Indicators - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Logo - Top Left */}
        <div className="absolute top-6 lg:top-10 left-6 lg:left-8 z-20">
          <img src="/images/logo-zuodi.png" alt="ZUODI 佐迪" className="h-10 lg:h-14 xl:h-18 w-auto object-contain" />
        </div>
        
        {/* Text Overlay - Bottom Left */}
        <div className="absolute bottom-8 lg:bottom-16 left-8 lg:left-16 z-10">
          <p className="text-white text-lg lg:text-2xl font-light leading-relaxed max-w-md">
            办公空间解决方案专家
          </p>
        </div>
        
        {/* NEW PRODUCT Badge - Top Right */}
        <div className="absolute top-6 right-6 bg-orange-500 text-white px-5 py-2.5 font-bold text-sm tracking-wider z-30 rounded-sm shadow-lg">
          NEW PRODUCT
        </div>
      </section>

      {/* Brand Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="text-sm font-bold text-gray-500 tracking-wider">
                【SINCE 2010】
              </div>
              <p className="text-gray-700 leading-relaxed">
                佐迪智能家具成立于2010年，专注于为企业提供高品质的办公家具解决方案。我们致力于通过创新设计和精湛工艺，打造舒适、高效的工作环境。
              </p>
              <p className="text-gray-700 leading-relaxed">
                多年来，佐迪始终坚持以客户需求为导向，不断推出符合现代办公理念的产品系列。从人体工学座椅到智能办公桌，从会议系统到存储解决方案，我们为各类企业提供全方位的办公空间配置服务。
              </p>
            </div>
            <div className="text-center lg:text-right">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Inspiring Office Lifestyle
              </h2>
              <p className="text-gray-600 text-lg">
                创造激发灵感的办公生活方式
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              产品 <span className="text-gray-400">CATEGORIES</span>
            </h2>
          </div>
          {/* Product Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {productCategories.map((category, idx) => {
              const IconComponent = category.icon;
              return (
              <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <IconComponent />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.nameEn}</p>
              </div>
            );
            })}
          </div>

          {/* Featured Products */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-8">精选产品</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <div key={idx} className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.nameEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              成功 <span className="text-gray-400">CASES</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(cases.length > 0 ? cases : projects).map((project: any, idx: number) => (
              <div key={idx} className="group relative h-64 overflow-hidden rounded-lg">
                <img src={project.mainImage || project.image} alt={project.title || project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-end p-6">
                  <h3 className="text-white font-bold text-lg">{project.title || project.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">准备升级您的办公空间？</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            联系我们的专业团队，为您打造完美的办公环境解决方案
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
              获取报价
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
