import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Grid3X3, List, Search, ShoppingCart, Sparkles, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  getCategories,
  getProducts,
  getProductSuggestions
} from '@/services/api'
import { getBrands } from '@/services/brands'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0PC90ZXh0Pjwvc3ZnPg=='

const formatPrice = (value) => {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return '—'
  return numeric.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
}



export default function KitchenProductListing() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [activeNav, setActiveNav] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [suggestionPanel, setSuggestionPanel] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const productsPerPage = 12

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchBrands()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [currentPage, selectedCategory, searchTerm, sortBy, selectedBrand])



  const categoriesById = useMemo(() => {
    const map = {}
    categories.forEach((cat) => {
      map[cat.id] = cat
    })
    return map
  }, [categories])

  const navItems = useMemo(
    () => [{ label: 'Tất cả', value: 'all' }, ...categories.map(cat => ({
      label: cat.name,
      value: cat.slug,
      slug: cat.slug
    }))],
    [categories]
  )

  const priceFilters = useMemo(
    () => [
      { value: 'all', label: 'Mọi mức giá', min: 0, max: Number.POSITIVE_INFINITY },
      { value: 'under1', label: 'Dưới 1.000.000₫', min: 0, max: 1_000_000 },
      { value: '1to5', label: '1.000.000₫ - 5.000.000₫', min: 1_000_000, max: 5_000_000 },
      { value: '5to10', label: '5.000.000₫ - 10.000.000₫', min: 5_000_000, max: 10_000_000 },
      { value: 'over10', label: 'Trên 10.000.000₫', min: 10_000_000, max: Number.POSITIVE_INFINITY }
    ],
    []
  )

  const visualProducts = useMemo(() => {
    let list = [...products]

    const range = priceFilters.find((item) => item.value === priceFilter)
    if (range) {
      list = list.filter((product) => {
        const basePrice = product.salePrice || product.price
        return basePrice >= range.min && basePrice <= range.max
      })
    }

    if (activeNav !== 'all') {
      // activeNav is now the category slug directly
      list = list.filter((product) => {
        const productCategory = categoriesById[product.category_id]
        const productCategorySlug =
          product.category_slug || product.category?.slug || productCategory?.slug
        return productCategorySlug === activeNav
      })
    }

    return list
  }, [products, activeNav, priceFilter, priceFilters, categoriesById])

  const showingFrom = products.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1
  const showingTo = products.length === 0 ? 0 : showingFrom + products.length - 1

  const skeletonCards = Array.from({ length: 6 }, (_, index) => (
    <div
      key={`skeleton-${index}`}
      className="h-[320px] rounded-[32px] border border-blue-100/60 bg-white/60 shadow-inner animate-pulse"
    />
  ))

  const heroStats = [
    { label: 'Tổng sản phẩm', value: totalProducts },
    { label: 'Trang hiện tại', value: `${currentPage}/${totalPages}` }
  ]

  const handleNavChange = (value) => {
    setActiveNav(value)
    setCurrentPage(1)

    if (value === 'all') {
      setSelectedCategory('')
    } else {
      setSelectedCategory(value)
    }
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const handlePriceFilterChange = (value) => {
    setPriceFilter(value)
    setCurrentPage(1)
  }

  const handleViewDetail = (product) => {
    if (!product) return
    const slug = product.slug || product.id
    if (!slug) return
    navigate(`/products/${slug}`)
  }



  const defaultSuggestion = {
    title: 'Gợi ý nâng cấp gian bếp',
    description: 'Những món đồ nhỏ xinh giúp hoàn thiện trải nghiệm sử dụng.',
    items: []
  }

  const handleSuggestionClick = async (product) => {
    if (!product) return

    try {
      const response = await getProductSuggestions(product.slug)
      const suggestionData = response?.data?.data

      if (suggestionData) {
        setSuggestionPanel({
          title: suggestionData.title,
          description: suggestionData.description,
          baseProduct: product.name,
          items: suggestionData.items
        })
      } else {
        setSuggestionPanel({
          title: defaultSuggestion.title,
          description: defaultSuggestion.description,
          baseProduct: product.name,
          items: defaultSuggestion.items
        })
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestionPanel({
        title: defaultSuggestion.title,
        description: defaultSuggestion.description,
        baseProduct: product.name,
        items: defaultSuggestion.items
      })
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: productsPerPage,
        category: selectedCategory,
        search: searchTerm.trim(),
        sort: sortBy,
        brand: selectedBrand
      }
      const response = await getProducts(params)
      const data = response?.data?.data ?? []

      const transformed = data.map((product) => ({
        ...product,
        price: Number(product.price),
        salePrice: product.sale_price != null ? Number(product.sale_price) : product.salePrice,
        stock: Number(product.stock ?? 0),
        image: product.image_url || product.image || FALLBACK_IMAGE
      }))

      const pagination = response?.data?.pagination ?? {}
      const total = pagination.totalItems ?? response?.data?.total ?? transformed.length

      setProducts(transformed)
      setTotalProducts(total)
      setTotalPages(Math.max(1, pagination.totalPages || 1))
    } catch {
      toast({
        title: 'Không thể tải sản phẩm',
        description: 'Vui lòng thử lại sau.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await getCategories()
      const cats = Array.isArray(response?.data?.data) ? response.data.data : []
      setCategories(cats)
    } catch (error) {
      setCategories([])
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await getBrands()
      setBrands(Array.isArray(response?.data) ? response.data : [])
    } catch {
      setBrands([])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-white to-[#dbe9ff] py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <header className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">Kitchen Store</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">Sản phẩm</h1>
          </div>

          <div className="flex flex-col gap-4 rounded-[32px] border border-blue-100/80 bg-white/90 p-5 shadow-[0px_25px_70px_rgba(59,130,246,0.15)] lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xl">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm sản phẩm yêu thích..."
                className="h-14 w-full rounded-full border border-blue-100 bg-blue-50/40 pl-12 pr-5 text-sm text-slate-600 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-full p-2 transition ${viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-500 hover:text-blue-600'
                    }`}
                  title="Xem dạng lưới"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`rounded-full p-2 transition ${viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-500 hover:text-blue-600'
                    }`}
                  title="Xem dạng danh sách"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="h-14 w-44 rounded-full border-blue-100 bg-white text-sm font-medium text-slate-600 focus:ring-blue-200">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Mới cập nhật</SelectItem>
                  <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                  <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={handlePriceFilterChange}>
                <SelectTrigger className="h-14 w-48 rounded-full border-blue-100 bg-blue-600/10 text-sm font-medium text-blue-700 focus:ring-blue-200">
                  <SelectValue placeholder="Mức giá" />
                </SelectTrigger>
                <SelectContent>
                  {priceFilters.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBrand} onValueChange={(value) => {
                setSelectedBrand(value === "all" ? "" : value)
                setCurrentPage(1)
              }}>
                <SelectTrigger className="h-14 w-44 rounded-full border-blue-100 bg-white text-sm font-medium text-slate-500 focus:ring-blue-200">
                  <SelectValue placeholder="Thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-[28px] border border-blue-100/80 bg-white/70 px-6 py-4 text-sm text-slate-500 font-semibold">
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.3em] text-blue-400">{stat.label}</span>
                <span className="text-lg font-semibold text-slate-900">{stat.value}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-3 overflow-x-auto pb-2">
            {navItems.map((item) => {
              const isActive = activeNav === item.value
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleNavChange(item.value)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-white/70 text-slate-500 hover:text-blue-600'
                    }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          <section className={`gap-5 ${viewMode === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-4' : 'flex flex-col'}`}>
            {loading && skeletonCards}

            {!loading && visualProducts.length === 0 && (
              <div className="col-span-full flex flex-col items-center rounded-[30px] border border-dashed border-blue-200 bg-white/60 py-16 text-center">
                <Sparkles className="h-8 w-8 text-blue-400" />
                <p className="mt-4 text-xl font-semibold text-slate-900">Chưa có sản phẩm phù hợp</p>
                <p className="mt-2 max-w-md text-sm text-slate-500">
                  Vui lòng đổi bộ lọc hoặc tìm kiếm khác để khám phá thêm những lựa chọn nổi bật chinh phục gian bếp của bạn.
                </p>
              </div>
            )}

            {!loading &&
              visualProducts.map((product) => (
                <div
                  key={product.id}
                  className={`group relative overflow-hidden rounded-[24px] border border-blue-100 bg-white shadow-[0px_18px_40px_rgba(37,99,235,0.12)] transition hover:-translate-y-1 hover:shadow-[0px_24px_60px_rgba(37,99,235,0.25)] ${viewMode === 'grid'
                      ? 'flex h-full flex-col p-4'
                      : 'flex flex-row p-1 gap-1.5'
                    }`}
                >
                  <div className={`overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 ${viewMode === 'grid'
                      ? 'mb-4 mt-6 aspect-[4/3] rounded-[20px]'
                      : 'flex-shrink-0 w-48 h-48 rounded-[28px] self-center'
                    }`}>
                    <img
                      src={product.image || FALLBACK_IMAGE}
                      alt={product.name}
                      className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div
                    className={`flex flex-1 flex-col cursor-pointer ${viewMode === 'grid' ? '' : 'justify-center'
                      }`}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleViewDetail(product)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        handleViewDetail(product)
                      }
                    }}
                  >
                    <div className={`flex items-center justify-between ${viewMode === 'grid' ? 'absolute inset-x-4 top-4' : 'mb-1'
                      }`}>
                      <span className={`font-semibold uppercase tracking-[0.35em] text-blue-400 ${viewMode === 'grid' ? 'text-[10px]' : 'text-[10px]'
                        }`}>{product.brand || 'Sang trọng'}</span>
                      {product.salePrice && (
                        <span className={`rounded-full bg-blue-600/10 px-2 py-0.5 text-blue-600 ${viewMode === 'grid' ? 'text-[10px]' : 'text-[10px]'
                          }`}>{
                            Math.round(((product.price - product.salePrice) / product.price) * 100)
                          }%</span>
                      )}
                    </div>

                    <h3 className={`font-semibold text-slate-900 line-clamp-2 ${viewMode === 'grid' ? 'text-base min-h-[48px] mt-6' : 'text-xs mb-1 leading-tight'
                      }`}>{product.name}</h3>
                    <p className={`line-clamp-2 text-slate-500 ${viewMode === 'grid' ? 'mt-1 text-sm min-h-[40px]' : 'text-[10px] mb-1 leading-tight'
                      }`}>
                      {product.description || 'Thiết kế tinh giản, sang trọng cho không gian bếp hiện đại.'}
                    </p>

                    <div className={`${viewMode === 'grid' ? 'mt-4 space-y-2 min-h-[46px]' : 'mt-auto space-y-1'
                      }`}>
                      {product.salePrice ? (
                        <>
                          <p className={`text-slate-400 line-through ${viewMode === 'grid' ? 'text-xs' : 'text-[10px]'
                            }`}>{formatPrice(product.price)}</p>
                          <p className={`font-bold text-slate-900 ${viewMode === 'grid' ? 'text-xl' : 'text-sm'
                            }`}>{formatPrice(product.salePrice)}</p>
                        </>
                      ) : (
                        <p className={`font-bold text-slate-900 ${viewMode === 'grid' ? 'text-xl' : 'text-sm'
                          }`}>{formatPrice(product.price)}</p>
                      )}
                    </div>

                    <div className={`${viewMode === 'grid' ? 'mt-auto pt-3 flex flex-col gap-2' : 'mt-1 flex gap-1'
                      }`}>
                      <Button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                        }}
                        className={`rounded-2xl bg-blue-600 text-white hover:bg-blue-500 transition-colors ${viewMode === 'grid'
                            ? 'w-full px-4 py-2 text-[11px] font-semibold tracking-wide'
                            : 'flex items-center space-x-2 px-3 py-1 text-[12px] font-medium'
                          }`}
                      >
                        <ShoppingCart
                          className={`${viewMode === 'grid' ? 'mr-1 h-4 w-4' : 'h-4 w-4'
                            }`}
                        />
                        <span>{viewMode === 'grid' ? 'Thêm vào giỏ' : 'Thêm vào giỏ'}</span>
                      </Button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleSuggestionClick(product)
                        }}
                        className={`rounded-2xl bg-blue-600/5 text-blue-700 transition hover:bg-blue-600/10 ${viewMode === 'grid'
                            ? 'flex w-full items-center justify-between px-3 py-2 text-[12px] font-medium'
                            : 'px-1.5 py-1 text-[10px]'
                          }`}
                        title="Xem thêm sản phẩm tương tự"
                      >
                        <span className="flex items-center gap-2 font-semibold">
                          <Sparkles className={`${viewMode === 'grid' ? 'h-4 w-4' : 'h-3 w-3'
                            }`} />
                          {viewMode === 'grid' ? 'Gợi ý dành cho bạn' : 'Gợi ý dành cho bạn'}
                        </span>
                        {viewMode === 'grid'  && <ArrowUpRight className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </section>
        </div>

        <div className="rounded-[30px] border border-blue-100 bg-white/80 px-6 py-4 shadow-sm sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {totalProducts === 0
              ? 'Không có sản phẩm để hiển thị'
              : `Hiển thị ${showingFrom}-${showingTo} trong tổng ${totalProducts} sản phẩm`}
          </p>

          <div className="mt-4 flex items-center gap-3 sm:mt-0">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading}
              className="rounded-full border-blue-200 text-slate-600"
            >
              Trang trước
            </Button>
            <div className="min-w-[110px] text-center text-sm font-semibold text-slate-600">
              Trang {currentPage}/{totalPages}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || loading}
              className="rounded-full border-blue-200 text-slate-600"
            >
              Trang sau
            </Button>
          </div>
        </div>
      </div>

      {suggestionPanel && (
        <div className="fixed inset-x-4 bottom-4 z-50 md:inset-auto md:bottom-8 md:right-8 md:w-96">
          <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-[0px_25px_60px_rgba(37,99,235,0.25)]">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-blue-600/10 p-2 text-blue-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">
                  Gợi ý thêm
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  {suggestionPanel.title}
                </h3>
                <p className="text-sm text-slate-500">{suggestionPanel.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSuggestionPanel(null)}
                className="rounded-full bg-slate-100 p-1 text-slate-500 transition hover:bg-slate-200"
                aria-label="Đóng gợi ý"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Dựa trên sản phẩm: <span className="font-semibold text-slate-600">{suggestionPanel.baseProduct}</span>
            </p>

            <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
              {suggestionPanel.items.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center gap-3 rounded-2xl border border-blue-50 px-3 py-2 transition hover:border-blue-200"
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl bg-blue-50">
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-slate-500">{formatPrice(item.price)}</p>
                  </div>
                  <Button
                    size="sm"
                    className="h-8 rounded-full px-3 text-xs"
                    onClick={() => {
                      if (item.slug) {
                        navigate(`/products/${item.slug}`)
                      }
                    }}
                  >
                    Xem
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
