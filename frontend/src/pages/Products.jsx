import { useState, useEffect } from 'react'
import { 
  ShoppingCart, Search, Filter, ChefHat, Heart, 
  Star, Grid3x3, List, ChevronRight, X, Eye,
  TrendingUp, Percent, Clock, DollarSign, ArrowUpDown
} from 'lucide-react'

export default function KitchenProductListing() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [selectedRating, setSelectedRating] = useState(0)
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  const searchSuggestions = [
    'Nồi áp suất',
    'Bộ dao nhà bếp',
    'Máy xay sinh tố',
    'Chảo chống dính',
    'Lò nướng điện'
  ]

  const categories = [
    { id: 1, name: 'Dụng cụ nấu nướng', slug: 'cooking', count: 145 },
    { id: 2, name: 'Dao & thớt', slug: 'knives', count: 78 },
    { id: 3, name: 'Dụng cụ nướng bánh', slug: 'baking', count: 92 },
    { id: 4, name: 'Thiết bị điện', slug: 'electric', count: 63 },
    { id: 5, name: 'Bộ đồ ăn', slug: 'dinnerware', count: 124 }
  ]

  const brands = [
    { id: 1, name: 'KitchenAid', count: 45 },
    { id: 2, name: 'Tefal', count: 38 },
    { id: 3, name: 'Sunhouse', count: 52 },
    { id: 4, name: 'Lock&Lock', count: 41 },
    { id: 5, name: 'Philips', count: 29 }
  ]

  const products = [
    {
      id: 1,
      name: 'Bộ nồi inox 304 cao cấp 5 món',
      price: 2500000,
      salePrice: 1990000,
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&h=500&fit=crop',
      category: 'cooking',
      brand: 'Sunhouse',
      rating: 4.8,
      reviews: 156,
      tags: ['bestseller', 'sale'],
      stock: 45
    },
    {
      id: 2,
      name: 'Bộ dao nhà bếp Nhật Bản 8 món kèm hộp gỗ',
      price: 1800000,
      salePrice: null,
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&h=500&fit=crop',
      category: 'knives',
      brand: 'KitchenAid',
      rating: 4.9,
      reviews: 203,
      tags: ['new'],
      stock: 28
    },
    {
      id: 3,
      name: 'Máy xay sinh tố công suất cao 2000W',
      price: 2200000,
      salePrice: 1650000,
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&h=500&fit=crop',
      category: 'electric',
      brand: 'Philips',
      rating: 4.7,
      reviews: 189,
      tags: ['sale', 'bestseller'],
      stock: 15
    },
    {
      id: 4,
      name: 'Bộ thớt gỗ tre kháng khuẩn 3 size',
      price: 450000,
      salePrice: 350000,
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&h=500&fit=crop',
      category: 'knives',
      brand: 'Lock&Lock',
      rating: 4.6,
      reviews: 92,
      tags: ['sale'],
      stock: 67
    },
    {
      id: 5,
      name: 'Khuôn nướng bánh silicon 12 ngăn chống dính',
      price: 280000,
      salePrice: 199000,
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&h=500&fit=crop',
      category: 'baking',
      brand: 'Tefal',
      rating: 4.5,
      reviews: 78,
      tags: ['sale'],
      stock: 120
    },
    {
      id: 6,
      name: 'Chảo chống dính đáy từ cao cấp 28cm',
      price: 890000,
      salePrice: null,
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&h=500&fit=crop',
      category: 'cooking',
      brand: 'Tefal',
      rating: 4.8,
      reviews: 167,
      tags: ['new', 'featured'],
      stock: 34
    },
    {
      id: 7,
      name: 'Bộ dụng cụ làm bánh 15 món chuyên nghiệp',
      price: 850000,
      salePrice: 680000,
      image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=500&h=500&fit=crop',
      category: 'baking',
      brand: 'KitchenAid',
      rating: 4.9,
      reviews: 134,
      tags: ['bestseller', 'sale'],
      stock: 42
    },
    {
      id: 8,
      name: 'Bộ hũ đựng gia vị thủy tinh 12 món',
      price: 420000,
      salePrice: null,
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&h=500&fit=crop',
      category: 'dinnerware',
      brand: 'Lock&Lock',
      rating: 4.7,
      reviews: 98,
      tags: ['new'],
      stock: 88
    },
    {
      id: 9,
      name: 'Máy đánh trứng cầm tay 7 tốc độ',
      price: 680000,
      salePrice: 549000,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop',
      category: 'electric',
      brand: 'Philips',
      rating: 4.6,
      reviews: 145,
      tags: ['sale'],
      stock: 52
    },
    {
      id: 10,
      name: 'Nồi cơm điện cao cấp 1.8L',
      price: 1500000,
      salePrice: 1199000,
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=500&fit=crop',
      category: 'electric',
      brand: 'Sunhouse',
      rating: 4.8,
      reviews: 276,
      tags: ['bestseller', 'sale'],
      stock: 23
    },
    {
      id: 11,
      name: 'Bộ nồi inox 7 lớp đáy liền',
      price: 3200000,
      salePrice: 2560000,
      image: 'https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=500&h=500&fit=crop',
      category: 'cooking',
      brand: 'Tefal',
      rating: 4.9,
      reviews: 189,
      tags: ['featured', 'sale'],
      stock: 18
    },
    {
      id: 12,
      name: 'Lò nướng điện 45L đa năng',
      price: 2800000,
      salePrice: null,
      image: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059e?w=500&h=500&fit=crop',
      category: 'electric',
      brand: 'Philips',
      rating: 4.7,
      reviews: 156,
      tags: ['new'],
      stock: 12
    }
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const matchesBrands = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    const matchesPrice = (product.salePrice || product.price) >= priceRange[0] && 
                         (product.salePrice || product.price) <= priceRange[1]
    const matchesRating = selectedRating === 0 || product.rating >= selectedRating
    
    return matchesSearch && matchesCategory && matchesBrands && matchesPrice && matchesRating
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-asc':
        return (a.salePrice || a.price) - (b.salePrice || b.price)
      case 'price-desc':
        return (b.salePrice || b.price) - (a.salePrice || a.price)
      case 'bestseller':
        return b.reviews - a.reviews
      case 'discount':
        const discountA = a.salePrice ? ((a.price - a.salePrice) / a.price) * 100 : 0
        const discountB = b.salePrice ? ((b.price - b.salePrice) / b.price) * 100 : 0
        return discountB - discountA
      default:
        return 0
    }
  })

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      {/* <header className="bg-white border-b-2 border-cyan-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-xl shadow-lg">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Kitchen Store
                </h1>
                <p className="text-sm text-gray-500">Thiết bị nhà bếp cao cấp</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => alert(`Bạn có ${favorites.length} sản phẩm yêu thích`)}
                className="relative text-gray-600 hover:text-cyan-600 transition-colors"
              >
                <Heart className="h-6 w-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {favorites.length}
                  </span>
                )}
              </button>
              
              <button className="relative bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-semibold">Giỏ hàng</span>
                {cart.length > 0 && (
                  <span className="bg-white text-cyan-600 text-xs px-2 py-1 rounded-full font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header> */}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-cyan-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="hover:text-cyan-600 cursor-pointer">Trang chủ</span>
            <ChevronRight className="h-4 w-4" />
            <span className="hover:text-cyan-600 cursor-pointer">Sản phẩm</span>
            {selectedCategory && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-cyan-600 font-medium">
                  {categories.find(c => c.slug === selectedCategory)?.name}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border-b border-cyan-100 shadow-sm">
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
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-cyan-200 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              
              {showSearchSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-cyan-100 rounded-xl shadow-xl z-50">
                  {searchSuggestions
                    .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchTerm(suggestion)
                          setShowSearchSuggestions(false)
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-cyan-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
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
              className="px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 bg-white cursor-pointer"
            >
              <option value="newest">
                <Clock className="inline h-4 w-4 mr-2" />
                Mới nhất
              </option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="bestseller">Bán chạy nhất</option>
              <option value="discount">Giảm giá nhiều nhất</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2 bg-cyan-50 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-cyan-600 shadow-md' 
                    : 'text-gray-500 hover:text-cyan-600'
                }`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-cyan-600 shadow-md' 
                    : 'text-gray-500 hover:text-cyan-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-cyan-500 text-white px-4 py-3 rounded-xl flex items-center gap-2"
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
            <div className="bg-white rounded-2xl shadow-lg border-2 border-cyan-100 p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-cyan-600" />
                  Bộ lọc
                </h3>
                <button
                  onClick={() => {
                    setSelectedCategory('')
                    setSelectedBrands([])
                    setPriceRange([0, 5000000])
                    setSelectedRating(0)
                  }}
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
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
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-md'
                          : 'bg-gray-50 hover:bg-cyan-50 text-gray-700'
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
                        className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-cyan-600 transition-colors flex-1">
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
                    max="5000000"
                    step="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none"
                      placeholder="Từ"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000000])}
                      className="w-full px-3 py-2 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none"
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
                          ? 'bg-cyan-50 border-2 border-cyan-400'
                          : 'bg-gray-50 hover:bg-cyan-50 border-2 border-transparent'
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
                  <button className="px-3 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-sm rounded-full border-2 border-cyan-200 transition-colors">
                    Khuyến mãi
                  </button>
                  <button className="px-3 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-sm rounded-full border-2 border-cyan-200 transition-colors">
                    Còn hàng
                  </button>
                  <button className="px-3 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-sm rounded-full border-2 border-cyan-200 transition-colors">
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
                Hiển thị <span className="font-bold text-cyan-600">{displayedProducts.length}</span> trên{' '}
                <span className="font-bold">{sortedProducts.length}</span> sản phẩm
              </p>
            </div>

            {displayedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-cyan-100">
                <div className="bg-cyan-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-cyan-400" />
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
                      className={`bg-white rounded-2xl shadow-lg border-2 border-cyan-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group ${
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
                            className="bg-white text-cyan-600 px-6 py-3 rounded-xl font-semibold shadow-xl hover:bg-cyan-50 transition-colors flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform"
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
                          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors cursor-pointer">
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
                                <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                  {formatPrice(product.salePrice)}
                                </p>
                              </>
                            ) : (
                              <p className="text-2xl font-bold text-cyan-600">
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
                          className="w-full bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
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
                      className="px-4 py-2 rounded-lg border-2 border-cyan-200 text-cyan-600 font-medium hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-md'
                                : 'border-2 border-cyan-200 text-cyan-600 hover:bg-cyan-50'
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
                      className="px-4 py-2 rounded-lg border-2 border-cyan-200 text-cyan-600 font-medium hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            <div className="sticky top-0 bg-white border-b-2 border-cyan-100 px-6 py-4 flex justify-between items-center">
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
                        className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-bold rounded-full"
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
                        <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                          {formatPrice(quickViewProduct.salePrice)}
                        </p>
                      </>
                    ) : (
                      <p className="text-4xl font-bold text-cyan-600">
                        {formatPrice(quickViewProduct.price)}
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-4 mb-6">
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
                      className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Thêm vào giỏ
                    </button>
                    
                    <button
                      onClick={() => toggleFavorite(quickViewProduct.id)}
                      className="px-4 py-4 border-2 border-cyan-400 rounded-xl hover:bg-cyan-50 transition-colors"
                    >
                      <Heart
                        className={`h-6 w-6 ${
                          favorites.includes(quickViewProduct.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-cyan-600'
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

      {/* Footer */}
      
    </div>) }
        