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

export default function AdminProducts() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  const { data: products, isLoading, refetch } = trpc.products.list.useQuery();
  const createMutation = trpc.products.create.useMutation();
  const updateMutation = trpc.products.update.useMutation();
  const deleteMutation = trpc.products.delete.useMutation();

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
          ...formData,
        });
      } else {
        await createMutation.mutateAsync({
          categoryId: 1,
          slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
          ...formData,
        });
      }
      setIsDialogOpen(false);
      setFormData({ name: "", description: "", price: "", imageUrl: "" });
      setEditingId(null);
      refetch();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除此产品吗？")) {
      try {
        await deleteMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      imageUrl: product.imageUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleNewProduct = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", price: "", imageUrl: "" });
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
            产品管理
          </h1>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate("/admin/categories")} 
              variant="outline" 
              className="rounded-none text-foreground border-background hover:bg-background hover:text-foreground"
            >
              分类管理
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewProduct} className="rounded-none">
                  <Plus className="w-4 h-4 mr-2" />
                  新增产品
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "编辑产品" : "新增产品"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">产品名称</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="输入产品名称"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">价格</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="输入价格"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">描述</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="输入产品描述"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">图片 URL</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      placeholder="输入图片 URL"
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
      </div>

      {/* Products Table */}
      <div className="container py-16">
        {!products || products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">暂无产品</p>
            <Button onClick={handleNewProduct} className="rounded-none">
              <Plus className="w-4 h-4 mr-2" />
              新增产品
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-foreground">
                  <th className="text-left py-4 px-4 font-heading font-bold uppercase">
                    产品名称
                  </th>
                  <th className="text-left py-4 px-4 font-heading font-bold uppercase">
                    价格
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
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-foreground/10 hover:bg-muted transition-colors"
                  >
                    <td className="py-4 px-4">{product.name}</td>
                    <td className="py-4 px-4">¥{product.price}</td>
                    <td className="py-4 px-4 text-muted-foreground text-sm line-clamp-2">
                      {product.description}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          className="rounded-none"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
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
