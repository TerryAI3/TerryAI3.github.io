import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
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

      {/* 案例标题和基本信息 */}
      <div className="container max-w-4xl mb-12">
        <h1 className="font-heading text-5xl font-bold mb-6">{caseData.title}</h1>
        
        <div className="flex flex-wrap gap-12 pb-8 border-b border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-2">分类</p>
            <p className="text-lg font-semibold">{caseData.category || "未分类"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">地点</p>
            <p className="text-lg font-semibold">{caseData.location || "未指定"}</p>
          </div>
        </div>
      </div>

      {/* 案例描述 */}
      <div className="container max-w-4xl mb-16">
        <h2 className="font-heading text-2xl font-bold mb-4">项目概述</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {caseData.description}
        </p>
      </div>

      {/* 案例图片竖向排列 */}
      <div className="space-y-0">
        {images.length > 0 ? (
          images.map((img: string, idx: number) => (
            <div key={idx} className="w-screen h-96 bg-muted flex items-center justify-center overflow-hidden" style={{ marginLeft: 'calc(-50vw + 50%)' }}>
              <img
                src={img}
                alt={`${caseData.title} - 图片 ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))
        ) : (
          <div className="container py-12 text-center text-muted-foreground">
            暂无图片
          </div>
        )}
      </div>



      {/* CTA 按钮 */}
      <div className="container max-w-4xl py-16">
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
  );
}
