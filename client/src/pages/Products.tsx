import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, ShoppingCart } from "lucide-react";

const products = [
  // 办公家具 - 办公椅
  {
    id: 1,
    name: "人体工学办公椅 - 高端行政款",
    category: "办公椅",
    type: "办公",
    price: "¥3,800-5,200",
    image: "/images/product-chair.jpg",
    description: "采用高级网布和人体工学设计，提供8小时舒适支撑。配备气压升降和多向调节功能。",
    features: ["高级网布材质", "气压升降", "多向调节", "5年保修"],
    specs: {
      "材质": "高级网布 + 铝合金",
      "调节方式": "气压升降、倾仰、扶手",
      "尺寸": "650×650×1000-1100mm",
      "承重": "150kg"
    }
  },
  {
    id: 2,
    name: "现代简约办公椅 - 中端款",
    category: "办公椅",
    type: "办公",
    price: "¥1,800-2,500",
    image: "/images/product-chair.jpg",
    description: "简洁现代设计，适合开放式办公环境。人体工学支撑，性价比高。",
    features: ["简洁设计", "人体工学", "易清洁", "3年保修"],
    specs: {
      "材质": "布料 + 塑料",
      "调节方式": "气压升降、倾仰",
      "尺寸": "600×600×920-1020mm",
      "承重": "120kg"
    }
  },
  {
    id: 3,
    name: "经理座椅 - 皮质高端款",
    category: "办公椅",
    type: "办公",
    price: "¥5,800-7,500",
    image: "/images/product-chair.jpg",
    description: "高级真皮材质，彰显企业品味。多功能调节，提供顶级舒适体验。",
    features: ["真皮材质", "多功能调节", "豪华设计", "5年保修"],
    specs: {
      "材质": "真皮 + 铝合金",
      "调节方式": "气压升降、倾仰、腰部支撑",
      "尺寸": "700×700×1050-1150mm",
      "承重": "150kg"
    }
  },

  // 办公家具 - 办公桌
  {
    id: 4,
    name: "电动升降办公桌 - 智能款",
    category: "办公桌",
    type: "办公",
    price: "¥4,500-6,800",
    image: "/images/product-desk.jpg",
    description: "电动升降系统，支持坐站交替工作。智能记忆功能，提升工作效率。",
    features: ["电动升降", "智能记忆", "环保材料", "5年保修"],
    specs: {
      "材质": "环保板材 + 钢铁框架",
      "升降范围": "700-1200mm",
      "尺寸": "1400×700×700-1200mm",
      "承重": "100kg"
    }
  },
  {
    id: 5,
    name: "固定高度办公桌 - 经典款",
    category: "办公桌",
    type: "办公",
    price: "¥1,200-1,800",
    image: "/images/product-desk.jpg",
    description: "简洁实用的办公桌，适合各类办公环境。稳定耐用，易于组装。",
    features: ["简洁设计", "稳定耐用", "易组装", "3年保修"],
    specs: {
      "材质": "环保板材 + 钢铁框架",
      "尺寸": "1200×600×750mm",
      "承重": "80kg",
      "颜色": "胡桃木、白色、灰色"
    }
  },
  {
    id: 6,
    name: "主管办公桌 - 豪华款",
    category: "办公桌",
    type: "办公",
    price: "¥3,500-5,200",
    image: "/images/product-desk.jpg",
    description: "宽敞的工作面积，配置储物柜。彰显管理者身份，提升办公品味。",
    features: ["宽敞设计", "储物柜配置", "高端材料", "5年保修"],
    specs: {
      "材质": "实木贴皮 + 钢铁框架",
      "尺寸": "1600×800×750mm",
      "储物": "左侧柜体",
      "承重": "120kg"
    }
  },

  // 办公家具 - 会议系列
  {
    id: 7,
    name: "会议桌 - 大型款",
    category: "会议系列",
    type: "办公",
    price: "¥8,000-12,000",
    image: "/images/product-desk.jpg",
    description: "可容纳12-16人的大型会议桌。采用优质材料，彰显企业形象。",
    features: ["大容量设计", "优质材料", "易维护", "5年保修"],
    specs: {
      "材质": "实木 + 钢铁框架",
      "尺寸": "3000×1200×750mm",
      "容纳人数": "12-16人",
      "承重": "200kg"
    }
  },
  {
    id: 8,
    name: "会议椅 - 标准款",
    category: "会议系列",
    type: "办公",
    price: "¥800-1,200",
    image: "/images/product-chair.jpg",
    description: "舒适的会议椅，支持长时间会议。简洁设计，易于堆放。",
    features: ["舒适设计", "易堆放", "耐用材料", "3年保修"],
    specs: {
      "材质": "布料 + 塑料框架",
      "尺寸": "550×550×850mm",
      "承重": "120kg",
      "堆放": "可堆放10张"
    }
  },

  // 学校家具 - 课桌椅
  {
    id: 9,
    name: "升降课桌椅 - 小学款",
    category: "课桌椅",
    type: "学校",
    price: "¥450-650",
    image: "/images/product-desk.jpg",
    description: "适合小学生的升降课桌椅，支持多个高度调节。人体工学设计，保护脊椎。",
    features: ["升降调节", "人体工学", "安全环保", "3年保修"],
    specs: {
      "材质": "环保板材 + 钢铁",
      "高度范围": "600-750mm",
      "尺寸": "600×450×600-750mm",
      "适用年级": "小学1-3年级"
    }
  },
  {
    id: 10,
    name: "升降课桌椅 - 中学款",
    category: "课桌椅",
    type: "学校",
    price: "¥550-750",
    image: "/images/product-desk.jpg",
    description: "适合中学生的升降课桌椅，支持个性化调节。符合国家标准，安全可靠。",
    features: ["升降调节", "国标认证", "安全可靠", "3年保修"],
    specs: {
      "材质": "环保板材 + 钢铁",
      "高度范围": "700-900mm",
      "尺寸": "700×500×700-900mm",
      "适用年级": "中学1-3年级"
    }
  },
  {
    id: 11,
    name: "固定课桌椅 - 标准款",
    category: "课桌椅",
    type: "学校",
    price: "¥300-450",
    image: "/images/product-desk.jpg",
    description: "经济实用的固定课桌椅，适合各类学校。稳定耐用，易于维护。",
    features: ["经济实用", "稳定耐用", "易维护", "2年保修"],
    specs: {
      "材质": "环保板材 + 钢铁",
      "尺寸": "600×450×750mm",
      "承重": "150kg",
      "颜色": "多色可选"
    }
  },

  // 学校家具 - 讲台
  {
    id: 12,
    name: "教师讲台 - 标准款",
    category: "讲台",
    type: "学校",
    price: "¥1,200-1,800",
    image: "/images/product-desk.jpg",
    description: "专业教师讲台，配置储物空间。稳定结构，易于操作。",
    features: ["专业设计", "储物空间", "稳定结构", "3年保修"],
    specs: {
      "材质": "环保板材 + 钢铁",
      "尺寸": "1200×600×1100mm",
      "储物": "上下柜体",
      "承重": "100kg"
    }
  },
  {
    id: 13,
    name: "多功能讲台 - 智能款",
    category: "讲台",
    type: "学校",
    price: "¥2,500-3,500",
    image: "/images/product-desk.jpg",
    description: "集讲台、储物、展示于一体。支持多媒体集成，提升教学效果。",
    features: ["多功能设计", "多媒体支持", "储物充足", "5年保修"],
    specs: {
      "材质": "环保板材 + 钢铁",
      "尺寸": "1400×700×1100mm",
      "功能": "讲台、储物、多媒体集成",
      "承重": "150kg"
    }
  },

  // 学校家具 - 储物柜
  {
    id: 14,
    name: "学生储物柜 - 标准款",
    category: "储物柜",
    type: "学校",
    price: "¥800-1,200",
    image: "/images/product-desk.jpg",
    description: "安全耐用的学生储物柜，支持个人物品存放。易于清洁维护。",
    features: ["安全设计", "易清洁", "耐用材料", "3年保修"],
    specs: {
      "材质": "冷轧钢板",
      "尺寸": "900×400×1800mm",
      "格数": "6格",
      "承重": "50kg/格"
    }
  },
  {
    id: 15,
    name: "图书馆书架 - 高端款",
    category: "储物柜",
    type: "学校",
    price: "¥1,500-2,200",
    image: "/images/product-desk.jpg",
    description: "专业图书馆书架，支持大容量存储。美观耐用，提升图书馆形象。",
    features: ["大容量", "美观设计", "耐用材料", "5年保修"],
    specs: {
      "材质": "环保板材 + 钢铁",
      "尺寸": "1200×300×2000mm",
      "层数": "6层",
      "承重": "100kg/层"
    }
  },

  // 学校家具 - 床铺
  {
    id: 16,
    name: "宿舍床 - 上下铺款",
    category: "床铺",
    type: "学校",
    price: "¥1,800-2,500",
    image: "/images/product-desk.jpg",
    description: "安全稳定的上下铺宿舍床。采用优质材料，符合学校标准。",
    features: ["安全稳定", "优质材料", "易组装", "5年保修"],
    specs: {
      "材质": "钢铁框架 + 木板",
      "尺寸": "900×2000×1800mm",
      "容纳": "2人",
      "承重": "200kg/层"
    }
  },
  {
    id: 17,
    name: "单人床 - 标准款",
    category: "床铺",
    type: "学校",
    price: "¥800-1,200",
    image: "/images/product-desk.jpg",
    description: "简洁实用的单人床，适合学生宿舍。稳定耐用，易于维护。",
    features: ["简洁设计", "稳定耐用", "易维护", "3年保修"],
    specs: {
      "材质": "钢铁框架 + 木板",
      "尺寸": "900×2000×400mm",
      "承重": "200kg",
      "颜色": "银色、黑色"
    }
  }
];

