import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {  ShoppingCart, Search, Filter, ChefHat, Heart,  Star, Grid3x3, List, ChevronRight, X, Eye,  TrendingUp, Percent, Clock, DollarSign, ArrowUpDown, Plus, Pencil, Trash2} from 'lucide-react'
import { getProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, getCategories } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import {  Dialog,  DialogContent,  DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function KitchenProductListing() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceRange, setPriceRange] = useState([0, 1000000000])
  const [selectedRating, setSelectedRating] = useState(0)
  const [sortBy, setSortBy] = useState('created_at')
  const [viewMode, setViewMode] = useState('grid')
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const productsPerPage = 12

  // Dialog states for CRUD operations
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

  const searchSuggestions = [
    'Nồi áp suất',
    'Bộ dao nhà bếp',
    'Máy xay sinh tố',
    'Chảo chống dính',
    'Lò nướng điện'
  ]

  // Fetch data on component mount
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Fetch products with filters
  useEffect(() => {
    fetchProducts()
  }, [currentPage, selectedCategory, searchTerm, sortBy])

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
      const response = await getProducts(params)
      const productsData = response.data.data || []
      // Transform backend data to match frontend expectations
      const transformedProducts = productsData.map(product => ({
        ...product,
        image: product.image_url || 'https://via.placeholder.com/400x400?text=No+Image',
        salePrice: product.sale_price,
        tags: product.is_featured ? ['featured'] : [],
        rating: 4.5, // Default rating since backend doesn't have this
        reviews: 0, // Default reviews count
      }))
      setProducts(transformedProducts)
      setTotalProducts(response.data.total || 0)
      setTotalPages(response.data.pagination?.totalPages || 0)
    } catch (err) {
      setError('Failed to fetch products')
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await getCategories()
      setCategories(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      setCategories([])
    }
  }

  const handleCreateProduct = async () => {
    try {
      await adminCreateProduct(formData)
      toast({
        title: 'Success',
        description: 'Product created successfully',
      })
      setIsDialogOpen(false)
      resetForm()
      fetchProducts()
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateProduct = async () => {
    try {
      await adminUpdateProduct(editingProduct.id, formData)
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      })
      setIsDialogOpen(false)
      setEditingProduct(null)
      resetForm()
      fetchProducts()
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await adminDeleteProduct(productId)
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      })
      fetchProducts()
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      })
    }
  }

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
  }

  const openCreateDialog = () => {
    resetForm()
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      sale_price: product.sale_price?.toString() || '',
      stock: product.stock.toString(),
      category_id: product.category_id,
      brand: product.brand,
      is_featured: product.is_featured,
      is_active: product.is_active,
    })
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const filteredProducts = products.filter(product => {
    const matchesBrands = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    const matchesPrice = (product.sale_price || product.price) >= priceRange[0] &&
                         (product.sale_price || product.price) <= priceRange[1]
    const matchesRating = selectedRating === 0 || product.rating >= selectedRating

    return matchesBrands && matchesPrice && matchesRating
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-asc':
        return (a.sale_price || a.price) - (b.sale_price || b.price)
      case 'price-desc':
        return (b.sale_price || b.price) - (a.sale_price || b.price)
      case 'created_at':
        return new Date(b.created_at) - new Date(a.created_at)
      default:
        return 0
    }
  })

  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }



  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const addToCart = (product) => {
    setCart([...cart, product])
    // Show mini cart notification
    setTimeout(() => {
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`)
    }, 100)
  }

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  // Extract unique brands from products
  const brands = [...new Set(products.map(p => p.brand))].map(brand => ({
    id: brand,
    name: brand,
    count: products.filter(p => p.brand === brand).length
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      

      {/* Breadcrumb */}
      <div className="bg-white border-b border-blue-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer">Trang chủ</span>
            <ChevronRight className="h-4 w-4" />
            <span className="hover:text-blue-600 cursor-pointer">Sản phẩm</span>
            {selectedCategory && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-blue-600 font-medium">
                  {categories.find(c => c.slug === selectedCategory)?.name}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowSearchSuggestions(e.target.value.length > 0)
                }}
                onFocus={() => setShowSearchSuggestions(searchTerm.length > 0)}
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-blue-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              
              {showSearchSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-100 rounded-xl shadow-xl z-50">
                  {searchSuggestions
                    .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchTerm(suggestion)
                          setShowSearchSuggestions(false)
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        <Search className="h-4 w-4 inline mr-2 text-gray-400" />
                        {suggestion}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="bestseller">Bán chạy nhất</option>
              <option value="discount">Giảm giá nhiều nhất</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2 bg-blue-50 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-blue-600 text-white px-4 py-3 rounded-xl flex items-center gap-2"
            >
              <Filter className="h-5 w-5" />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`w-full md:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-600" />
                  Bộ lọc
                </h3>
                <button
                  onClick={() => {
                    setSelectedCategory('')
                    setSelectedBrands([])
                    setPriceRange([0, 1000000000])
                    setSelectedRating(0)
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Xóa tất cả
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Danh mục</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedCategory === cat.slug
                          ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md'
                          : 'bg-gray-50 hover:bg-blue-50 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{cat.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedCategory === cat.slug ? 'bg-white/20' : 'bg-gray-200'
                        }`}>
                          {cat.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Thương hiệu</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.name)}
                        onChange={() => toggleBrand(brand.name)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors flex-1">
                        {brand.name}
                      </span>
                      <span className="text-xs text-gray-400">({brand.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Khoảng giá</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="1000000000"
                    step="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-600 focus:outline-none"
                      placeholder="Từ"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000000])}
                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-600 focus:outline-none"
                      placeholder="Đến"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Đánh giá</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                        selectedRating === rating
                          ? 'bg-blue-50 border-2 border-blue-600'
                          : 'bg-gray-50 hover:bg-blue-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">trở lên</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Nhanh</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm rounded-full border-2 border-blue-200 transition-colors">
                    Khuyến mãi
                  </button>
                  <button className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm rounded-full border-2 border-blue-200 transition-colors">
                    Còn hàng
                  </button>
                  <button className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm rounded-full border-2 border-blue-200 transition-colors">
                    Nổi bật
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Hiển thị <span className="font-bold text-blue-600">{displayedProducts.length}</span> trên{' '}
                <span className="font-bold">{sortedProducts.length}</span> sản phẩm
              </p>
            </div>

            {displayedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-blue-100">
                <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-blue-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">Không tìm thấy sản phẩm nào</p>
                <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            ) : (
              <>
                {/* Products */}
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {displayedProducts.map(product => (
                    <div
                      key={product.id}
                      className={`bg-white rounded-2xl shadow-lg border-2 border-blue-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      {/* Image */}
                      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                            viewMode === 'list' ? 'h-full' : 'h-64'
                          }`}
                        />
                        
                        {/* Tags */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.tags.includes('new') && (
                            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              MỚI
                            </span>
                          )}
                          {product.tags.includes('bestseller') && (
                            <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              BÁN CHẠY
                            </span>
                          )}
                          {product.tags.includes('featured') && (
                            <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              NỔI BẬT
                            </span>
                          )}
                        </div>
                        
                        {/* Discount Badge */}
                        {product.salePrice && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                            <Percent className="h-3 w-3" />
                            -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                          </div>
                        )}
                        
                        {/* Quick View on Hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => setQuickViewProduct(product)}
                            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow-xl hover:bg-blue-50 transition-colors flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform"
                          >
                            <Eye className="h-5 w-5" />
                            Xem nhanh
                          </button>
                        </div>
                        
                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(product.id)}
                          className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              favorites.includes(product.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      </div>
                      
                      {/* Product Info */}
                      <div className={`p-5 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                        <div>
                          <h3
                            onClick={() => navigate(`/products/${product.slug}`)}
                            className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {product.name}
                          </h3>
                          
                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(product.rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {product.rating} ({product.reviews} đánh giá)
                            </span>
                          </div>
                          
                          {/* Price */}
                          <div className="mb-4">
                            {product.salePrice ? (
                              <>
                                <p className="text-sm text-gray-400 line-through mb-1">
                                  {formatPrice(product.price)}
                                </p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                  {formatPrice(product.salePrice)}
                                </p>
                              </>
                            ) : (
                              <p className="text-2xl font-bold text-blue-600">
                                {formatPrice(product.price)}
                              </p>
                            )}
                          </div>
                          
                          {/* Stock */}
                          <p className="text-sm text-gray-500 mb-4">
                            Còn lại: <span className="font-semibold text-gray-700">{product.stock}</span> sản phẩm
                          </p>
                        </div>
                        
                        {/* Add to Cart Button */}
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                          <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border-2 border-blue-200 text-blue-600 font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Trước
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md'
                                : 'border-2 border-blue-200 text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 text-gray-400">
                            ...
                          </span>
                        )
                      }
                      return null
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border-2 border-blue-200 text-blue-600 font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-blue-100 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Xem nhanh sản phẩm</h3>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image */}
                <div className="relative">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                  {quickViewProduct.salePrice && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      -{Math.round(((quickViewProduct.price - quickViewProduct.salePrice) / quickViewProduct.price) * 100)}%
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {quickViewProduct.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full"
                      >
                        {tag === 'new' ? 'MỚI' : tag === 'bestseller' ? 'BÁN CHẠY' : 'NỔI BẬT'}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {quickViewProduct.name}
                  </h2>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(quickViewProduct.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {quickViewProduct.rating} ({quickViewProduct.reviews} đánh giá)
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    {quickViewProduct.salePrice ? (
                      <>
                        <p className="text-lg text-gray-400 line-through mb-2">
                          {formatPrice(quickViewProduct.price)}
                        </p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                          {formatPrice(quickViewProduct.salePrice)}
                        </p>
                      </>
                    ) : (
                      <p className="text-4xl font-bold text-blue-600">
                        {formatPrice(quickViewProduct.price)}
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Thương hiệu:</span> {quickViewProduct.brand}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Tình trạng:</span>{' '}
                      <span className="text-green-600 font-semibold">
                        Còn {quickViewProduct.stock} sản phẩm
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        addToCart(quickViewProduct)
                        setQuickViewProduct(null)
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Thêm vào giỏ
                    </button>
                    
                    <button
                      onClick={() => toggleFavorite(quickViewProduct.id)}
                      className="px-4 py-4 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      <Heart
                        className={`h-6 w-6 ${
                          favorites.includes(quickViewProduct.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-blue-600'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  )
}