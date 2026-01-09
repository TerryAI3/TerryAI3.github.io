import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Plus, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductImportRow {
  id: string;
  name: string;
  nameEn: string;
  seriesId: number;
  description: string;
  imageUrl: string;
  specifications: string;
  price: string;
}

export default function AdminProductImport() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<ProductImportRow[]>([]);
  const [importing, setImporting] = useState(false);

  const { data: seriesList } = trpc.series.list.useQuery();
  const createMutation = trpc.products.create.useMutation();

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

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        name: "",
        nameEn: "",
        seriesId: seriesList?.[0]?.id || 1,
        description: "",
        imageUrl: "",
        specifications: "",
        price: "",
      },
    ]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (id: string, field: keyof ProductImportRow, value: any) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      for (const product of products) {
        if (!product.name || !product.seriesId) continue;
        
        await createMutation.mutateAsync({
          name: product.name,
          nameEn: product.nameEn || undefined,
          seriesId: product.seriesId,
          slug: (product.nameEn || product.name).toLowerCase().replace(/\s+/g, "-"),
          description: product.description || undefined,
          imageUrl: product.imageUrl || undefined,
          specifications: product.specifications || undefined,
          price: product.price || undefined,
        });
      }
      alert(`成功导入 ${products.length} 个产品！`);
      setProducts([]);
    } catch (error) {
      console.error("导入失败:", error);
      alert("导入失败，请检查数据");
    } finally {
      setImporting(false);
    }
  };

  const parseFromText = () => {
    const text = prompt(
      "请粘贴产品数据（每行一个产品，格式：中文名|英文名|系列ID|描述|图片URL|规格|价格）"
    );
    if (!text) return;

    const lines = text.trim().split("\n");
    const newProducts: ProductImportRow[] = lines.map((line, index) => {
      const parts = line.split("|");
      return {
        id: Date.now().toString() + index,
        name: parts[0]?.trim() || "",
        nameEn: parts[1]?.trim() || "",
        seriesId: parseInt(parts[2]?.trim()) || seriesList?.[0]?.id || 1,
        description: parts[3]?.trim() || "",
        imageUrl: parts[4]?.trim() || "",
        specifications: parts[5]?.trim() || "",
        price: parts[6]?.trim() || "",
      };
    });

    setProducts([...products, ...newProducts]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">产品批量导入</h1>
          <p className="text-gray-600">批量添加产品到数据库</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <Button onClick={addProduct}>
              <Plus className="w-4 h-4 mr-2" />
              添加产品
            </Button>
            <Button onClick={parseFromText} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              从文本导入
            </Button>
            <Button
              onClick={handleImport}
              disabled={products.length === 0 || importing}
              className="ml-auto"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  导入中...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  批量导入 ({products.length})
                </>
              )}
            </Button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无待导入产品，点击"添加产品"开始</p>
            </div>
          ) : (
            <div className="space-y-6">
              {products.map((product, index) => (
                <div key={product.id} className="border rounded-lg p-4 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeProduct(product.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>产品名称（中文）*</Label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={product.name}
                        onChange={(e) =>
                          updateProduct(product.id, "name", e.target.value)
                        }
                        placeholder="例：帕克办公桌"
                      />
                    </div>

                    <div>
                      <Label>产品名称（英文）</Label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={product.nameEn}
                        onChange={(e) =>
                          updateProduct(product.id, "nameEn", e.target.value)
                        }
                        placeholder="例：Parker"
                      />
                    </div>

                    <div>
                      <Label>所属系列*</Label>
                      <Select
                        value={product.seriesId.toString()}
                        onValueChange={(value) =>
                          updateProduct(product.id, "seriesId", parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {seriesList?.map((series) => (
                            <SelectItem key={series.id} value={series.id.toString()}>
                              {series.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>价格</Label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={product.price}
                        onChange={(e) =>
                          updateProduct(product.id, "price", e.target.value)
                        }
                        placeholder="例：¥5,800"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>产品描述</Label>
                      <Textarea
                        value={product.description}
                        onChange={(e) =>
                          updateProduct(product.id, "description", e.target.value)
                        }
                        placeholder="产品简介和特点"
                        rows={2}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>产品图片URL</Label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={product.imageUrl}
                        onChange={(e) =>
                          updateProduct(product.id, "imageUrl", e.target.value)
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>产品规格</Label>
                      <Textarea
                        value={product.specifications}
                        onChange={(e) =>
                          updateProduct(product.id, "specifications", e.target.value)
                        }
                        placeholder="尺寸、材质等规格信息"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">使用说明</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 点击"添加产品"逐个添加产品信息</li>
            <li>• 点击"从文本导入"可批量粘贴产品数据（格式：中文名|英文名|系列ID|描述|图片URL|规格|价格）</li>
            <li>• 产品名称和所属系列为必填项</li>
            <li>• 图片URL可以使用 Google Drive 共享链接或其他图床</li>
            <li>• 填写完成后点击"批量导入"保存到数据库</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
