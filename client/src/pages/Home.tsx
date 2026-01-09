import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Briefcase, Archive, Grid3x3 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  const productSeries = [
    { name: "黎明 Dawn", desc: "现代简约办公系列", color: "from-orange-400 to-orange-600" },
    { name: "杰瑞 Jerry", desc: "人体工学座椅系列", color: "from-blue-400 to-blue-600" },
    { name: "光芒 Sunshine", desc: "高端会议系列", color: "from-yellow-400 to-yellow-600" },
    { name: "诺拉 Neola", desc: "智能教室系列", color: "from-green-400 to-green-600" },
  ];

  const projects = [
    {
      name: "科技企业总部",
      image: "/images/hero-office.jpg",
      desc: "打造创新协作空间",
    },
    {
      name: "金融机构办公空间",
      image: "/images/hero-office.jpg",
      desc: "专业高效的工作环境",
    },
    {
      name: "教育机构图书馆",
      image: "/images/hero-office.jpg",
      desc: "激发学习的灵感空间",
    },
    {
      name: "联合办公空间",
      image: "/images/hero-office.jpg",
      desc: "灵活多变的办公方案",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Banner - 大胆设计 */}
      <section className="relative min-h-[700px] bg-white overflow-hidden">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full min-h-[700px]">
            {/* Left: Orange Block with Bold Typography */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 flex flex-col justify-center p-12 lg:p-20 relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mb-36"></div>

              <div className="relative z-10">
                <div className="inline-block bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-8 rounded-full">
                  ✨ NEW COLLECTION
                </div>

                <h1 className="text-white text-6xl lg:text-7xl font-black mb-6 leading-tight uppercase tracking-tight">
                  YOUR BEST<br />
                  BUDDY FOR<br />
                  DIGITAL<br />
                  NOMADS
                </h1>

                <p className="text-white/95 text-xl mb-6 font-light leading-relaxed max-w-md">
                  "数字游牧"的经典化模块化办公家具
                </p>

                <p className="text-white font-bold text-2xl mb-12">
                  佐迪智能办公系列
                </p>

                <Link href="/products">
                  <a className="inline-flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-50 transition-all transform hover:scale-105">
                    浏览产品系列
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Link>
              </div>
            </div>

            {/* Right: Premium Product Image */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group">
              <img
                src="/images/hero-office.jpg"
                alt="Office Scene"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <div>
                <div className="text-sm font-bold text-orange-600 tracking-widest uppercase mb-4">
                  【SINCE 2010】
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                  创造激发灵感的办公生活方式
                </h2>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                佐迪智能家具成立于2010年，一直致力于为客户提供激发灵感的办公家具整体解决方案。我们致力于通过创新设计和卓越工艺，打造舒适、高效的办公环境。
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                多年来，佐迪始终坚持以用户需求为导向，不断探索与创新，为客户提供符合时代需求的产品和服务。我们相信好的办公家具能够激发创意、提升效率、改善生活质量。
              </p>

              <Link href="/about">
                <a className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors">
                  了解更多 <ArrowRight className="w-4 h-4" />
                </a>
              </Link>
            </div>

            {/* Right: Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/hero-office.jpg"
                  alt="Brand Story"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Series Showcase */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              产品系列
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              精心设计的产品系列，满足不同场景的办公需求
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productSeries.map((series, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${series.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer group`}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-2xl font-black mb-2 group-hover:translate-x-2 transition-transform">
                      {series.name}
                    </h3>
                    <p className="text-white/90 font-light">
                      {series.desc}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                    <span className="text-sm font-semibold">查看详情</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <a className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-700 transition-colors">
                浏览全部产品
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              精选产品
            </h2>
            <p className="text-xl text-gray-600">
              展现我们最受欢迎的产品系列
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "行政办公桌", icon: "🏢" },
              { name: "人体工学椅", icon: "💺" },
              { name: "协作会议桌", icon: "🤝" },
              { name: "智能教室家具", icon: "📚" },
            ].map((product, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-orange-100 to-orange-50 h-48 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  {product.icon}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    专业设计，品质保证
                  </p>
                  <a href="#" className="inline-flex items-center gap-1 text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                    了解更多 <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Cases */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              成功案例
            </h2>
            <p className="text-xl text-gray-600">
              我们为全球企业打造了数百个优秀的办公空间
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 group-hover:from-black/80 transition-all">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {project.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/cases">
              <a className="inline-flex items-center gap-2 border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-orange-600 hover:text-white transition-all">
                查看全部案例
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            准备打造您的理想办公空间？
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            联系我们的专业团队，获取定制化的办公家具解决方案
          </p>
          <Button
            size="lg"
            className="bg-white text-orange-600 hover:bg-gray-100 font-bold text-lg px-10 py-6 rounded-lg"
          >
            获取报价 <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
