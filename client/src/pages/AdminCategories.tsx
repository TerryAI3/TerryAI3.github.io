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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminCategories() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    type: "office" as "office" | "school",
  });

  const { data: categories, isLoading, refetch } = trpc.categories.list.useQuery();
  const createMutation = trpc.categories.create.useMutation();
  const updateMutation = trpc.categories.update.useMutation();
  const deleteMutation = trpc.categories.delete.useMutation();

  // Check authorization
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
          name: formData.name,
          description: formData.description,
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          type: formData.type,
        });
      }
      setIsDialogOpen(false);
      setFormData({
        name: "",
        slug: "",
        description: "",
        type: "office",
      });
      setEditingId(null);
      refetch();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除此分类吗？")) {
      try {
        await deleteMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      type: category.type,
    });
    setIsDialogOpen(true);
  };

  const handleNewCategory = () => {
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      type: "office",
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-8">
        <div className="container flex items-center justify-between">
          <h1 className="font-heading text-4xl font-bold uppercase tracking-wider">
            分类管理
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewCategory} className="rounded-none">
                <Plus className="w-4 h-4 mr-2" />
                新增分类
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "编辑分类" : "新增分类"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">分类名称</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="输入分类名称"
                  />
                </div>
                {!editingId && (
                  <>
                    <div>
                      <Label htmlFor="slug">URL 标识</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        placeholder="输入 URL 标识（如：office-chairs）"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">分类类型</Label>
                      <Select value={formData.type} onValueChange={(value) =>
                        setFormData({ ...formData, type: value as "office" | "school" })
                      }>
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="office">办公系列</SelectItem>
                          <SelectItem value="school">教育系列</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="description">描述</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="输入分类描述"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2 justify-end">
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
      </div>

      {/* Categories Table */}
      <div className="container py-16">
        {!categories || categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">暂无分类</p>
            <Button onClick={handleNewCategory} className="rounded-none">
              <Plus className="w-4 h-4 mr-2" />
              新增分类
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-foreground">
                  <th className="text-left py-4 px-4 font-heading font-bold uppercase">
                    分类名称
                  </th>
                  <th className="text-left py-4 px-4 font-heading font-bold uppercase">
                    类型
                  </th>
                  <th className="text-left py-4 px-4 font-heading font-bold uppercase">
                    描述
                  </th>
                  <th className="text-left py-4 px-4 font-heading font-bold uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category: any) => (
                  <tr
                    key={category.id}
                    className="border-b border-foreground/10 hover:bg-muted transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold">{category.name}</td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1 bg-secondary text-white text-sm rounded">
                        {category.type === 'office' ? '办公系列' : '教育系列'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground text-sm line-clamp-2">
                      {category.description}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                          className="rounded-none"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(category.id)}
                          className="rounded-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
