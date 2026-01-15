import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Briefcase, Archive, Grid3x3 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroImages = [
    "/images/hero-office-new.jpg",
    "/images/hero-carousel-1.jpg",
    "/images/hero-carousel-2.jpg"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const productCategories = [
    { icon: Briefcase, name: "座椅", nameEn: "Seating" },
    { icon: Package, name: "办公会议桌", nameEn: "Desks & Tables" },
    { icon: Archive, name: "存储", nameEn: "Storage" },
    { icon: Grid3x3, name: "空间支持", nameEn: "Space Solutions" },
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
      {/* Hero Banner - Artistic Design with Carousel */}
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
        
        {/* Carousel Indicators - Bottom Center */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
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
        
        {/* NEW PRODUCT Badge - Top Right */}
        <div className="absolute top-6 right-6 bg-orange-500 text-white px-5 py-2.5 font-bold text-sm tracking-wider z-30 rounded-sm shadow-lg">
          NEW PRODUCT
        </div>
        
        {/* Artistic Orange Overlay - Bold geometric design with hover animation */}
        <div className="absolute left-0 top-0 h-full z-10 group" style={{ width: '45%' }}>
          {/* Main orange shape - dynamic angular design */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff7b3d" />
                <stop offset="40%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#dc5a0c" />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="8" dy="8" stdDeviation="15" floodOpacity="0.35"/>
              </filter>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Primary bold graffiti shape */}
            <path 
              d="M 0 0 L 380 0 C 420 80 400 180 340 280 C 380 380 320 480 240 580 L 180 600 L 0 600 Z" 
              fill="url(#orangeGradient)"
              filter="url(#shadow)"
              className="transition-transform duration-700 ease-out group-hover:translate-x-1"
            />
            
            {/* Secondary flowing layer */}
            <path 
              d="M 0 0 L 300 0 C 350 60 340 140 290 220 C 320 300 280 400 200 500 C 150 560 80 590 0 600 Z" 
              fill="#f97316"
              opacity="0.65"
              className="transition-transform duration-500 ease-out group-hover:-translate-x-1"
            />
            
            {/* Graffiti splatter blobs - with hover animations */}
            <ellipse cx="400" cy="100" rx="40" ry="32" fill="#ff7b3d" opacity="0.75" filter="url(#glow)" className="transition-all duration-500 ease-out group-hover:translate-x-3 group-hover:-translate-y-2" />
            <ellipse cx="360" cy="220" rx="28" ry="22" fill="#f97316" opacity="0.6" transform="rotate(-15 360 220)" className="transition-all duration-600 ease-out group-hover:-translate-x-2 group-hover:translate-y-3" />
            <ellipse cx="320" cy="380" rx="35" ry="25" fill="#ea580c" opacity="0.55" transform="rotate(10 320 380)" className="transition-all duration-700 ease-out group-hover:translate-x-4 group-hover:translate-y-2" />
            <ellipse cx="260" cy="520" rx="30" ry="35" fill="#ff7b3d" opacity="0.6" transform="rotate(-20 260 520)" className="transition-all duration-500 ease-out group-hover:-translate-x-3 group-hover:-translate-y-2" />
            
            {/* Paint drips */}
            <path d="M 340 280 Q 355 330 348 380 Q 340 420 335 450" stroke="#f97316" strokeWidth="8" fill="none" opacity="0.5" strokeLinecap="round" className="transition-all duration-600 ease-out group-hover:translate-y-2" />
            <path d="M 240 580 Q 255 590 250 600" stroke="#ff7b3d" strokeWidth="10" fill="none" opacity="0.6" strokeLinecap="round" className="transition-all duration-500 ease-out group-hover:translate-y-1" />
            
            {/* Scattered dots - with hover animations */}
            <circle cx="430" cy="60" r="12" fill="#ff7b3d" opacity="0.5" className="transition-all duration-400 ease-out group-hover:translate-x-2 group-hover:-translate-y-1" />
            <circle cx="420" cy="160" r="8" fill="#f97316" opacity="0.4" className="transition-all duration-500 ease-out group-hover:-translate-x-1 group-hover:translate-y-2" />
            <circle cx="380" cy="300" r="10" fill="#ea580c" opacity="0.45" className="transition-all duration-600 ease-out group-hover:translate-x-3 group-hover:translate-y-1" />
            <circle cx="340" cy="460" r="14" fill="#ff7b3d" opacity="0.5" className="transition-all duration-500 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2" />
            <circle cx="300" cy="560" r="9" fill="#f97316" opacity="0.4" className="transition-all duration-400 ease-out group-hover:translate-x-1 group-hover:translate-y-1" />
            
            {/* Tiny spray dots - with subtle hover animations */}
            <circle cx="450" cy="80" r="4" fill="#ff7b3d" opacity="0.35" className="transition-all duration-300 ease-out group-hover:translate-x-1" />
            <circle cx="440" cy="140" r="3" fill="#f97316" opacity="0.3" className="transition-all duration-400 ease-out group-hover:-translate-y-1" />
            <circle cx="400" cy="260" r="5" fill="#ea580c" opacity="0.35" className="transition-all duration-350 ease-out group-hover:translate-x-1 group-hover:translate-y-1" />
            <circle cx="370" cy="420" r="4" fill="#ff7b3d" opacity="0.3" className="transition-all duration-450 ease-out group-hover:-translate-x-1" />
            <circle cx="320" cy="540" r="5" fill="#f97316" opacity="0.35" className="transition-all duration-300 ease-out group-hover:translate-y-1" />
            
            {/* Decorative brush strokes */}
            <path d="M 50 90 Q 120 80 200 95 Q 260 85 300 100" stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none" strokeLinecap="round" className="transition-all duration-500 ease-out group-hover:translate-x-2" />
            <path d="M 30 510 Q 100 500 160 515" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" strokeLinecap="round" className="transition-all duration-400 ease-out group-hover:-translate-x-1" />
          </svg>
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-12 py-16">
            {/* Decorative top line */}
            <div className="w-16 h-1 bg-white/40 mb-8"></div>
            
            <h1 className="text-white text-4xl lg:text-5xl xl:text-6xl font-black mb-8 leading-none tracking-tight">
              <span className="block" style={{ fontStyle: 'italic' }}>SMART</span>
              <span className="block" style={{ fontStyle: 'italic' }}>OFFICE</span>
              <span className="block text-orange-200" style={{ fontStyle: 'italic' }}>FUTURE</span>
              <span className="block" style={{ fontStyle: 'italic' }}>DESIGN</span>
            </h1>

            <p className="text-white/80 text-sm lg:text-base mb-4 font-light leading-relaxed max-w-xs">
              智能办公空间解决方案专家
            </p>

            <p className="text-white font-bold text-lg lg:text-xl tracking-wide">
              ZUODI<span className="text-orange-200 ml-2">佐迪</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a href="#products" className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-6 py-3 font-bold text-sm hover:bg-orange-50 transition-all shadow-lg">
                浏览产品
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#contact" className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white px-6 py-3 font-semibold text-sm hover:bg-white/10 transition-all">
                获取报价
              </a>
            </div>
          </div>
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
            {productCategories.map((category, idx) => (
              <div key={idx} className="text-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <div className="flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <category.icon className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.nameEn}</p>
              </div>
            ))}
          </div>
          {/* Featured Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <Link key={idx} href="/products">
                <a className="group block bg-white overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-500">{product.nameEn}</p>
                  </div>
                </a>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products">
              <a className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-800 text-gray-800 font-semibold hover:bg-gray-800 hover:text-white transition-colors">
                浏览更多 <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>
      {/* Projects Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              案例 <span className="text-gray-400">PROJECTS</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <Link key={idx} href="/cases">
                <a className="group block relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <h3 className="text-white text-2xl font-semibold">
                      {project.name}
                    </h3>
                  </div>
                </a>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/cases">
              <a className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-800 text-gray-800 font-semibold hover:bg-gray-800 hover:text-white transition-colors">
                浏览更多 <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              联系我们
            </h2>
            <p className="text-gray-600 text-lg mb-12">
              欢迎咨询产品信息或预约展厅参观
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  联系方式
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>电话：400-XXX-XXXX</p>
                  <p>邮箱：info@zuodi.com</p>
                  <p>地址：中国·深圳</p>
                </div>
              </div>
              <div className="bg-white p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  工作时间
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p>周一至周五：8:00-18:00</p>
                  <p>周六：8:00-12:00</p>
                  <p>周日及法定节假日休息</p>
                </div>
              </div>
            </div>
            <Button
              size="lg"
              className="px-12 py-6 text-lg"
              onClick={() => window.location.href = '#contact'}
            >
              获取报价
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
