import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, Edit2, Trash2, Plus } from "lucide-react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function AdminSeries() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    code: "",
    description: "",
    coverImage: "",
    sortOrder: 0,
  });

  const { data: seriesList, isLoading, refetch } = trpc.series.list.useQuery();
  const createMutation = trpc.series.create.useMutation();
  const updateMutation = trpc.series.update.useMutation();
  const deleteMutation = trpc.series.delete.useMutation();

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

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync({
          ...formData,
          slug: (formData.nameEn || formData.code).toLowerCase().replace(/\s+/g, "-"),
        });
      }
      setIsDialogOpen(false);
      setFormData({
        name: "",
        nameEn: "",
        code: "",
        description: "",
        coverImage: "",
        sortOrder: 0,
      });
      setEditingId(null);
      refetch();
    } catch (error) {
      console.error("Error:", error);
      alert("操作失败，请检查数据");
    }
  };

  const handleEdit = (series: any) => {
    setEditingId(series.id);
    setFormData({
      name: series.name,
      nameEn: series.nameEn || "",
      code: series.code,
      description: series.description || "",
      coverImage: series.coverImage || "",
      sortOrder: series.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleNewSeries = () => {
    setEditingId(null);
    setFormData({
      name: "",
      nameEn: "",
      code: "",
      description: "",
      coverImage: "",
      sortOrder: 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除此系列吗？删除后该系列下的产品将无法显示。")) {
      try {
        await deleteMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error("Error:", error);
        alert("删除失败");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">产品系列管理</h1>
            <p className="text-gray-600">管理产品系列分类</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewSeries}>
                <Plus className="w-4 h-4 mr-2" />
                添加系列
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "编辑系列" : "添加新系列"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>系列名称（中文）*</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="例：黎明"
                    />
                  </div>
                  <div>
                    <Label>系列名称（英文）</Label>
                    <Input
                      value={formData.nameEn}
                      onChange={(e) =>
                        setFormData({ ...formData, nameEn: e.target.value })
                      }
                      placeholder="例：Dawn"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>系列代码*</Label>
                    <Input
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      placeholder="例：DAWN"
                    />
                  </div>
                  <div>
                    <Label>排序顺序</Label>
                    <Input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sortOrder: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="数字越小越靠前"
                    />
                  </div>
                </div>

                <div>
                  <Label>系列描述</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="系列简介和特点"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>封面图片URL</Label>
                  <Input
                    value={formData.coverImage}
                    onChange={(e) =>
                      setFormData({ ...formData, coverImage: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingId ? "更新" : "创建"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  系列名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  代码
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  排序
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {seriesList?.map((series) => (
                <tr key={series.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {series.name}
                      </div>
                      {series.nameEn && (
                        <div className="text-sm text-gray-500">
                          {series.nameEn}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {series.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {series.sortOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        series.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {series.isActive ? "启用" : "禁用"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(series)}
                      className="mr-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(series.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
