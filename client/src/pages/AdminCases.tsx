import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Edit2 } from "lucide-react";

export default function AdminCases() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    description: "",
    location: "",
    completedDate: "",
    mainImage: "",
    images: "",
    products: "",
  });

  const { data: cases, refetch } = trpc.cases.list.useQuery();
  const createMutation = trpc.cases.create.useMutation();
  const updateMutation = trpc.cases.update.useMutation();
  const deleteMutation = trpc.cases.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      
      setFormData({
        title: "",
        slug: "",
        category: "",
        description: "",
        location: "",
        completedDate: "",
        mainImage: "",
        images: "",
        products: "",
      });
      setIsCreating(false);
      setEditingId(null);
      refetch();
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这个案例吗？")) {
      try {
        await deleteMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        alert(`Error: ${(error as Error).message}`);
      }
    }
  };

  const handleEdit = (caseItem: any) => {
    setFormData({
      title: caseItem.title,
      slug: caseItem.slug,
      category: caseItem.category,
      description: caseItem.description || "",
      location: caseItem.location || "",
      completedDate: caseItem.completedDate || "",
      mainImage: caseItem.mainImage || "",
      images: caseItem.images || "",
      products: caseItem.products || "",
    });
    setEditingId(caseItem.id);
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">案例管理</h1>
        <Button
          onClick={() => {
            setIsCreating(!isCreating);
            setEditingId(null);
            setFormData({
              title: "",
              slug: "",
              category: "",
              description: "",
              location: "",
              completedDate: "",
              mainImage: "",
              images: "",
              products: "",
            });
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          新增案例
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "编辑案例" : "新增案例"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">案例标题 *</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="如：某某企业办公空间改造"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL Slug *</label>
                  <Input
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="如：company-office-renovation"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">分类 *</label>
                  <Input
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="如：办公空间、教育空间"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">项目地点</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="如：北京市朝阳区"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">完成日期</label>
                <Input
                  type="date"
                  value={formData.completedDate}
                  onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">案例描述</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="详细描述这个案例..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">主图URL</label>
                  <Input
                    value={formData.mainImage}
                    onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">使用的产品（JSON）</label>
                  <Input
                    value={formData.products}
                    onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                    placeholder='["产品1", "产品2"]'
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">其他图片URLs（JSON）</label>
                <Textarea
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder='["https://...", "https://..."]'
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? "更新案例" : "创建案例"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                  }}
                >
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">案例列表</h2>
        {cases && cases.length > 0 ? (
          <div className="grid gap-4">
            {cases.map((caseItem) => (
              <Card key={caseItem.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{caseItem.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">分类: {caseItem.category}</p>
                      {caseItem.location && (
                        <p className="text-sm text-gray-500">地点: {caseItem.location}</p>
                      )}
                      {caseItem.description && (
                        <p className="text-sm mt-2 line-clamp-2">{caseItem.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(caseItem)}
                        className="gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        编辑
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(caseItem.id)}
                        className="gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">暂无案例，点击"新增案例"创建第一个案例</p>
        )}
      </div>
    </div>
  );
}
