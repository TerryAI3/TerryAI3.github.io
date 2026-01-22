import { Button } from "@/components/ui/button";

import { CheckCircle2 } from "lucide-react";

export default function About() {
  const values = [
    {
      title: "结构主义美学",
      description: "我们相信美来自于结构本身。摒弃多余装饰，让每一条线、每一个连接点都展示其工程之美。"
    },
    {
      title: "极致耐用",
      description: "选用顶级材料，经过严格的压力测试。我们的家具不仅是展示品，更是可以陪伴数十年高强度使用的工具。"
    },
    {
      title: "人体工学",
      description: "形式追随功能。每一个弧度都经过精密计算，为长时间工作和学习提供最佳的身体支撑。"
    },
    {
      title: "模块化设计",
      description: "适应不断变化的空间需求。我们的系统家具可以灵活组合、拆分、重组，随您的业务一同成长。"
    }
  ];

  const certifications = [
    "ISO 9001 质量管理体系认证",
    "ISO 14001 环保管理体系认证",
    "OHSAS 18000 职业健康安全认证",
    "国家高新技术企业",
    "多项产品专利"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="container space-y-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground uppercase tracking-widest">
            <a href="/" className="hover:text-secondary transition-colors">首页</a>
            <span>/</span>
            <span className="text-secondary font-bold">关于我们</span>
          </div>
          <h1 className="font-heading text-6xl font-bold uppercase tracking-tighter max-w-3xl">
            关于 <span className="text-secondary">佐迪</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            佛山市佐迪智能家具有限公司致力于为现代办公与教育环境提供高品质的家具解决方案。
          </p>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-24 border-b-4 border-secondary">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="font-heading text-5xl font-bold uppercase tracking-tighter">
              我们的故事
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                佐迪智能家具成立于2015年，总部位于佛山市三水区。我们专注于研发和生产适应现代办公与教育空间的高端家具产品。
              </p>
              <p>
                从最初的小型工坊，到如今拥有现代化生产基地和专业设计团队的企业，佐迪始终坚持"结构主义"的设计理念，致力于将功能美学与工程卓越完美结合。
              </p>
              <p>
                我们的产品已服务于数百所学校、数千家企业，获得了市场和用户的广泛认可。我们不仅提供产品，更提供完整的空间解决方案和贴心的售后服务。
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-muted p-8 border-l-8 border-primary">
              <h3 className="font-heading text-2xl font-bold uppercase mb-4">公司信息</h3>
              <ul className="space-y-3 text-sm">
                <li><strong>公司名称：</strong> 佛山市佐迪智能家具有限公司</li>
                <li><strong>成立时间：</strong> 2015年</li>
                <li><strong>总部地址：</strong> 佛山市三水区云东海街道双子星金融中心916</li>
                <li><strong>员工规模：</strong> 200+人</li>
                <li><strong>生产基地：</strong> 佛山市三水区工业园</li>
              </ul>
            </div>
            <div className="bg-muted p-8 border-l-8 border-secondary">
              <h3 className="font-heading text-2xl font-bold uppercase mb-4">联系我们</h3>
              <ul className="space-y-2 text-sm">
                <li>📞 400-8888-6666</li>
                <li>📧 contact@zuodi.com</li>
                <li>🕐 工作时间：周一至周五 09:00-18:00</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="container space-y-16">
          <div className="space-y-4">
            <h2 className="font-heading text-5xl font-bold uppercase tracking-tighter">
              核心价值观
            </h2>
            <div className="w-24 h-2 bg-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {values.map((value, index) => (
              <div key={index} className="space-y-4 border-t-2 border-foreground pt-8">
                <h3 className="font-heading text-2xl font-bold uppercase">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 bg-muted border-y-4 border-foreground">
        <div className="container space-y-12">
          <div className="space-y-4">
            <h2 className="font-heading text-5xl font-bold uppercase tracking-tighter">
              资质认证
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              佐迪通过了多项国际和国内认证，确保产品质量和服务标准达到行业最高水平。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-background border-2 border-foreground">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <span className="font-heading text-lg font-bold uppercase">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Promise */}
      <section className="py-24">
        <div className="container">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="font-heading text-5xl font-bold uppercase tracking-tighter">
                一站式服务承诺
              </h2>
              <div className="w-24 h-2 bg-secondary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: "01", title: "专业咨询", desc: "资深设计师为您的空间量身定制解决方案" },
                { num: "02", title: "精心设计", desc: "从空间规划到产品选型，全程专业指导" },
                { num: "03", title: "优质制造", desc: "采用先进工艺和优质材料，确保产品质量" },
                { num: "04", title: "安全物流", desc: "专业物流团队确保产品安全送达" },
                { num: "05", title: "专业安装", desc: "经验丰富的安装团队提供规范安装服务" },
                { num: "06", title: "贴心售后", desc: "5年质保，24小时售后服务热线" }
              ].map((service, index) => (
                <div key={index} className="space-y-4 text-center p-8 border-2 border-foreground/10 hover:border-primary transition-colors">
                  <div className="font-heading text-5xl font-bold text-primary">{service.num}</div>
                  <h3 className="font-heading text-xl font-bold uppercase">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4">
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tighter">
              准备好开始了吗？
            </h2>
            <p className="text-white/80 text-lg max-w-xl">
              联系我们的专业团队，为您的空间打造完美的家具解决方案。
            </p>
          </div>
          <Button size="lg" className="rounded-none h-16 px-10 text-xl font-heading uppercase tracking-wider bg-secondary text-white hover:bg-white hover:text-primary">
            立即咨询
          </Button>
        </div>
      </section>
    </div>
  );
}
