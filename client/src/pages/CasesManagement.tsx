import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

export default function CasesManagement() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    description: '',
    location: '',
    completedDate: '',
    mainImage: '',
    images: '',
    products: '',
  });

  const utils = trpc.useUtils();
  const { data: cases = [], isLoading } = trpc.cases.list.useQuery();
  
  const createMutation = trpc.cases.create.useMutation({
    onSuccess: () => {
      utils.cases.list.invalidate();
      resetForm();
      setIsOpen(false);
    },
  });

  const updateMutation = trpc.cases.update.useMutation({
    onSuccess: () => {
      utils.cases.list.invalidate();
      resetForm();
      setIsOpen(false);
    },
  });

  const deleteMutation = trpc.cases.delete.useMutation({
    onSuccess: () => {
      utils.cases.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      category: '',
      description: '',
      location: '',
      completedDate: '',
      mainImage: '',
      images: '',
      products: '',
    });
    setEditingId(null);
  };

  const handleEdit = (caseItem: any) => {
    setEditingId(caseItem.id);
    setFormData({
      title: caseItem.title,
      slug: caseItem.slug,
      category: caseItem.category,
      description: caseItem.description || '',
      location: caseItem.location || '',
      completedDate: caseItem.completedDate || '',
      mainImage: caseItem.mainImage || '',
      images: caseItem.images || '',
      products: caseItem.products || '',
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        ...formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个案例吗？')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  // Check admin access
  if (!user || user.role !== 'admin') {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">您没有权限访问此页面</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">案例管理</h1>
        <p className="text-muted-foreground">管理办公空间案例展示</p>
      </div>

      <div className="mb-6">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsOpen(true); }} className="gap-2">
              <Plus className="w-4 h-4" />
              添加新案例
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? '编辑案例' : '添加新案例'}</DialogTitle>
              <DialogDescription>
                填写案例信息，所有字段都是可选的
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">案例标题 *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：高层办公空间改造"
                />
              </div>

              <div>
                <label className="text-sm font-medium">URL Slug *</label>
                <Input
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="例如：high-rise-office"
                />
              </div>

              <div>
                <label className="text-sm font-medium">分类 *</label>
                <Input
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="例如：办公空间"
                />
              </div>

              <div>
                <label className="text-sm font-medium">描述</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="案例详细描述"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">位置</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="例如：北京市朝阳区"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">完成日期</label>
                  <Input
                    value={formData.completedDate}
                    onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
                    placeholder="例如：2024-01"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">主图URL</label>
                <Input
                  value={formData.mainImage}
                  onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="text-sm font-medium">其他图片URLs (JSON数组)</label>
                <Textarea
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder='["https://example.com/img1.jpg", "https://example.com/img2.jpg"]'
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">相关产品 (JSON)</label>
                <Textarea
                  value={formData.products}
                  onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                  placeholder='{"chairs": "5", "tables": "3"}'
                  rows={3}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  取消
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingId ? '更新案例' : '创建案例'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">加载中...</p>
            </CardContent>
          </Card>
        ) : cases.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">暂无案例，点击上方按钮添加新案例</p>
            </CardContent>
          </Card>
        ) : (
          cases.map((caseItem: any) => (
            <Card key={caseItem.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{caseItem.title}</CardTitle>
                    <CardDescription>{caseItem.category} • {caseItem.location}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(caseItem)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      编辑
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(caseItem.id)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{caseItem.description}</p>
                {caseItem.mainImage && (
                  <img 
                    src={caseItem.mainImage} 
                    alt={caseItem.title}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                )}
                <p className="text-xs text-muted-foreground">
                  完成日期: {caseItem.completedDate || '未设置'} • 创建于: {new Date(caseItem.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
