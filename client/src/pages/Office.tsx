import { Button } from "@/components/ui/button";


const products = [
  {
    id: 1,
    name: "Aeron Pro",
    category: "人体工学椅",
    price: "¥3,599",
    image: "/images/product-chair.jpg",
    description: "全网布设计，自适应腰部支撑，专为长时间办公打造。"
  },
  {
    id: 2,
    name: "Nexus Desk",
    category: "行政办公桌",
    price: "¥5,299",
    image: "/images/hero-office.jpg",
    description: "极简线条，胡桃木纹理，集成线缆管理系统。"
  },
  {
    id: 3,
    name: "Studio Task",
    category: "职员椅",
    price: "¥1,299",
    image: "/images/product-chair.jpg",
    description: "紧凑设计，灵活移动，适合开放式办公环境。"
  },
  {
    id: 4,
    name: "Collaborate Table",
    category: "会议桌",
    price: "¥8,999",
    image: "/images/hero-office.jpg",
    description: "模块化拼接，支持多媒体接入，促进团队高效协作。"
  },
  {
    id: 5,
    name: "Focus Pod",
    category: "静音舱",
    price: "¥12,999",
    image: "/images/hero-office.jpg",
    description: "声学降噪材料，提供私密的专注工作空间。"
  },
  {
    id: 6,
    name: "Archive Unit",
    category: "文件柜",
    price: "¥2,499",
    image: "/images/product-desk.jpg",
    description: "钢制结构，安全耐用，大容量存储解决方案。"
  }
];

export default function Office() {
  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container">
        {/* Header */}
        <div className="mb-16 space-y-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground uppercase tracking-widest">
            <a href="/" className="hover:text-secondary transition-colors">首页</a>
            <span>/</span>
            <span className="text-primary font-bold">办公家具</span>
          </div>
          <h1 className="font-heading text-6xl font-bold uppercase tracking-tighter">
            Office <span className="text-primary">Collection</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl border-l-4 border-secondary pl-6 py-2">
            专为现代企业打造的高效办公环境。从人体工学座椅到智能会议系统，我们提供全方位的空间解决方案。
          </p>
        </div>

        {/* Filters (Visual only for now) */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-foreground/10 pb-8">
          {["全部", "人体工学椅", "办公桌", "会议系统", "储物柜", "配件"].map((filter, index) => (
            <button 
              key={filter}
              className={`px-6 py-2 text-sm font-heading uppercase tracking-wider border transition-all ${
                index === 0 
                  ? "bg-foreground text-background border-foreground" 
                  : "bg-transparent text-muted-foreground border-transparent hover:border-foreground/20"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col gap-4">
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                <Button 
                  className="absolute bottom-0 left-0 w-full rounded-none translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-heading uppercase tracking-wider"
                >
                  查看更多
                </Button>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-heading text-2xl font-bold uppercase tracking-tight">{product.name}</h3>
                  <span className="font-heading text-lg font-bold text-secondary">{product.price}</span>
                </div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">{product.category}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
