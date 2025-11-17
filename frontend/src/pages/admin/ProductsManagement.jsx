 import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, getCategories, adminCreateCategory } from '@/services/api'
import { uploadImage, createProduct } from '@/services/uploadService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPrice } from '@/lib/utils'
import { Plus, Pencil, Trash2, Eye, Upload, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ProductsManagement() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImages, setSelectedImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    sale_price: '',
    stock: '',
    category_id: '',
    brand: '',
    is_featured: false,
    is_active: true,
  })

  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategorySlug, setNewCategorySlug] = useState('')
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', searchTerm],
    queryFn: async () => {
      const res = await getProducts({ limit: 100, search: searchTerm })
      return res.data
    },
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await getCategories()
      return res.data
    },
  })

  const createMutation = useMutation({
    mutationFn: ({ data, images }) => adminCreateProduct(data, images),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products'])
      setIsDialogOpen(false)
      resetForm()
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được tạo thành công.",
      })
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo sản phẩm.",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminUpdateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products'])
      setIsDialogOpen(false)
      resetForm()
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được cập nhật thành công.",
      })
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật sản phẩm.",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminDeleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products'])
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được xóa thành công.",
      })
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa sản phẩm.",
        variant: "destructive",
      })
    },
  })

  const createCategoryMutation = useMutation({
    mutationFn: adminCreateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
      setShowNewCategoryForm(false)
      setNewCategoryName('')
      setNewCategorySlug('')
      toast({
        title: "Thành công",
        description: "Danh mục đã được tạo thành công.",
      })
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo danh mục.",
        variant: "destructive",
      })
    },
  })

  const products = productsData?.data || []
  const categories = categoriesData?.data || []

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      sale_price: '',
      stock: '',
      category_id: '',
      brand: '',
      is_featured: false,
      is_active: true,
    })
    setSelectedImages([])
    setImagePreviews([])
    setEditingProduct(null)
  }

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: product.price,
        sale_price: product.sale_price || '',
        stock: product.stock,
        category_id: product.category_id,
        brand: product.brand || '',
        is_featured: product.is_featured,
        is_active: product.is_active,
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setSelectedImages(files)

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setSelectedImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = {
      ...formData,
      price: parseFloat(formData.price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      stock: parseInt(formData.stock),
      category_id: parseInt(formData.category_id),
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data })
    } else {
      createMutation.mutate({ data, images: selectedImages })
    }
  }

  const handleCategoryChange = (value) => {
    if (value === 'new') {
      setShowNewCategoryForm(true)
    } else {
      setFormData({ ...formData, category_id: value })
    }
  }

  const handleCreateCategory = (e) => {
    e.preventDefault()
    if (newCategoryName.trim()) {
      const slug = newCategorySlug.trim() || generateSlug(newCategoryName)
      createCategoryMutation.mutate({ name: newCategoryName, slug })
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      deleteMutation.mutate(id)
    }
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tên sản phẩm</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Danh mục</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Giá</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tồn kho</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{product.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image_url || 'https://placehold.co/50x50?text=P'}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium line-clamp-1">{product.name}</p>
                            {product.is_featured && (
                              <span className="text-xs text-blue-600">⭐ Nổi bật</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{product.category_name || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        {product.sale_price && (
                          <span className="line-through text-gray-400 block text-xs">
                            {formatPrice(product.price)}
                          </span>
                        )}
                        <span className="font-semibold">
                          {formatPrice(product.sale_price || product.price)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{product.stock}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.is_active ? 'Hoạt động' : 'Ẩn'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </DialogTitle>
            <DialogDescription>
              Điền thông tin sản phẩm dưới đây
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Tên sản phẩm *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (!editingProduct) {
                      setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))
                    }
                  }}
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Mô tả</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="price">Giá gốc *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="sale_price">Giá khuyến mãi</Label>
                <Input
                  id="sale_price"
                  type="number"
                  value={formData.sale_price}
                  onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="stock">Tồn kho *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category_id">Danh mục *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">+ Thêm danh mục mới</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="brand">Thương hiệu</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_featured">Sản phẩm nổi bật</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_active">Hiển thị</Label>
              </div>

              {/* Image Upload */}
              {!editingProduct && (
                <div className="col-span-2">
                  <Label htmlFor="images">Hình ảnh sản phẩm</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Nhấp để chọn hình ảnh hoặc kéo thả vào đây
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF tối đa 10MB</p>
                      </div>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Category Dialog */}
      <Dialog open={showNewCategoryForm} onOpenChange={setShowNewCategoryForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm danh mục mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin cho danh mục mới
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <Label htmlFor="newCategoryName">Tên danh mục *</Label>
              <Input
                id="newCategoryName"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value)
                  if (!newCategorySlug) {
                    setNewCategorySlug(generateSlug(e.target.value))
                  }
                }}
                required
              />
            </div>

            <div>
              <Label htmlFor="newCategorySlug">Slug *</Label>
              <Input
                id="newCategorySlug"
                value={newCategorySlug}
                onChange={(e) => setNewCategorySlug(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowNewCategoryForm(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={createCategoryMutation.isPending}>
                {createCategoryMutation.isPending ? 'Đang tạo...' : 'Tạo danh mục'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
