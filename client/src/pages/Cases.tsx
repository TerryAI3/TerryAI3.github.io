import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

// 本地案例数据（备用）
const localCases = [
  {
    id: 1,
    title: "现代教室改造方案",
    category: "教室",
    location: "北京市朝阳区第一中学",
    description: "为传统教室配置现代化的课桌椅系统，提升教学效率和学生舒适度。采用模块化设计，支持多种教学场景。",
    image: "/images/cases/V6KoAxuAzwDe.webp",
    stats: {
      area: "320m²",
      students: "48人",
      completion: "2023年6月"
    },
    highlights: [
      "模块化课桌椅系统",
      "人体工学设计",
      "环保材料选用",
      "灵活空间配置"
    ]
  },
  {
    id: 2,
    title: "阶梯教室升级项目",
    category: "教室",
    location: "上海交通大学",
    description: "为大型阶梯教室配置专业的升降课桌系统，提供最佳的视线和舒适的学习体验。支持多人协作和演讲展示。",
    image: "/images/cases/1zYIXeenJNjF.webp",
    stats: {
      area: "480m²",
      students: "120人",
      completion: "2023年9月"
    },
    highlights: [
      "升降式课桌设计",
      "视线最优化",
      "协作学习支持",
      "多媒体集成"
    ]
  },
  {
    id: 3,
    title: "智慧教室解决方案",
    category: "教室",
    location: "深圳市南山区实验学校",
    description: "打造集教学、协作、展示于一体的智慧教室。配置灵活的家具系统，支持多种教学模式和学生互动。",
    image: "/images/cases/tz6dSZZy29j7.jpg",
    stats: {
      area: "280m²",
      students: "40人",
      completion: "2023年7月"
    },
    highlights: [
      "多功能课桌椅",
      "智能控制系统",
      "灵活分组配置",
      "环保认证材料"
    ]
  },
  {
    id: 4,
    title: "企业办公空间设计",
    category: "办公",
    location: "广州科技园区创意中心",
    description: "为高科技企业打造现代化办公环境。采用开放式与私密空间相结合的设计，提升员工协作效率和工作满意度。",
    image: "/images/cases/f89mbxKtFuAm.jpg",
    stats: {
      area: "1200m²",
      employees: "150人",
      completion: "2023年8月"
    },
    highlights: [
      "人体工学办公椅",
      "开放式协作区",
      "私密工作间",
      "可持续设计"
    ]
  },
  {
    id: 5,
    title: "高端行政办公室",
    category: "办公",
    location: "杭州互联网产业园",
    description: "为企业高管打造高端办公空间。融合现代设计与功能性，营造专业、舒适的工作环境。",
    image: "/images/cases/KrUGiuF2Gydc.jpg",
    stats: {
      area: "450m²",
      offices: "12间",
      completion: "2023年5月"
    },
    highlights: [
      "高端办公家具",
      "人体工学优化",
      "品牌形象展示",
      "智能办公系统"
    ]
  },
  {
    id: 6,
    title: "创意办公团队空间",
    category: "办公",
    location: "成都创意产业基地",
    description: "为创意团队设计灵活多变的办公空间。支持快速重组和多种工作模式，激发团队创意和协作精神。",
    image: "/images/cases/A6IJN6zap5Bn.jpg",
    stats: {
      area: "800m²",
      teams: "8个",
      completion: "2023年4月"
    },
    highlights: [
      "模块化办公系统",
      "协作空间设计",
      "灵活分组配置",
      "创意激励环境"
    ]
  },
  {
    id: 7,
    title: "幼儿园教室改造",
    category: "教室",
    location: "北京市东城区幼儿园",
    description: "为幼儿园创造安全、温馨、富有创意的学习环境。采用儿童友好的家具设计，支持多种教学活动。",
    image: "/images/cases/CfityOzXI3pU.jpg",
    stats: {
      area: "200m²",
      children: "30人",
      completion: "2023年3月"
    },
    highlights: [
      "儿童安全设计",
      "彩色活力空间",
      "多功能学习区",
      "环保认证材料"
    ]
  },
  {
    id: 8,
    title: "小学开放式学习空间",
    category: "教室",
    location: "杭州市西湖区小学",
    description: "打造开放式、多功能的学习空间，支持小组合作学习和个性化教学。灵活的家具配置满足各种教学需求。",
    image: "/images/cases/0yfbiOPWn3bM.jpg",
    stats: {
      area: "350m²",
      students: "60人",
      completion: "2023年10月"
    },
    highlights: [
      "开放式学习区",
      "小组合作支持",
      "灵活空间配置",
      "创新教学支持"
    ]
  }
];

