import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const productId = id ? parseInt(id, 10) : null;

  const { data: product, isLoading, error } = trpc.products.getById.useQuery(
    productId || 0,
    { enabled: !!productId }
  );

  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">产品未找到</h1>
          <Button onClick={() => setLocation('/products')}>返回产品列表</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">产品加载失败</h1>
          <Button onClick={() => setLocation('/products')}>返回产品列表</Button>
        </div>
      </div>
    );
  }

  const images = product.images ? JSON.parse(product.images) : [];
  const specs = product.specifications ? JSON.parse(product.specifications) : {};

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
            <p className="text-sm text-muted-foreground mb-2">产品价格</p>
            <p className="text-3xl font-bold">${product.price}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">产品系列</p>
            <p className="text-lg font-semibold">{product.seriesId ? `系列 ${product.seriesId}` : "未分类"}</p>
          </div>
        </div>
      </div>

      {/* 中部分：产品图片竖向排列 */}
      <div className="space-y-8">
        {/* 主图 */}
        {product.imageUrl && (
          <div className="w-screen h-96 bg-muted flex items-center justify-center overflow-hidden" style={{ marginLeft: 'calc(-50vw + 50%)' }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* 其他图片竖向排列 */}
        {images.length > 0 && (
          <div className="space-y-8">
            {images.map((img: string, idx: number) => (
              <div key={idx} className="w-screen h-96 bg-muted flex items-center justify-center overflow-hidden" style={{ marginLeft: 'calc(-50vw + 50%)' }}>
                <img
                  src={img}
                  alt={`${product.name} - 图片 ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
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
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1 h-14 font-heading uppercase"
              onClick={() => setLocation("/")}
            >
              立即咨询
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
