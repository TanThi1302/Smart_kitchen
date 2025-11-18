import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getFeaturedProducts, getPromotions, getCategories } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import useCartStore from '@/store/cartStore'
import { ShoppingCart, ArrowRight, Tag } from 'lucide-react'
import { NewsletterForm } from '@/components/promotion/NewsletterForm'

export default function Home() {
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const res = await getFeaturedProducts()
      return res.data
    },
  })

  const { data: promotionsData } = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const res = await getPromotions()
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
  const promotions = promotionsData?.data || []
  const categories = categoriesData?.data || []

  const handleAddToCart = (product) => {
    addItem(product)

  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-350 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                SMART KITCHEN, SMART LIFE
              </h1>
              <p className="text-xl mb-6 text-blue-100">
                Tinh tế và đẳng cấp đến từng chi tiết!
              </p>
              <p className="text-lg mb-8 text-blue-100">
                Thiết bị nhà bếp cao cấp từ Đức - Công nghệ hiện đại, bền bỉ theo thời gian
              </p>
              <div className="flex gap-4">
                <Link 
                  to="/products" 
                  className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Xem sản phẩm
                </Link>
                <Link 
                  to="/contact" 
                  className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
                >
                  Liên hệ ngay
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/images/banner/banner.jpg" 
                alt="Modern Kitchen" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#f9fafb" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Promotions */}
      {promotions.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-6">
            <Tag className="h-6 w-6 mr-2 text-red-500" />
            <h2 className="text-3xl font-bold">Khuyến Mãi Hot</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <Card key={promo.id} className="border-red-200 bg-gradient-to-br from-red-50 to-orange-50 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Badge variant="destructive" className="mb-3 text-sm">
                    {promo.discount_percent && `Giảm ${promo.discount_percent}%`}
                    {promo.discount_amount && `Giảm ${formatPrice(promo.discount_amount)}`}
                  </Badge>
                  <h3 className="font-bold text-xl mb-2">{promo.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{promo.description}</p>
                  {promo.end_date && (
                    <p className="text-xs text-gray-500 mt-3">
                      Hết hạn: {new Date(promo.end_date).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Danh mục sản phẩm</h2>
              <p className="text-gray-600">Khám phá các dòng sản phẩm chất lượng cao</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors overflow-hidden">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <ShoppingCart className="w-10 h-10 text-primary" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.product_count || 0} sản phẩm
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Sản Phẩm Nổi Bật</h2>
          <Link to="/products">
            <Button variant="outline">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-xl transition-shadow duration-300">
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
                          Giảm {Math.round(((product.price - product.sale_price) / product.price) * 100)}%
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
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Thêm vào giỏ
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Miễn phí vận chuyển</h3>
            <p className="text-gray-600">Cho đơn hàng trên 5 triệu đồng</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Giá tốt nhất</h3>
            <p className="text-gray-600">Cam kết giá cạnh tranh nhất thị trường</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Bảo hành dài hạn</h3>
            <p className="text-gray-600">Bảo hành chính hãng từ 2-5 năm</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterForm />
    </div>
  )
}