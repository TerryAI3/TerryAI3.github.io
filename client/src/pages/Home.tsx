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
      {/* Hero Banner - Free-form Graffiti with Business Typography */}
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
        <div className="absolute top-6 right-6 bg-orange-500 text-white px-5 py-2.5 font-bold text-sm tracking-wider z-30 rounded shadow-lg">
          NEW PRODUCT
        </div>
        
        {/* Free-form Graffiti Orange Overlay */}
        <div className="absolute left-0 top-0 h-full z-10" style={{ width: '55%' }}>
          {/* Organic free-flowing graffiti shapes */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 550 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="freeGradient" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#ff7849" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <filter id="paintTexture">
                <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
            </defs>
            
            {/* Main free-flowing shape - like paint thrown on canvas */}
            <path 
              d="M 0 0 
                 L 320 0 
                 C 380 20 420 60 400 120 
                 C 450 160 420 220 380 280 
                 C 420 320 400 380 350 420 
                 C 380 480 340 540 280 580 
                 C 250 600 200 600 150 600 
                 L 0 600 Z" 
              fill="url(#freeGradient)"
              filter="url(#paintTexture)"
            />
            
            {/* Secondary flowing layer */}
            <path 
              d="M 0 0 
                 L 280 0 
                 C 340 40 360 100 320 160 
                 C 360 220 330 300 280 360 
                 C 310 420 270 500 200 560 
                 L 120 600 
                 L 0 600 Z" 
              fill="#f97316"
              opacity="0.6"
            />
            
            {/* Organic splatter blobs - more natural shapes */}
            <ellipse cx="420" cy="90" rx="35" ry="28" fill="#ff7849" opacity="0.7" transform="rotate(-15 420 90)" />
            <ellipse cx="380" cy="200" rx="22" ry="18" fill="#f97316" opacity="0.6" transform="rotate(20 380 200)" />
            <ellipse cx="400" cy="320" rx="28" ry="20" fill="#ea580c" opacity="0.5" transform="rotate(-10 400 320)" />
            <ellipse cx="350" cy="480" rx="25" ry="30" fill="#ff7849" opacity="0.6" transform="rotate(25 350 480)" />
            <ellipse cx="280" cy="560" rx="32" ry="22" fill="#f97316" opacity="0.5" transform="rotate(-20 280 560)" />
            
            {/* Scattered paint drops - random organic feel */}
            <circle cx="450" cy="50" r="8" fill="#ff7849" opacity="0.5" />
            <circle cx="440" cy="140" r="5" fill="#f97316" opacity="0.4" />
            <circle cx="420" cy="260" r="7" fill="#ea580c" opacity="0.35" />
            <circle cx="430" cy="380" r="6" fill="#ff7849" opacity="0.4" />
            <circle cx="390" cy="540" r="9" fill="#f97316" opacity="0.45" />
            <circle cx="320" cy="590" r="5" fill="#ea580c" opacity="0.3" />
            
            {/* Tiny scattered dots */}
            <circle cx="460" cy="80" r="3" fill="#ff7849" opacity="0.3" />
            <circle cx="445" cy="180" r="2" fill="#f97316" opacity="0.25" />
            <circle cx="435" cy="300" r="3" fill="#ea580c" opacity="0.3" />
            <circle cx="410" cy="450" r="2" fill="#ff7849" opacity="0.25" />
            <circle cx="360" cy="520" r="3" fill="#f97316" opacity="0.3" />
            
            {/* Paint drip effects - more organic */}
            <path d="M 400 120 Q 415 160 408 200 Q 400 230 395 250" stroke="#f97316" strokeWidth="6" fill="none" opacity="0.5" strokeLinecap="round" />
            <path d="M 350 420 Q 365 460 358 500 Q 350 530 340 550" stroke="#ea580c" strokeWidth="5" fill="none" opacity="0.4" strokeLinecap="round" />
            <path d="M 280 580 Q 290 590 285 600" stroke="#ff7849" strokeWidth="7" fill="none" opacity="0.5" strokeLinecap="round" />
            
            {/* Subtle brush texture strokes */}
            <path d="M 40 80 Q 100 70 180 85 Q 240 75 280 90" stroke="rgba(255,255,255,0.15)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 30 520 Q 90 510 150 525" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
          
          {/* Content - Business Typography */}
          <div className="relative z-10 h-full flex flex-col justify-center px-10 lg:px-14 py-16">
            {/* Clean business style title */}
            <h1 className="text-white text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-tight tracking-tight">
              SMART<br />
              OFFICE<br />
              <span className="text-orange-100">FUTURE</span><br />
              DESIGN
            </h1>

            <p className="text-white/90 text-sm lg:text-base mb-6 font-normal leading-relaxed max-w-sm">
              智能办公空间解决方案专家
            </p>

            <p className="text-white font-semibold text-lg lg:text-xl tracking-wide">
              ZUODI <span className="text-orange-200 font-normal">佐迪智能家具</span>
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
