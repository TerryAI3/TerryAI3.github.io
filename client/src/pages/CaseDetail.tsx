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

      {/* 上部分：全宽单张大图轮播 */}
      {images && images.length > 0 && (
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
      )}

      {/* 下部分：文字内容 */}
      <div className="bg-background py-16">
        <div className="container max-w-4xl">
          {/* 案例标题 */}
          <h1 className="font-heading text-5xl font-bold mb-8">{caseData.title}</h1>
          
          {/* 案例信息 */}
          <div className="flex flex-wrap gap-12 mb-12 pb-12 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-2">分类</p>
              <p className="font-semibold text-foreground text-lg">{caseData.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">地点</p>
              <p className="font-semibold text-foreground text-lg">{caseData.location}</p>
            </div>
            {caseData.completedDate && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">完成日期</p>
                <p className="font-semibold text-foreground text-lg">{caseData.completedDate}</p>
              </div>
            )}
          </div>

          {/* 案例描述 */}
          <div className="mb-12">
            <h2 className="font-heading text-3xl font-bold mb-6">项目概述</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {caseData.description}
            </p>
          </div>

          {/* 使用的产品 */}
          {products && products.length > 0 && (
            <div className="mb-12">
              <h3 className="font-heading text-2xl font-bold mb-6">使用的产品</h3>
              <div className="flex flex-wrap gap-3">
                {products.map((product: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium"
                  >
                    {product}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 图片导航 */}
          {images && images.length > 1 && (
            <div className="mt-12 pt-12 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  查看更多图片 ({currentImageIndex + 1} / {images.length})
                </span>
                <div className="flex gap-4">
                  <button
                    onClick={handlePrevImage}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
