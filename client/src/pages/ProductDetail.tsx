import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import productsData from "@/data-products.json";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const product = productsData.products.find((p: any) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">产品未找到</h1>
          <Button onClick={() => setLocation('/products')}>返回产品列表</Button>
        </div>
      </div>
    );
  }

  const specs = product.features ? { "产品特点": product.features.join(" | ") } : {};

  return (
    <div className="min-h-screen bg-background">
      {/* 返回按钮 */}
      <div className="container py-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/products")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          返回产品列表
        </Button>
      </div>

      {/* 上部分：产品标题和基本信息 */}
      <div className="container max-w-4xl mb-12">
        <h1 className="font-heading text-5xl font-bold mb-8">{product.name}</h1>
        
        <div className="flex flex-wrap gap-12 pb-8 border-b border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-2">产品系列</p>
            <p className="text-lg font-semibold">{product.category || "未分类"}</p>
          </div>
        </div>
      </div>

      {/* 中部分：产品图片竖向排列 */}
      <div className="space-y-8">
        {/* 主图 */}
        {product.image && (
          <div className="w-screen h-96 bg-muted flex items-center justify-center overflow-hidden" style={{ marginLeft: 'calc(-50vw + 50%)' }}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* 下部分：产品描述、规格、相关信息 */}
      <div className="bg-background py-16">
        <div className="container max-w-4xl">
          {/* 产品描述 */}
          <div className="mb-12">
            <h2 className="font-heading text-3xl font-bold mb-6">产品描述</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* 规格参数 */}
          {Object.keys(specs).length > 0 && (
            <div className="mb-12 pb-12 border-b border-border">
              <h3 className="font-heading text-2xl font-bold mb-6">规格参数</h3>
              <div className="space-y-4">
                {Object.entries(specs).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-muted-foreground font-medium">{key}</span>
                    <span className="font-semibold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="flex-1 h-14 font-heading uppercase"
              onClick={() => setLocation("/")}
            >
              获取报价
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
