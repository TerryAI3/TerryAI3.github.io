import { useState } from "react";
import productsData from "@/data-products.json";

export default function Products() {
  // Extract series from categories in productsData
  const seriesList = productsData.categories.map((c: any, index: number) => ({
    id: index + 1,
    name: c.name,
    nameEn: c.id,
    description: c.description
  }));

  const [selectedSeries, setSelectedSeries] = useState<number>(seriesList[0]?.id || 1);

  const displayProducts = productsData.products.filter(
    (p: any) => p.category === seriesList.find((s: any) => s.id === selectedSeries)?.name
  );

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
              {seriesList.map((series) => (
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
        {displayProducts.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-gray-400 text-xl">该系列暂无产品</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayProducts.map((product: any) => (
              <a key={product.id} href={`/products/${product.id}`} className="group block bg-white hover:shadow-xl transition-shadow">
                  {/* Product Image */}
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
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
                    {product.description && (
                      <p className="text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