export default function Cases() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: dbCases = [] } = trpc.cases.list.useQuery();
  
  // 使用数据库案例，如果为空则使用本地案例
  const cases = dbCases.length > 0 ? dbCases : localCases;
  
  const categories = ["全部", ...Array.from(new Set(localCases.map(c => c.category)))];
  const filteredCases = selectedCategory === null || selectedCategory === "全部"
    ? cases
    : cases.filter(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="container space-y-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground uppercase tracking-widest">
            <Link href="/">首页</Link>
            <span>/</span>
            <span className="text-secondary font-bold">成功案例</span>
          </div>
          <h1 className="font-heading text-6xl font-bold uppercase tracking-tighter max-w-3xl">
            成功 <span className="text-secondary">案例</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            从校园到企业，佐迪为数百个项目打造了专业的空间解决方案。这些案例展示了我们的设计理念和执行能力。
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 border-b-4 border-secondary">
        <div className="container">
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === "全部" ? null : cat)}
                className={`px-6 py-3 text-sm font-heading uppercase tracking-wider border-2 transition-all ${
                  (selectedCategory === null && cat === "全部") || selectedCategory === cat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground border-foreground/20 hover:border-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {filteredCases.map((caseItem) => (
              <div key={caseItem.id} className="group flex flex-col gap-6 border-l-4 border-primary pl-6 hover:border-secondary transition-colors">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={("image" in caseItem ? caseItem.image : caseItem.mainImage) || ""}
                    alt={caseItem.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <p className="text-sm font-bold uppercase tracking-widest text-secondary">{caseItem.category}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-heading text-2xl font-bold uppercase tracking-tight mb-2">
                      {caseItem.title}
                    </h3>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">
                      📍 {caseItem.location}
                    </p>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {caseItem.description}
                  </p>

                  {/* Stats - 仅本地案例显示 */}
                  {"stats" in caseItem && (
                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-foreground/10">
                      {Object.entries((caseItem.stats as any)).map(([key, value]: [string, any]) => (
                        <div key={key} className="text-center">
                          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                            {key === "area" && "面积"}
                            {key === "students" && "学生数"}
                            {key === "employees" && "员工数"}
                            {key === "offices" && "办公室"}
                            {key === "teams" && "团队数"}
                            {key === "children" && "儿童数"}
                            {key === "completion" && "完成时间"}
                          </p>
                          <p className="font-heading text-lg font-bold">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Highlights - 仅本地案例显示 */}
                  {"highlights" in caseItem && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">项目亮点</p>
                      <div className="flex flex-wrap gap-2">
                        {(caseItem.highlights as string[]).map((highlight: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-muted text-foreground text-xs font-bold uppercase tracking-wider rounded-none border border-foreground/20"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <a href="#" className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest hover:gap-4 transition-all pt-2">
                    了解详情 <ChevronRight className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-muted border-y-4 border-foreground">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "300+", label: "完成项目" },
              { number: "50,000+", label: "受益学生" },
              { number: "200+", label: "企业客户" },
              { number: "98%", label: "客户满意度" }
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
              准备开启您的项目？
            </h2>
            <p className="text-white/80 text-lg max-w-xl">
              联系我们的专业团队，为您的空间打造完美的家具解决方案。
            </p>
          </div>
          <a href="#contact" className="inline-flex items-center gap-2 px-10 py-4 h-16 text-xl font-heading uppercase tracking-wider bg-secondary text-white hover:bg-white hover:text-primary transition-all rounded-none">
            立即咨询
          </a>
        </div>
      </section>
    </div>
  );
}
