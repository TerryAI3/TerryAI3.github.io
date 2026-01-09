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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-[500px] bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">OFFICE FURNITURE</h1>
          <p className="text-2xl">办公家具</p>
        </div>
      </div>

      {/* Product Series Navigation */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center py-6">
            <div className="mr-8">
              <h2 className="text-2xl font-bold text-gray-900">Product Line</h2>
              <p className="text-gray-600">产品分类</p>
            </div>
            <div className="flex gap-6 overflow-x-auto">
              {seriesList?.map((series) => (
                <button
                  key={series.id}
                  onClick={() => setSelectedSeries(series.id)}
                  className={`px-6 py-2 whitespace-nowrap transition-all ${
                    selectedSeries === series.id
                      ? "border-b-4 border-emerald-600 text-emerald-600 font-semibold"
                      : "text-gray-600 hover:text-emerald-600"
                  }`}
                >
                  {series.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        {selectedSeries === null ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">请选择一个产品系列查看产品</p>
          </div>
        ) : productsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">该系列暂无产品</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        暂无图片
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {product.nameEn || product.name}
                      </h3>
                      <p className="text-gray-600">{product.name}</p>
                    </div>
                    {product.description && (
                      <p className="mt-2 text-gray-500 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    )}
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
