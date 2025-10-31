import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { getProducts, getCategories } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils'
import useCartStore from '@/store/cartStore'
import { ShoppingCart, Search, Filter } from 'lucide-react'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  const page = parseInt(searchParams.get('page')) || 1
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', page, category, search],
    queryFn: async () => {
      const res = await getProducts({ page, category, search, limit: 12 })
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

  const addItem = useCartStore((state) => state.addItem)
  const products = productsData?.data || []
  const pagination = productsData?.pagination || {}
  const categories = categoriesData?.data || []

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ search: searchTerm, page: 1 })
  }

  const handleCategoryChange = (slug) => {
    setSearchParams({ category: slug, page: 1 })
  }

  const handlePageChange = (newPage) => {
    const params = {}
    if (category) params.category = category
    if (search) params.search = search
    params.page = newPage
    setSearchParams(params)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sản Phẩm</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Filters */}
        <aside className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              {/* Search */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </h3>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Tìm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Danh mục
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      !category ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    Tất cả sản phẩm
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        category === cat.slug ? 'bg-primary text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                      <span className="text-sm ml-2 opacity-75">({cat.product_count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Results info */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Hiển thị {products.length} trên {pagination.total || 0} sản phẩm
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-xl transition-shadow">
                    <CardContent className="p-4">
                      <Link to={`/products/${product.slug}`}>
                        <div className="relative mb-4 overflow-hidden rounded-md group">
                          <img
                            src={product.image_url || 'https://placehold.co/300x300?text=Product'}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {product.sale_price && (
                            <Badge className="absolute top-2 right-2 bg-red-500">
                              -{Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors min-h-[3rem]">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="space-y-1 mb-3">
                        {product.sale_price && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </p>
                        )}
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(product.sale_price || product.price)}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        onClick={() => addItem(product)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Thêm vào giỏ
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Trước
                  </Button>
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return <span key={pageNum} className="px-2">...</span>
                    }
                    return null
                  })}
                  <Button
                    variant="outline"
                    disabled={page >= pagination.totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