export default function Products() {
  const [selectedType, setSelectedType] = useState<string>("全部");
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");

  const types = ["全部", "办公", "学校"];
  const categories = ["全部", "办公椅", "办公桌", "会议系列", "课桌椅", "讲台", "储物柜", "床铺"];

  const filteredProducts = products.filter((p) => {
    const typeMatch = selectedType === "全部" || p.type === selectedType;
    const categoryMatch = selectedCategory === "全部" || p.category === selectedCategory;
    return typeMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="container space-y-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground uppercase tracking-widest">
            <Link href="/">首页</Link>
            <span>/</span>
            <span className="text-secondary font-bold">产品中心</span>
          </div>
          <h1 className="font-heading text-6xl font-bold uppercase tracking-tighter max-w-3xl">
            产品 <span className="text-secondary">中心</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            佐迪为办公和教育环境提供全系列高品质家具产品。从办公椅到学生课桌，每一件产品都经过精心设计和严格质检。
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 border-b-4 border-secondary">
        <div className="container space-y-8">
          {/* Type Filter */}
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">产品类型</p>
            <div className="flex flex-wrap gap-4">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setSelectedCategory("全部");
                  }}
                  className={`px-6 py-3 text-sm font-heading uppercase tracking-wider border-2 transition-all ${
                    selectedType === type
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-foreground/20 hover:border-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">产品分类</p>
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-heading uppercase tracking-wider border-2 transition-all ${
                    selectedCategory === cat
                      ? "bg-primary text-white border-primary"
                      : "bg-transparent text-foreground border-foreground/20 hover:border-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24">
        <div className="container">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col gap-4 border-2 border-foreground/10 hover:border-primary transition-colors overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                      {product.category}
                    </div>
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-bold uppercase tracking-wider hover:bg-white hover:text-secondary transition-all">
                        <ShoppingCart className="h-5 w-5" />
                        了解详情
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-heading text-lg font-bold uppercase tracking-tight mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-muted text-foreground text-xs font-bold uppercase tracking-wider rounded-none border border-foreground/20"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                      <p className="font-heading text-lg font-bold text-primary">{product.price}</p>
                      <a href="#" className="inline-flex items-center gap-1 text-primary font-bold uppercase tracking-widest hover:gap-3 transition-all text-sm">
                        查看 <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-xl text-muted-foreground font-bold uppercase tracking-widest">
                暂无符合条件的产品
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-muted border-y-4 border-foreground">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "17+", label: "产品系列" },
              { number: "8+", label: "产品分类" },
              { number: "100%", label: "环保认证" },
              { number: "5年", label: "质量保修" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <p className="font-heading text-5xl font-bold text-primary">{stat.number}</p>
                <p className="text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4">
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tighter">
              需要定制方案？
            </h2>
            <p className="text-white/80 text-lg max-w-xl">
              我们的专业团队可以根据您的需求提供完整的定制解决方案。
            </p>
          </div>
          <a href="#contact" className="inline-flex items-center gap-2 px-10 py-4 h-16 text-xl font-heading uppercase tracking-wider bg-secondary text-white hover:bg-white hover:text-primary transition-all rounded-none">
            获取报价
          </a>
        </div>
      </section>
    </div>
  );
}
