import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Search, ShoppingCart, Sparkles, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  getCategories,
  getProducts
} from '@/services/api'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x400?text=Product'

const formatPrice = (value) => {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return '—'
  return numeric.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
}

const getSoldCount = (product) => {
  if (!product) return 0
  return product.sold_count ?? product.sold ?? product.total_sold ?? product.sales ?? 0
}

export default function KitchenProductListing() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [activeNav, setActiveNav] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [suggestionPanel, setSuggestionPanel] = useState(null)

  const productsPerPage = 12

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [currentPage, selectedCategory, searchTerm, sortBy])

  const normalizeText = (text = '') =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, ' ')
      .trim()

  const categoriesById = useMemo(() => {
    const map = {}
    categories.forEach((cat) => {
      map[cat.id] = cat
    })
    return map
  }, [categories])

  const fixedCategoryConfigs = useMemo(() => {
    const desiredLabels = ['Bếp từ', 'Tủ lạnh', 'Lò nướng', 'Máy hút mùi']
    return desiredLabels.map((label) => {
      const normalizedLabel = normalizeText(label)
      const matchedCategory = categories.find((cat) =>
        normalizeText(cat.name || '').includes(normalizedLabel)
      )
      const slug = matchedCategory?.slug || ''
      const value = slug || normalizedLabel.replace(/\s+/g, '-')
      return {
        label,
        value,
        slug,
        normalizedLabel
      }
    })
  }, [categories])

  const navItems = useMemo(
    () => [{ label: 'Tất cả', value: 'all' }, ...fixedCategoryConfigs],
    [fixedCategoryConfigs]
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
      const targetCategory = fixedCategoryConfigs.find((cat) => cat.value === activeNav)
      if (targetCategory) {
        list = list.filter((product) => {
          const productCategory = categoriesById[product.category_id]
          const productCategorySlug =
            product.category_slug || product.category?.slug || productCategory?.slug
          if (targetCategory.slug) {
            return productCategorySlug === targetCategory.slug
          }
          const productCategoryName = productCategory?.name || product.category?.name || ''
          return (
            normalizeText(productCategoryName).includes(targetCategory.normalizedLabel) ||
            normalizeText(product.name).includes(targetCategory.normalizedLabel)
          )
        })
      }
    }

    return list
  }, [products, activeNav, priceFilter, priceFilters, fixedCategoryConfigs, categoriesById])

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
      const targetCategory = fixedCategoryConfigs.find((cat) => cat.value === value)
      setSelectedCategory(targetCategory?.slug || '')
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

  const suggestionLibrary = useMemo(
    () => [
      {
        keywords: ['chau rua', 'bon rua', 'sink'],
        title: 'Hoàn thiện khu vực chậu rửa',
        description: 'Gợi ý các phụ kiện hỗ trợ vệ sinh và sắp xếp quanh bồn rửa.',
        items: [
          {
            name: 'Khăn lau nhà bếp sợi tre',
            price: 120000,
            image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400'
          },
          {
            name: 'Giá treo khăn Inox dán tường',
            price: 350000,
            image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400'
          },
          {
            name: 'Kệ úp chén mini',
            price: 580000,
            image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'
          }
        ]
      },
      {
        keywords: ['bep tu', 'bep dien', 'hob'],
        title: 'Phụ kiện cho bếp từ',
        description: 'Tối ưu trải nghiệm nấu nướng với dụng cụ đồng bộ.',
        items: [
          {
            name: 'Bộ nồi inox đáy từ 5 món',
            price: 2190000,
            image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400'
          },
          {
            name: 'Dụng cụ lau mặt bếp kính',
            price: 190000,
            image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=400'
          },
          {
            name: 'Khay gia vị xoay 360°',
            price: 420000,
            image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400'
          }
        ]
      },
      {
        keywords: ['lo nuong', 'oven'],
        title: 'Set baking đi kèm',
        description: 'Chuẩn bị đầy đủ khuôn khay và dụng cụ nướng.',
        items: [
          {
            name: 'Bộ khuôn bánh không dính 3 size',
            price: 690000,
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'
          },
          {
            name: 'Thảm nướng silicon chịu nhiệt',
            price: 230000,
            image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400'
          },
          {
            name: 'Nhiệt kế lò điện tử',
            price: 310000,
            image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400'
          }
        ]
      },
      {
        keywords: ['tu lanh', 'fridge'],
        title: 'Phụ kiện tối ưu tủ lạnh',
        description: 'Giữ thực phẩm gọn gàng và tiết kiệm diện tích.',
        items: [
          {
            name: 'Hộp trữ thực phẩm thủy tinh',
            price: 420000,
            image: 'https://images.unsplash.com/photo-1502740479091-635887520276?w=400'
          },
          {
            name: 'Khử mùi than hoạt tính',
            price: 150000,
            image: 'https://images.unsplash.com/photo-1612198525090-d819cdb4c90c?w=400'
          },
          {
            name: 'Khay trứng hai tầng',
            price: 260000,
            image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400'
          }
        ]
      },
      {
        keywords: ['may hut mui', 'hut mui', 'hood'],
        title: 'Giữ bếp thơm tho',
        description: 'Bổ sung bộ lọc và dụng cụ vệ sinh cho máy hút mùi.',
        items: [
          {
            name: 'Bộ lọc than hoạt tính thay thế',
            price: 490000,
            image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'
          },
          {
            name: 'Dung dịch vệ sinh inox',
            price: 180000,
            image: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=400'
          },
          {
            name: 'Chổi lau khe hẹp đa năng',
            price: 95000,
            image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400'
          }
        ]
      }
    ],
    []
  )

  const defaultSuggestion = {
    title: 'Gợi ý nâng cấp gian bếp',
    description: 'Những món đồ nhỏ xinh giúp hoàn thiện trải nghiệm sử dụng.',
    items: [
      {
        name: 'Set lọ gia vị thủy tinh',
        price: 370000,
        image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400'
      },
      {
        name: 'Thảm bếp chống mỏi',
        price: 640000,
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400'
      },
      {
        name: 'Bộ dao thép Nhật 3 món',
        price: 1450000,
        image: 'https://images.unsplash.com/photo-1506368083636-6defb67639c0?w=400'
      }
    ]
  }

  const handleSuggestionClick = (product) => {
    if (!product) return

    const productCategory = categoriesById[product.category_id]
    const productCategoryName = normalizeText(productCategory?.name || product.category?.name || '')
    const normalizedProductName = normalizeText(product.name)

    const matchedSuggestion =
      suggestionLibrary.find((config) =>
        config.keywords.some(
          (keyword) =>
            normalizedProductName.includes(keyword) || productCategoryName.includes(keyword)
        )
      ) || defaultSuggestion

    setSuggestionPanel({
      title: matchedSuggestion.title,
      description: matchedSuggestion.description,
      baseProduct: product.name,
      items: matchedSuggestion.items
    })
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
        sort: sortBy
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
      setCategories(Array.isArray(response?.data) ? response.data : [])
    } catch {
      setCategories([])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-white to-[#dbe9ff] py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <header className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">Kitchen Store</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">Sản phẩm</h1>
            <p className="mt-1 text-base text-slate-500">
              Bộ sưu tập nhà bếp hiện đại với thiết kế tối giản, sắc xanh dương làm điểm nhấn để tạo cảm giác sang trọng.
            </p>
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
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-[28px] border border-blue-100/80 bg-white/70 px-6 py-4 text-sm text-slate-500">
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
                  className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-white/70 text-slate-500 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                  className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-blue-100 bg-white p-4 shadow-[0px_18px_40px_rgba(37,99,235,0.12)] transition hover:-translate-y-1 hover:shadow-[0px_24px_60px_rgba(37,99,235,0.25)]"
                >
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.35em] text-blue-400">
                    <span>{product.brand || 'Sang trọng'}</span>
                    {product.salePrice && (
                      <span className="rounded-full bg-blue-600/10 px-2 py-0.5 text-blue-600">-{
                        Math.round(((product.price - product.salePrice) / product.price) * 100)
                      }%</span>
                    )}
                  </div>

                  <div className="mb-4 mt-6 aspect-[4/3] overflow-hidden rounded-[20px] bg-gradient-to-br from-blue-50 via-white to-blue-100">
                    <img
                      src={product.image || FALLBACK_IMAGE}
                      alt={product.name}
                      className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div
                    className="flex flex-1 flex-col cursor-pointer"
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
                    <h3 className="text-base font-semibold text-slate-900 line-clamp-2 min-h-[48px]">{product.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500 min-h-[40px]">
                      {product.description || 'Thiết kế tinh giản, sang trọng cho không gian bếp hiện đại.'}
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="min-h-[46px] space-y-2">
                        {product.salePrice ? (
                          <>
                            <p className="text-xs text-slate-400 line-through">{formatPrice(product.price)}</p>
                            <p className="text-xl font-bold text-slate-900">{formatPrice(product.salePrice)}</p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs opacity-0">placeholder</p>
                            <p className="text-xl font-bold text-slate-900">{formatPrice(product.price)}</p>
                          </>
                        )}
                      </div>

                      <Button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          // TODO: Integrate actual cart logic here
                        }}
                        className="w-full rounded-full bg-blue-600 px-4 py-2 text-[11px] font-semibold tracking-wide text-white hover:bg-blue-500"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Thêm vào giỏ
                      </Button>
                    </div>

                    <div className="mt-auto pt-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleSuggestionClick(product)
                        }}
                        className="flex w-full items-center justify-between rounded-2xl bg-blue-600/5 px-3 py-2 text-[12px] font-medium text-blue-700 transition hover:bg-blue-600/10"
                        title="Xem thêm sản phẩm tương tự"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Gợi ý dành cho bạn
                        </span>
                        <ArrowUpRight className="h-4 w-4" />
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
                  <Button size="sm" className="h-8 rounded-full px-3 text-xs">
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
