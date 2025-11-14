import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  getProducts,
  getCategories,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
} from '@/services/api'

// Components
import Breadcrumb from '@/components/products/Breadcrumb'
import SearchBar from '@/components/products/SearchBar'
import SortAndViewControls from '@/components/products/SortAndViewControls'
import SidebarFilters from '@/components/products/SidebarFilters'
import ProductGrid from '@/components/products/ProductGrid'
import Pagination from '@/components/products/Pagination'
import QuickViewModal from '@/components/products/QuickViewModal'
import AdminProductDialog from '@/components/products/AdminProductDialog'

export default function KitchenProductListing() {
  const { toast } = useToast()
  const navigate = useNavigate()

  // --- State ---
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceRange, setPriceRange] = useState([0, 50000000])
  const [selectedRating, setSelectedRating] = useState(0)
  const [sortBy, setSortBy] = useState('created_at')
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  const [loading, setLoading] = useState(true)

  // --- Admin CRUD Dialog ---
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
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


  const productsPerPage = 12

  // --- Fetching ---
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [currentPage, selectedCategory, searchTerm, sortBy])

  const formatPrice = (price) => {
    if (price == null || isNaN(price)) return '—';
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
  };
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: productsPerPage,
        category: selectedCategory,
        search: searchTerm,
        sort: sortBy,
      }
      const res = await getProducts(params)
      const data = res.data.data || []

      const transformed = data.map(p => ({
        ...p,
        image: p.image_url || 'https://via.placeholder.com/400x400?text=No+Image',
        price: Number(p.price),
        salePrice: Number(p.sale_price),
        tags: p.is_featured ? ['featured'] : [],
        rating: 4.5,
        reviews: 0,
      }))

      setProducts(transformed)
      setTotalPages(res.data.pagination?.totalPages || 0)
    } catch (err) {
      toast({
        title: 'Lỗi tải sản phẩm',
        description: 'Không thể tải danh sách sản phẩm',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await getCategories()
      setCategories(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      setCategories([])
    }
  }

  // --- CRUD handlers ---
  const handleCreateProduct = async () => {
    try {
      await adminCreateProduct(formData)
      toast({ title: 'Tạo sản phẩm thành công' })
      setIsDialogOpen(false)
      resetForm()
      fetchProducts()
    } catch {
      toast({ title: 'Tạo sản phẩm thất bại', variant: 'destructive' })
    }
  }

  const handleUpdateProduct = async () => {
    try {
      await adminUpdateProduct(editingProduct.id, formData)
      toast({ title: 'Cập nhật thành công' })
      setIsDialogOpen(false)
      setEditingProduct(null)
      resetForm()
      fetchProducts()
    } catch {
      toast({ title: 'Cập nhật thất bại', variant: 'destructive' })
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Bạn chắc chắn muốn xoá sản phẩm này?')) return
    try {
      await adminDeleteProduct(id)
      toast({ title: 'Đã xoá sản phẩm' })
      fetchProducts()
    } catch {
      toast({ title: 'Xoá thất bại', variant: 'destructive' })
    }
  }

  const resetForm = () =>
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

  // --- Helpers ---
  const filteredProducts = products.filter(p => {
    const price = p.salePrice || p.price;
    return (
      (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
      price >= priceRange[0] &&
      price <= priceRange[1] &&
      (selectedRating === 0 || p.rating >= selectedRating)
    )
  })

  const displayedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (a.sale_price || a.price) - (b.sale_price || b.price)
      case 'price-desc':
        return (b.sale_price || b.price) - (a.sale_price || a.price)
      case 'created_at':
        return new Date(b.created_at) - new Date(a.created_at)
      default:
        return 0
    }
  })
  console.log('Displayed products:', displayedProducts)


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Breadcrumb selectedCategory={selectedCategory} categories={categories} />

      <div className="bg-white border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 items-center">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <SortAndViewControls
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        <SidebarFilters
          showFilters={showFilters}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          formatPrice={formatPrice}
          toggleBrand={toggleBrand}
          products={displayedProducts}
        />



        <div className="flex-1">
          <ProductGrid
            displayedProducts={displayedProducts}
            sortedProducts={displayedProducts}
            viewMode={viewMode}
            formatPrice={formatPrice}
            addToCart={(product) => console.log('Add to cart', product)}
            setQuickViewProduct={setQuickViewProduct}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      <QuickViewModal
        quickViewProduct={quickViewProduct} // phải đúng tên prop
        setQuickViewProduct={setQuickViewProduct} // truyền luôn setter
        formatPrice={formatPrice}
        addToCart={(product) => console.log('Add to cart', product)}
      />

      <AdminProductDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        formData={formData}
        setFormData={setFormData}
        editingProduct={editingProduct}
        handleCreate={handleCreateProduct}
        handleUpdate={handleUpdateProduct}
      />
    </div>
  )
}