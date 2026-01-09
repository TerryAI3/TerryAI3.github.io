import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export default function Products() {
  const [selectedSeries, setSelectedSeries] = useState<number | null>(null);
  
  const { data: seriesList, isLoading: seriesLoading } = trpc.series.list.useQuery();
  const { data: products, isLoading: productsLoading } = trpc.series.getProducts.useQuery(
    selectedSeries!,
    { enabled: selectedSeries !== null }
  );

  const displayProducts = selectedSeries === null 
    ? [] 
    : products || [];

  if (seriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner - Simple */}
      <div className="relative h-[400px] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            OFFICE FURNITURE
          </h1>
          <p className="text-xl text-gray-600">办公家具</p>
        </div>
      </div>

      {/* Product Series Navigation */}
      <div className="bg-white border-b sticky top-20 z-10">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-1">
                Product Line
              </h2>
              <p className="text-gray-500">产品分类</p>
            </div>
            <div className="flex gap-8 overflow-x-auto pb-2">
              {seriesList?.map((series) => (
                <button
                  key={series.id}
                  onClick={() => setSelectedSeries(series.id)}
                  className={`pb-2 whitespace-nowrap transition-all text-lg ${
                    selectedSeries === series.id
                      ? "border-b-2 border-primary text-primary font-semibold"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {series.name}
                  {series.nameEn && (
                    <span className="ml-2 text-sm text-gray-400">
                      {series.nameEn}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        {selectedSeries === null ? (
          <div className="text-center py-32">
            <p className="text-gray-400 text-xl">请选择一个产品系列查看产品</p>
          </div>
        ) : productsLoading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-gray-400 text-xl">该系列暂无产品</p>
            <p className="text-gray-500 mt-4">请使用管理后台添加产品</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <a className="group block bg-white hover:shadow-xl transition-shadow">
                  {/* Product Image */}
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-6xl">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    {product.nameEn && (
                      <p className="text-gray-500 mb-4">{product.nameEn}</p>
                    )}
                    {product.description && (
                      <p className="text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    {product.price && (
                      <p className="text-primary font-semibold mt-4">
                        {product.price}
                      </p>
                    )}
                  </div>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
