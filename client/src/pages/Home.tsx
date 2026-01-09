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
      {/* Hero Banner */}
      <section className="relative w-full min-h-[600px] bg-gray-100 overflow-hidden">
        <div className="w-full h-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full min-h-[600px] items-stretch">
            {/* Left: Orange Content Area with Paintbrush Edge */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 flex flex-col justify-center p-8 lg:p-16 relative overflow-visible">
              {/* Background dark image overlay */}
              <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{
                backgroundImage: 'url(/images/hero-office-new.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>

              {/* Paintbrush texture on right edge using SVG */}
              <svg className="absolute right-0 top-0 h-full w-32" preserveAspectRatio="none" viewBox="0 0 120 600" style={{ zIndex: 5 }}>
                <defs>
                  <filter id="paintbrush">
                    <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" result="noise" seed="2" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" />
                  </filter>
                </defs>
                <path d="M 0 0 Q 20 40 15 100 Q 25 160 12 220 Q 28 280 8 340 Q 24 400 10 460 Q 26 520 15 600 L 120 600 L 120 0 Z" fill="white" opacity="0.15" filter="url(#paintbrush)" />
                <path d="M 8 0 Q 18 60 5 140 Q 22 200 15 280 Q 20 360 6 440 Q 25 500 12 600 L 120 600 L 120 0 Z" fill="white" opacity="0.1" filter="url(#paintbrush)" />
                <path d="M 3 0 Q 12 80 2 180 Q 16 260 10 360 Q 18 440 4 520 Q 20 580 8 600 L 120 600 L 120 0 Z" fill="white" opacity="0.08" filter="url(#paintbrush)" />
              </svg>
              
              <div className="relative z-10">
                <h1 className="text-white text-5xl lg:text-6xl font-black mb-6 leading-tight uppercase tracking-tight">
                  YOUR BEST<br />
                  BUDDY FOR<br />
                  DIGITAL<br />
                  NOMADS
                </h1>

                <p className="text-white/90 text-base mb-4 font-light leading-relaxed max-w-md">
                  "数字游牧"的经典化模块化办公家具
                </p>

                <p className="text-white font-bold text-xl mb-8">
                  佐迪智能办公系列
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <a href="#products" className="inline-flex items-center gap-3 bg-white text-orange-600 px-8 py-3 rounded font-bold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg">
                    浏览产品
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a href="#contact" className="inline-flex items-center gap-2 text-white border-2 border-white/60 px-6 py-2 rounded font-semibold hover:border-white hover:bg-white/10 transition-all">
                    获取报价
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Image Area with Light Gray Background */}
            <div className="hidden lg:flex relative h-full min-h-[600px] items-center justify-center bg-gray-100 overflow-hidden">
              {/* NEW PRODUCT Badge - Top Right */}
              <div className="absolute top-8 right-8 bg-orange-500 text-white px-6 py-3 font-bold text-sm tracking-wider z-20 rounded">
                NEW PRODUCT
              </div>
              
              <img
                src="/images/hero-office-new.jpg"
                alt="Modern Office Space"
                className="w-full h-full object-cover"
              />
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
