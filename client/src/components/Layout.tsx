import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { name: "首页", path: "/" },
    { name: "办公家具", path: "/office" },
    { name: "学校家具", path: "/school" },
    { name: "关于我们", path: "/about" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-body text-foreground selection:bg-secondary selection:text-secondary-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-4 border-foreground bg-background">
        <div className="container flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2">
              <img src="/images/zuodi-logo.png" alt="佐迪" className="h-10 w-auto" />
            </a>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={cn(
                    "text-sm font-medium uppercase tracking-widest transition-colors hover:text-primary",
                    location === item.path ? "text-primary font-bold border-b-2 border-primary" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </a>
              </Link>
            ))}
            <a href="#contact" className="inline-flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-heading uppercase tracking-wider transition-colors">
              获取报价
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t-2 border-foreground bg-background p-4 absolute w-full left-0 top-20 shadow-xl">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a
                    className={cn(
                      "text-lg font-heading uppercase tracking-wider",
                      location === item.path ? "text-primary" : "text-foreground"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
              <Button className="w-full rounded-none font-heading uppercase tracking-wider">
                获取报价
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background border-t-8 border-secondary py-16">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <img src="/images/zuodi-logo.png" alt="佐迪" className="h-12 w-auto" />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              佛山市佐迪智能家具有限公司专注于现代办公与教育空间的家具解决方案。以结构主义美学，重新定义空间功能。
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-widest mb-6 text-secondary">产品系列</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-white transition-colors">行政办公桌</a></li>
              <li><a href="#" className="hover:text-white transition-colors">人体工学椅</a></li>
              <li><a href="#" className="hover:text-white transition-colors">协作会议桌</a></li>
              <li><a href="#" className="hover:text-white transition-colors">智能教室家具</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-widest mb-6 text-secondary">关于我们</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-white transition-colors">品牌故事</a></li>
              <li><a href="#" className="hover:text-white transition-colors">设计理念</a></li>
              <li><a href="#" className="hover:text-white transition-colors">可持续发展</a></li>
              <li><a href="#" className="hover:text-white transition-colors">加入我们</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-widest mb-6 text-secondary">联系方式</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>佛山市三水区云东海街道双子星金融中心916</li>
              <li>contact@zuodi.com</li>
              <li>400-8888-6666</li>
            </ul>
          </div>
        </div>
        <div className="container mt-16 pt-8 border-t border-white/10 text-center text-xs text-muted-foreground uppercase tracking-widest">
          © 2024 佐迪智能家具. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
