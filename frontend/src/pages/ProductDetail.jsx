import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { getProductBySlug } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'
import useCartStore from '@/store/cartStore'
import { ShoppingCart, Minus, Plus, Package, Shield, Truck } from 'lucide-react'

export default function ProductDetail() {
  const { slug } = useParams()
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await getProductBySlug(slug)
      return res.data
    },
  })

  const product = data?.data

  const handleAddToCart = () => {
    addItem(product, quantity)
    // TODO: Show toast
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded w-3/4"></div>
              <div className="bg-gray-200 h-6 rounded w-1/2"></div>
              <div className="bg-gray-200 h-24 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
        <Link to="/products">
          <Button>Quay lại danh sách sản phẩm</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        {' / '}
        <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
        {product.category_name && (
          <>
            {' / '}
            <Link to={`/products?category=${product.category_slug}`} className="hover:text-primary">
              {product.category_name}
            </Link>
          </>
        )}
        {' / '}
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative rounded-lg overflow-hidden mb-4">
            <img
              src={product.images?.[0]?.image_url || product.image_url || 'https://placehold.co/600x600?text=Product'}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
            {product.sale_price && (
              <Badge className="absolute top-4 right-4 bg-red-500 text-lg px-3 py-1">
                Giảm {Math.round(((product.price - product.sale_price) / product.price) * 100)}%
              </Badge>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.image_url}
                  alt={`${product.name} ${idx + 1}`}
                  className="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-75"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.sale_price || product.price)}
            </span>
            {product.sale_price && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <Separator className="my-4" />

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">
                Tình trạng: <span className={product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600'}>
                  {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </span>
            </div>
            {product.brand && (
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Thương hiệu: <span className="font-semibold">{product.brand}</span></span>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Mô tả:</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Số lượng:</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            className="w-full mb-4"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
          </Button>

          {/* Features */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm">Bảo hành chính hãng 2 năm</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Miễn phí vận chuyển toàn quốc</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                <span className="text-sm">Đổi trả trong 7 ngày</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Specifications */}
      {product.specifications && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Thông số kỹ thuật</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex border-b pb-2">
                    <span className="font-semibold w-1/3">{key}:</span>
                    <span className="w-2/3 text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
