import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const products = [
  {
    id: 1,
    name: "Scholar Desk",
    category: "学生课桌",
    price: "¥899",
    image: "/images/product-desk.jpg",
    description: "可调节高度，耐磨桌面，符合人体工学的学生专用课桌。"
  },
  {
    id: 2,
    name: "Active Chair",
    category: "学生椅",
    price: "¥459",
    image: "/images/hero-school.jpg",
    description: "弹性靠背，支持多种坐姿，帮助学生保持专注。"
  },
  {
    id: 3,
    name: "Library Shelving",
    category: "图书馆书架",
    price: "¥3,299",
    image: "/images/product-desk.jpg",
    description: "双面钢制书架，模块化设计，可无限延伸。"
  },
  {
    id: 4,
    name: "Lab Station",
    category: "实验室工作台",
    price: "¥4,599",
    image: "/images/hero-school.jpg",
    description: "耐酸碱台面，集成水电气接口，专为科学实验室设计。"
  },
  {
    id: 5,
    name: "Teacher Podium",
    category: "讲台",
    price: "¥2,899",
    image: "/images/product-desk.jpg",
    description: "集成多媒体控制，简洁大方，提升教学效率。"
  },
  {
    id: 6,
    name: "Canteen Table",
    category: "食堂餐桌",
    price: "¥1,899",
    image: "/images/hero-school.jpg",
    description: "易清洁材质，稳固耐用，多彩设计活跃空间氛围。"
  }
];

export default function School() {
  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container">
        {/* Header */}
        <div className="mb-16 space-y-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground uppercase tracking-widest">
            <Link href="/">首页</Link>
            <span>/</span>
            <span className="text-primary font-bold">学校家具</span>
          </div>
          <h1 className="font-heading text-6xl font-bold uppercase tracking-tighter">
            School <span className="text-secondary">Furniture</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl border-l-4 border-primary pl-6 py-2">
            为下一代创造的灵感空间。安全、环保、耐用，满足从幼儿园到大学的多样化教育需求。
          </p>
        </div>

        {/* Filters (Visual only for now) */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-foreground/10 pb-8">
          {["全部", "教室家具", "图书馆", "实验室", "行政办公", "公共区域"].map((filter, index) => (
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
                <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 transition-colors duration-300" />
                <Button 
                  className="absolute bottom-0 left-0 w-full rounded-none translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-heading uppercase tracking-wider bg-secondary hover:bg-secondary/90"
                >
                  查看详情
                </Button>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-heading text-2xl font-bold uppercase tracking-tight">{product.name}</h3>
                  <span className="font-heading text-lg font-bold text-primary">{product.price}</span>
                </div>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">{product.category}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
