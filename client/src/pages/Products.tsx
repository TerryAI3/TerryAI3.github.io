import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";

export default function Products() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery();
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();

  const filteredProducts = selectedType
    ? products?.filter(p => {
        const category = categories?.find(c => c.id === p.categoryId);
        return category?.type === selectedType;
      })
    : products;

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-16">
        <div className="container">
          <h1 className="font-heading text-6xl font-bold uppercase tracking-wider mb-4">
            产品 <span className="text-secondary">中心</span>
          </h1>
          <p className="text-xl text-background/80 max-w-2xl">
            专业的办公和教育家具解决方案，为您的空间增添品质与创意。
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-muted py-8 border-b">
        <div className="container">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              onClick={() => setSelectedType(null)}
              className="rounded-none"
            >
              全部产品
            </Button>
            <Button
              variant={selectedType === "office" ? "default" : "outline"}
              onClick={() => setSelectedType("office")}
              className="rounded-none"
            >
              办公系列
            </Button>
            <Button
              variant={selectedType === "school" ? "default" : "outline"}
              onClick={() => setSelectedType("school")}
              className="rounded-none"
            >
              教育系列
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container py-16">
        {!filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">暂无产品</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group cursor-pointer h-full">
                  <div className="bg-muted aspect-square overflow-hidden mb-4 border-2 border-foreground/10 group-hover:border-primary transition-colors">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        暂无图片
                      </div>
                    )}
                  </div>

                  <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xl">¥{product.price}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-none"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
