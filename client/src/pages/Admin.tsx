import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Package, FolderTree, Upload, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">无权限访问</h1>
          <p className="text-muted-foreground mb-4">您需要管理员权限才能访问此页面</p>
          <Button onClick={() => navigate("/")}>返回首页</Button>
        </div>
      </div>
    );
  }

  const adminModules = [
    {
      title: "产品系列管理",
      description: "管理产品系列分类，添加、编辑、删除系列",
      icon: FolderTree,
      path: "/admin/series",
      color: "bg-blue-500",
    },
    {
      title: "产品管理",
      description: "管理单个产品，编辑产品信息和图片",
      icon: Package,
      path: "/admin/products",
      color: "bg-green-500",
    },
    {
      title: "批量导入",
      description: "批量导入产品数据，快速添加多个产品",
      icon: Upload,
      path: "/admin/import",
      color: "bg-purple-500",
    },
    {
      title: "数据统计",
      description: "查看产品数量、访问统计等数据",
      icon: BarChart3,
      path: "/admin/stats",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">管理后台</h1>
          <p className="text-gray-600">欢迎，{user.name || "管理员"}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminModules.map((module) => (
            <button
              key={module.path}
              onClick={() => navigate(module.path)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-6 text-left group"
            >
              <div
                className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <module.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {module.title}
              </h3>
              <p className="text-sm text-gray-600">{module.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">快速开始</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-primary">1.</span>
              <p>
                首先在<strong>产品系列管理</strong>中确认已有的8个系列（黎明Dawn、杰瑞Jerry等）
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-primary">2.</span>
              <p>
                使用<strong>批量导入</strong>功能快速添加产品，支持从文本粘贴或逐个添加
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-primary">3.</span>
              <p>
                在<strong>产品管理</strong>中可以编辑单个产品的详细信息
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-primary">4.</span>
              <p>
                产品图片可以使用 Google Drive 共享链接或上传到图床后使用URL
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-blue-900">💡 提示</h3>
          <p className="text-sm text-blue-800">
            所有修改会立即生效并显示在前台产品中心页面。建议先添加少量产品测试效果，确认无误后再批量导入。
          </p>
        </div>
      </div>
    </div>
  );
}
