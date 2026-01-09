import { useAuth } from "@/_core/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Briefcase, Archive, Grid3x3 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

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
      {/* Hero Banner - Graffiti Art Style */}
      <section className="relative w-full h-[600px] overflow-hidden">
        {/* Full width background image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/hero-office-new.jpg"
            alt="Modern Office Space"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* NEW PRODUCT Badge - Top Right */}
        <div className="absolute top-6 right-6 bg-orange-500 text-white px-5 py-2.5 font-bold text-sm tracking-wider z-30 rounded-sm shadow-lg transform rotate-2">
          NEW PRODUCT
        </div>
        
        {/* Graffiti Style Orange Overlay */}
        <div className="absolute left-0 top-0 h-full z-10" style={{ width: '50%' }}>
          {/* Main graffiti shape with splatter effect */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="graffitiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b35" />
                <stop offset="40%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <filter id="roughEdge">
                <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Main organic blob shape */}
            <path 
              d="M 0 0 L 380 0 C 420 50 400 120 350 180 C 380 250 340 320 300 380 C 320 450 280 520 220 580 L 180 600 L 0 600 Z" 
              fill="url(#graffitiGradient)"
            />
            
            {/* Splatter effects */}
            <circle cx="390" cy="80" r="25" fill="#f97316" opacity="0.8" />
            <circle cx="360" cy="140" r="12" fill="#ff6b35" opacity="0.6" />
            <circle cx="320" cy="280" r="18" fill="#ea580c" opacity="0.7" />
            <circle cx="280" cy="450" r="15" fill="#f97316" opacity="0.5" />
            <circle cx="240" cy="540" r="20" fill="#ff6b35" opacity="0.6" />
            
            {/* Small splatter dots */}
            <circle cx="410" cy="60" r="6" fill="#f97316" opacity="0.4" />
            <circle cx="400" cy="110" r="4" fill="#ff6b35" opacity="0.5" />
            <circle cx="370" cy="200" r="5" fill="#ea580c" opacity="0.4" />
            <circle cx="340" cy="350" r="7" fill="#f97316" opacity="0.3" />
            <circle cx="300" cy="500" r="8" fill="#ff6b35" opacity="0.4" />
            <circle cx="260" cy="570" r="5" fill="#ea580c" opacity="0.5" />
            
            {/* Drip effects */}
            <path d="M 350 180 Q 360 220 355 260 Q 350 280 345 290" stroke="#f97316" strokeWidth="4" fill="none" opacity="0.6" strokeLinecap="round" />
            <path d="M 300 380 Q 310 420 305 450" stroke="#ea580c" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" />
            <path d="M 220 580 Q 230 590 225 600" stroke="#ff6b35" strokeWidth="5" fill="none" opacity="0.7" strokeLinecap="round" />
            
            {/* Abstract brush strokes */}
            <path d="M 50 100 Q 100 95 150 105 Q 200 100 220 110" stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 30 500 Q 80 495 130 505" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-12 py-16">
            {/* Graffiti style title */}
            <h1 className="text-white text-5xl lg:text-6xl xl:text-7xl font-black mb-6 leading-none">
              <span className="block transform -rotate-2" style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.2)' }}>SMART</span>
              <span className="block transform rotate-1 text-orange-100" style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.2)' }}>OFFICE</span>
              <span className="block transform -rotate-1" style={{ textShadow: '4px 4px 0 rgba(0,0,0,0.3)', WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>FUTURE</span>
              <span className="block transform rotate-2 text-orange-200" style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.2)' }}>DESIGN</span>
            </h1>

            <p className="text-white/90 text-sm lg:text-base mb-4 font-medium leading-relaxed max-w-xs transform -rotate-1">
              智能办公空间解决方案专家
            </p>

            <p className="text-white font-black text-xl lg:text-2xl tracking-wider transform rotate-1" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>
              ZUODI <span className="text-orange-200">佐迪</span>
            </p>
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
