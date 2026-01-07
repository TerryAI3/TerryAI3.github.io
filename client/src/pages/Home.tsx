import { Button } from "@/components/ui/button";
import { ArrowRight, MoveRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden bg-foreground text-background flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-office.jpg" 
            alt="Modern Office" 
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/50 to-transparent" />
        </div>
        
        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block bg-secondary px-4 py-1 text-xs font-bold uppercase tracking-widest text-white mb-4">
              佐迪智能家具
            </div>
            <h1 className="font-heading text-6xl md:text-8xl font-bold uppercase leading-[0.9] tracking-tighter">
              定义 <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">你的空间</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg font-light border-l-2 border-secondary pl-6">
              佐迪智能家具为现代办公与教育环境打造的结构主义家具解决方案。理性、耐用、极简。
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/office">
                <Button size="lg" className="rounded-none h-14 px-8 text-lg font-heading uppercase tracking-wider bg-white text-foreground hover:bg-secondary hover:text-white transition-all duration-300">
                  探索办公系列
                </Button>
              </Link>
              <Link href="/school">
                <Button size="lg" variant="outline" className="rounded-none h-14 px-8 text-lg font-heading uppercase tracking-wider border-2 border-white text-white hover:bg-white hover:text-foreground transition-all duration-300 bg-transparent">
                  探索学校系列
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-1/3 h-4 bg-secondary" />
        <div className="absolute top-0 left-0 w-24 h-full border-r border-white/10 hidden xl:block" />
      </section>

      {/* Categories Section - Split Layout */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
        {/* Office Category */}
        <div className="group relative flex flex-col justify-end p-12 md:p-24 border-r border-foreground/10 overflow-hidden bg-muted">
          <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
            <img src="/images/product-chair.jpg" alt="Office Chair" className="h-full w-full object-cover opacity-90 mix-blend-multiply grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
          <div className="relative z-10 space-y-4">
            <h2 className="font-heading text-5xl font-bold uppercase tracking-tighter text-white">
              办公 <br/> 系列
            </h2>
            <p className="text-white/80 max-w-sm">
              提升效率与舒适度的专业办公解决方案。人体工学座椅、行政桌组、协作空间。
            </p>
            <Link href="/office">
              <a className="inline-flex items-center gap-2 text-secondary font-bold uppercase tracking-widest hover:gap-4 transition-all mt-4">
                查看详情 <MoveRight className="h-5 w-5" />
              </a>
            </Link>
          </div>
        </div>

        {/* School Category */}
        <div className="group relative flex flex-col justify-end p-12 md:p-24 overflow-hidden bg-foreground">
          <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
            <img src="/images/product-desk.jpg" alt="School Desk" className="h-full w-full object-cover opacity-80 mix-blend-overlay group-hover:mix-blend-normal transition-all duration-500" />
          </div>
          <div className="relative z-10 space-y-4">
            <h2 className="font-heading text-5xl font-bold uppercase tracking-tighter text-white">
              教育 <br/> 系列
            </h2>
            <p className="text-white/80 max-w-sm">
              激发学习潜能的教育空间设计。耐用课桌椅、图书馆设施、多功能教室。
            </p>
            <Link href="/school">
              <a className="inline-flex items-center gap-2 text-secondary font-bold uppercase tracking-widest hover:gap-4 transition-all mt-4">
                查看详情 <MoveRight className="h-5 w-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature/Philosophy Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <h2 className="font-heading text-6xl font-bold uppercase leading-none tracking-tighter mb-8">
                The <br/> <span className="text-primary">Bauhaus</span> <br/> Standard
              </h2>
              <div className="w-24 h-2 bg-foreground mb-8" />
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4 border-t border-foreground/20 pt-8">
                <h3 className="font-heading text-2xl font-bold uppercase">01. 结构美学</h3>
                <p className="text-muted-foreground leading-relaxed">
                  我们相信美来自于结构本身。摒弃多余装饰，让每一条线、每一个连接点都展示其工程之美。
                </p>
              </div>
              <div className="space-y-4 border-t border-foreground/20 pt-8">
                <h3 className="font-heading text-2xl font-bold uppercase">02. 极致耐用</h3>
                <p className="text-muted-foreground leading-relaxed">
                  选用顶级材料，经过严格的压力测试。我们的家具不仅是展示品，更是可以陪伴数十年高强度使用的工具。
                </p>
              </div>
              <div className="space-y-4 border-t border-foreground/20 pt-8">
                <h3 className="font-heading text-2xl font-bold uppercase">03. 人体工学</h3>
                <p className="text-muted-foreground leading-relaxed">
                  形式追随功能。每一个弧度都经过精密计算，为长时间工作和学习提供最佳的身体支撑。
                </p>
              </div>
              <div className="space-y-4 border-t border-foreground/20 pt-8">
                <h3 className="font-heading text-2xl font-bold uppercase">04. 模块化设计</h3>
                <p className="text-muted-foreground leading-relaxed">
                  适应不断变化的空间需求。我们的系统家具可以灵活组合、拆分、重组，随您的业务一同成长。
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
           <img src="/images/bauhaus-pattern.jpg" alt="Pattern" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4">
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tighter">
              准备好升级您的空间了吗？
            </h2>
            <p className="text-white/80 text-lg max-w-xl">
              联系我们的设计顾问，获取免费的空间规划方案与报价。
            </p>
          </div>
          <Button size="lg" className="rounded-none h-16 px-10 text-xl font-heading uppercase tracking-wider bg-secondary text-white hover:bg-white hover:text-primary shadow-xl transition-all">
            立即咨询 <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>
    </div>
  );
}
