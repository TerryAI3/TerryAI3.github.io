import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const caseId = id ? parseInt(id, 10) : null;
  const { data: caseData, isLoading: loading, error } = trpc.cases.getById.useQuery(
    caseId || 0,
    { enabled: !!caseId }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error?.message || "案例不存在"}</p>
          <Button onClick={() => setLocation("/cases")}>返回案例列表</Button>
        </div>
      </div>
    );
  }

  // 解析JSON字符串数据
  const products = typeof caseData.products === 'string' ? JSON.parse(caseData.products) : caseData.products || [];
  const images = typeof caseData.images === 'string' ? JSON.parse(caseData.images) : caseData.images || [];
  
  // 处理图片轮播
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 返回按钮 */}
      <div className="container py-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/cases")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          返回案例列表
        </Button>
      </div>

      {/* 案例标题 */}
      <div className="bg-muted py-12">
        <div className="container">
          <h1 className="font-heading text-5xl font-bold mb-4">{caseData.title}</h1>
          <div className="flex flex-wrap gap-6 text-muted-foreground">
            <div>
              <p className="text-sm text-muted-foreground">分类</p>
              <p className="font-semibold text-foreground">{caseData.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">地点</p>
              <p className="font-semibold text-foreground">{caseData.location}</p>
            </div>
            {caseData.completedDate && (
              <div>
                <p className="text-sm text-muted-foreground">完成日期</p>
                <p className="font-semibold text-foreground">{caseData.completedDate}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 主图 */}
      {caseData.mainImage && (
        <div className="container py-12">
          <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
            <img
              src={caseData.mainImage}
              alt={caseData.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* 案例描述 */}
      <div className="container py-12">
        <div className="max-w-3xl">
          <h2 className="font-heading text-3xl font-bold mb-6">项目概述</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {caseData.description}
          </p>

          {/* 使用的产品 */}
          {products && products.length > 0 && (
            <div className="mb-12">
              <h3 className="font-heading text-2xl font-bold mb-4">使用的产品</h3>
              <div className="flex flex-wrap gap-3">
                {products.map((product: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {product}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 项目图片库 */}
      {images && images.length > 0 && (
        <>
          {/* 主图轮播 - 全宽 */}
          <div className="relative w-screen h-96 bg-background overflow-hidden group" style={{ marginLeft: 'calc(-50vw + 50%)' }}>
            <img
              src={images[currentImageIndex]}
              alt={`${caseData.title} - 图片 ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {/* 左箭头 */}
            {images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            
            {/* 右箭头 */}
            {images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
            
            {/* 图片计数器 */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
          
          {/* 缩略图网格和标题 */}
          <div className="bg-muted py-12">
            <div className="container">
              <h2 className="font-heading text-3xl font-bold mb-8">项目图片</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-full h-32 bg-background rounded-lg overflow-hidden transition-all ${
                      idx === currentImageIndex
                        ? 'ring-2 ring-primary shadow-lg'
                        : 'hover:shadow-md opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${caseData.title} - 缩略图 ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* CTA 区域 */}
      <div className="container py-12">
        <div className="bg-primary text-primary-foreground rounded-lg p-12 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">对这个项目感兴趣？</h2>
          <p className="text-lg mb-8 opacity-90">
            联系我们的专业团队，了解更多关于这个项目的详情或获取类似的解决方案
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setLocation("/")}
            className="h-12 px-8 text-base font-semibold"
          >
            获取报价
          </Button>
        </div>
      </div>
    </div>
  );
}
