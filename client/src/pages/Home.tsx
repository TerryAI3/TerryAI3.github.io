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
      <section className="relative min-h-[700px] bg-white overflow-hidden">
        <div className="w-full h-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full min-h-[700px] items-stretch">
            {/* Left: Orange Content Area with Background Image */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 flex flex-col justify-center p-8 lg:p-20 relative overflow-visible" style={{
              clipPath: 'polygon(0 0, 100% 0%, 98% 5%, 96% 2%, 94% 8%, 92% 3%, 90% 7%, 88% 2%, 86% 6%, 84% 1%, 82% 5%, 80% 0%, 100% 0%, 100% 100%, 0 100%)'
            }}>
              {/* Background dark image overlay */}
              <div className="absolute inset-0 opacity-15 mix-blend-multiply" style={{
                backgroundImage: 'url(/images/hero-office-new.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>

              {/* Decorative white slash line */}
              <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth="8">
                  <line x1="0" y1="0" x2="100" y2="100" />
                  <line x1="20" y1="0" x2="100" y2="80" />
                  <line x1="0" y1="20" x2="80" y2="100" />
                </svg>
              </div>

              {/* NEW PRODUCT Badge */}
              <div className="absolute top-8 right-8 bg-white text-orange-600 px-4 py-2 font-bold text-sm tracking-wider z-20">
                NEW PRODUCT
              </div>
              
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

            {/* Right: Image Area with Paintbrush Effect */}
            <div className="hidden lg:block relative h-full min-h-[700px] overflow-visible bg-gray-100">
              <img
                src="/images/hero-office-new.jpg"
                alt="Modern Office Space"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                style={{
                  clipPath: 'polygon(0 0%, 2% 5%, 4% 2%, 6% 8%, 8% 3%, 10% 7%, 12% 2%, 14% 6%, 16% 1%, 18% 5%, 20% 0%, 100% 0%, 100% 100%, 0% 100%)'
                }}
              />
              
              {/* Soft gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-orange-500/10"></div>
            </div>
          </div>
        </div>
        
        {/* Paintbrush divider effect at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white" style={{
          clipPath: 'polygon(0 0, 100% 20%, 100% 100%, 0 100%)'
        }}></div>
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
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              产品 <span className="text-gray-400">PRODUCTS</span>
            </h2>
          </div>

          {/* Product Categories Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {productCategories.map((category, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-8 bg-white hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
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
