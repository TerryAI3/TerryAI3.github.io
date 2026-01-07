import { Button } from "@/components/ui/button";
import { ArrowRight, MoveRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-foreground via-foreground to-foreground/80 text-background overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/images/hero-office.jpg" alt="Hero" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
        </div>

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block bg-secondary px-4 py-1 text-xs font-bold uppercase tracking-widest text-white mb-4">
              Living Office
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase leading-[1.1] tracking-tighter">
              设计·定制<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">独特工作场所</span>
            </h1>
            <p className="text-lg text-white/80 max-w-lg font-light border-l-2 border-secondary pl-6">
              激发灵感·分享创意
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/products">
                <Button size="lg" className="rounded-none h-14 px-8 text-lg font-heading uppercase tracking-wider bg-white text-foreground hover:bg-secondary hover:text-white transition-all duration-300">
                  浏览产品
                </Button>
              </Link>
              <Link href="/office">
                <Button variant="outline" size="lg" className="rounded-none h-14 px-8 text-lg font-heading uppercase tracking-wider border-2 border-white text-white hover:bg-white hover:text-foreground transition-all duration-300">
                  办公系列
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values Section */}
      <section className="py-24 bg-background">
        <div className="container space-y-12">
          <div className="space-y-4">
            <h2 className="font-heading text-5xl font-bold uppercase tracking-tighter">
              Living<span className="text-primary">Office</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              不仅是办公空间，更是生活方式的体现
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "设计·定制",
                desc: "为每个企业打造独特的工作场所"
              },
              {
                title: "激发灵感·分享创意",
                desc: "创造激励团队、促进协作的环境"
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-muted border-2 border-foreground/10 hover:border-primary transition-colors">
                <h3 className="font-heading text-2xl font-bold uppercase mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-24 bg-background">
        <div className="container space-y-16">
          <div className="space-y-4">
            <h2 className="font-heading text-5xl font-bold uppercase tracking-tighter">
              产品 <span className="text-primary">系列</span>
            </h2>
            <div className="w-24 h-2 bg-foreground" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Office Collection */}
            <div className="group relative h-96 overflow-hidden border-4 border-foreground">
              <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
                <img src="/images/product-chair.jpg" alt="Office Chair" className="h-full w-full object-cover opacity-90 mix-blend-multiply grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <div className="relative z-10 space-y-4">
                <h2 className="font-heading text-5xl font-bold uppercase tracking-tighter text-white">
                  办公 <br/> 系列
                </h2>
                <p className="text-white/80 max-w-sm">
                  专业办公解决方案。人体工学座椅、行政桌组、协作空间。
                </p>
                <Link href="/office" className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest hover:gap-4 transition-all pt-4">
                  了解详情 <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* School Collection */}
            <div className="group relative h-96 overflow-hidden border-4 border-foreground">
              <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105">
                <img src="/images/product-desk.jpg" alt="School Desk" className="h-full w-full object-cover opacity-80 mix-blend-overlay group-hover:mix-blend-normal transition-all duration-500" />
              </div>
              <div className="relative z-10 space-y-4">
                <h2 className="font-heading text-5xl font-bold uppercase tracking-tighter text-white">
                  教育 <br/> 系列
                </h2>
                <p className="text-white/80 max-w-sm">
                  激发学习潜能的空间设计。课桌椅、图书馆设施、多功能教室。
                </p>
                <Link href="/school" className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest hover:gap-4 transition-all pt-4">
                  了解详情 <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cases Preview Section */}
      <section className="py-32 bg-muted">
        <div className="container space-y-16">
          <div className="space-y-4">
            <h2 className="font-heading text-5xl font-bold uppercase tracking-tighter">
              成功 <span className="text-primary">案例</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "教室改造", desc: "现代化课桌椅系统" },
              { title: "办公升级", desc: "高效协作空间" },
              { title: "学习环境", desc: "激发创意的教育空间" }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-background border-2 border-foreground/10 hover:border-primary transition-colors">
                <h3 className="font-heading text-xl font-bold uppercase mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/cases" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-heading uppercase tracking-wider hover:bg-primary/90 transition-colors">
            查看全部 <MoveRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-24">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="font-heading text-5xl font-bold uppercase tracking-tighter">
              关于 <span className="text-primary">佐迪</span>
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                佐迪智能家具致力于为办公和教育空间设计定制的家具解决方案。
              </p>
              <p>
                我们相信，好的设计能改变空间，定制能创造独特体验，激发灵感是我们的终极使命。
              </p>
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-heading uppercase tracking-wider hover:bg-primary/90 transition-colors">
              了解更多 <MoveRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="bg-muted p-8 border-4 border-foreground">
            <img src="/images/bauhaus-pattern.jpg" alt="Pattern" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4">
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tighter">
              准备升级您的空间？
            </h2>
            <p className="text-white/80 text-lg">
              联系我们的专业团队，打造完美的家具解决方案。
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
