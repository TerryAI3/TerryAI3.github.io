import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = id ? parseInt(id) : null;

  const { data: product, isLoading, error } = trpc.products.getById.useQuery(
    productId || 0,
    { enabled: !!productId }
  );

  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">产品未找到</h1>
          <Button onClick={() => window.location.href = '/products'}>返回产品列表</Button>
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
          <Button onClick={() => window.location.href = '/products'}>返回产品列表</Button>
        </div>
      </div>
    );
  }

  const images = product.images ? JSON.parse(product.images) : [];
  const specs = product.specifications ? JSON.parse(product.specifications) : {};

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-8">
        <div className="container">
          <a href="/products" className="inline-flex items-center gap-2 mb-4 hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
            返回产品列表
          </a>
          <h1 className="font-heading text-4xl font-bold uppercase tracking-wider">{product.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-muted p-8 aspect-square flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground">暂无图片</div>
              )}
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img: string, idx: number) => (
                  <div key={idx} className="bg-muted p-2 aspect-square">
                    <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">产品价格</p>
              <p className="text-4xl font-bold">${product.price}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">产品描述</p>
              <p className="text-lg leading-relaxed">{product.description}</p>
            </div>

            {Object.keys(specs).length > 0 && (
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-widest mb-4">规格参数</p>
                <div className="space-y-2 border-l-4 border-primary pl-4">
                  {Object.entries(specs).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button size="lg" className="flex-1 rounded-none h-14 font-heading uppercase">
                加入购物车
              </Button>
              <Button variant="outline" size="lg" className="flex-1 rounded-none h-14 font-heading uppercase">
                立即咨询
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
