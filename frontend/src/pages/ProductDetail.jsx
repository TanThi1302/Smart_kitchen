import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Gift,
  Heart,
  Info,
  Loader2,
  Minus,
  Plus,
  RefreshCw,
  Share2,
  Shield,
  ShoppingCart,
  Sparkles,
  Truck,
  X,
  ZoomIn
} from 'lucide-react'
import { getProductBySlug, getRelatedProducts } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import useCartStore from '@/store/cartStore'
import { getProductDescription } from '@/data/productDescriptions'

const FALLBACK_IMAGE = 'https://via.placeholder.com/720x720?text=Smart+Kitchen'

const formatPrice = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const addItem = useCartStore((state) => state.addItem)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [showZoom, setShowZoom] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [favorite, setFavorite] = useState(false)

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug)
  })

  const { data: relatedData } = useQuery({
    queryKey: ['related-products', slug],
    queryFn: () => getRelatedProducts(slug),
    enabled: Boolean(slug)
  })

  const product = productData?.data?.data
  const related = relatedData?.data?.data ?? []

  useEffect(() => {
    if (error) {
      toast({
        title: 'Không tìm thấy sản phẩm',
        description: 'Vui lòng chọn sản phẩm khác.',
        variant: 'destructive'
      })
      navigate('/products')
    }
  }, [error, navigate, toast])

  useEffect(() => {
    setSelectedImage(0)
  }, [product?.id])

  const gallery = useMemo(() => {
    if (!product) return [FALLBACK_IMAGE]
    const raw = Array.isArray(product.images)
      ? product.images
      : product.image
        ? [product.image]
        : []
    const urls = raw
      .map((img) => (typeof img === 'string' ? img : img?.image_url))
      .filter(Boolean)
    return urls.length ? urls : [FALLBACK_IMAGE]
  }, [product])



  const productDescription = useMemo(() => {
    const existing = product?.description_highlights || product?.description
    if (existing) return existing

    // Fallback to sample descriptions based on product name keywords
    const name = product?.name?.toLowerCase() || ''
    if (name.includes('xay sinh tố') || name.includes('blender')) {
      return getProductDescription('blender').full
    } else if (name.includes('lò nướng') || name.includes('oven')) {
      return getProductDescription('oven').full
    } else if (name.includes('lò vi sóng') || name.includes('microwave')) {
      return getProductDescription('microwave').full
    } else if (name.includes('pha cà phê') || name.includes('coffee')) {
      return getProductDescription('coffee_machine').full
    } else if (name.includes('chiên không dầu') || name.includes('air fryer')) {
      return getProductDescription('air_fryer').full
    } else if (name.includes('rửa bát') || name.includes('dishwasher')) {
      return getProductDescription('dishwasher').full
    }
    return getProductDescription().full
  }, [product])

  const currentPrice = product?.sale_price ?? product?.price ?? 0
  const comparePrice = product?.sale_price ? product?.price : null
  const discount = comparePrice
    ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
    : 0

  const stock = Number(product?.stock) || 0

  const handleAddToCart = () => {
    if (!product) return
    addItem({ ...product, quantity })
    toast({
      title: 'Đã thêm vào giỏ',
      description: `${product.name} x${quantity}`
    })
  }

  if (isLoading || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center text-blue-500">
          <Loader2 className="mx-auto mb-3 h-10 w-10 animate-spin text-blue-400" />
          Đang tải sản phẩm...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <header className="border-b border-blue-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-4 text-sm text-blue-500">
          <Link to="/" className="transition hover:text-blue-700">
            Trang chủ
          </Link>
          <ChevronRight className="h-4 w-4 text-blue-200" />
          <Link to="/products" className="transition hover:text-blue-700">
            Sản phẩm
          </Link>
          <ChevronRight className="h-4 w-4 text-blue-200" />
          <span className="font-semibold text-blue-900">{product?.name || 'Sản phẩm'}</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        <section className="grid gap-10 rounded-[32px] bg-white/95 p-8 shadow-[0_25px_60px_rgba(37,99,235,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-50 to-white">
              <img
                src={gallery[selectedImage]}
                alt={product.name}
                className="h-[420px] w-full object-contain"
              />
              {discount > 0 && (
                <span className="absolute left-5 top-5 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-1 text-sm font-semibold text-white shadow">
                  -{discount}%
                </span>
              )}
              <button
                onClick={() => setShowZoom(true)}
                className="absolute right-5 top-5 rounded-full bg-white p-3 text-blue-600 shadow-md transition hover:scale-110"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {gallery.map((img, index) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-2xl border bg-white p-1 transition ${
                      index === selectedImage
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-blue-100 hover:border-blue-300'
                    }`}
                  >
                    <img src={img} alt="thumb" className="h-20 w-20 rounded-xl object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-400">
                KITCHEN STORE
              </p>
              <h1 className="text-3xl font-semibold text-blue-900">{product.name}</h1>
              <p className="text-sm text-blue-600">
                {product.description_highlights || 'Thiết bị nhà bếp cao cấp, hoàn thiện tối giản và tiện dụng.'}
              </p>
            </div>

            <div className="rounded-[24px] bg-gradient-to-r from-blue-50 to-blue-100 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-red-500 font-semibold ">Giá ưu đãi</p>
              <div className="mt-2 flex items-end gap-3">
                <span className="text-4xl font-semibold text-blue-900">{formatPrice(currentPrice)}</span>
                {comparePrice && (
                  <span className="text-sm text-blue-400 line-through">{formatPrice(comparePrice)}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Truck, label: 'Giao nhanh 48h' },
                { icon: Shield, label: 'Bảo hành 24 tháng' },
                { icon: CreditCard, label: 'Thanh toán linh hoạt' },
                { icon: RefreshCw, label: 'Đổi trả 30 ngày' }
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm text-blue-600">
                  <Icon className="h-4 w-4 text-blue-500" />
                  {label}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-blue-500">
                <span>Số lượng</span>
                <span>{stock ? `${stock} sản phẩm còn lại` : 'Tạm hết hàng'}</span>
              </div>
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-white">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 text-blue-500"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 border-x border-blue-100 py-2 text-center text-lg font-semibold text-blue-900 focus:outline-none"
                />
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-4 py-2 text-blue-500"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-400 py-4 text-base font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                <ShoppingCart className="h-5 w-5" /> Thêm vào giỏ
              </button>
             
            </div>
          </div>
        </section>

        <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_60px_rgba(37,99,235,0.08)]">
          <div className="flex flex-wrap gap-3 border-b border-blue-100 pb-3 text-sm font-semibold text-blue-500">
            {[
              { id: 'description', label: 'Mô tả', icon: Info },
              { id: 'manual', label: 'Hướng dẫn', icon: BookOpen }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 transition ${
                  activeTab === id ? 'bg-blue-600 text-white shadow' : 'text-blue-500 hover:bg-blue-50'
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>

          <div className="pt-6 text-gray-800">
            {activeTab === 'description' && (
              <div className="leading-relaxed whitespace-pre-line">
                {productDescription}
              </div>
            )}



            {activeTab === 'manual' && (
              <div className="space-y-4 text-sm">
                <div className="rounded-2xl bg-blue-50 p-5">
                  <p className="flex items-center gap-2 font-semibold text-blue-900">
                    <AlertCircle className="h-4 w-4 text-blue-500" /> Lưu ý an toàn
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-blue-700/80">
                    <li>Không mở nắp khi vẫn còn áp suất.</li>
                    <li>Vệ sinh sạch sau mỗi lần dùng.</li>
                    <li>Kiểm tra van, gioăng định kỳ.</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-blue-100 p-5">
                  <p className="font-semibold text-blue-900">Bảo dưỡng</p>
                  <p className="text-blue-700">
                    Thay gioăng 6-12 tháng/lần, bảo quản nơi khô ráo và kiểm tra hệ thống an toàn trước khi sử dụng.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_60px_rgba(37,99,235,0.08)]">
          <div className="mb-5 flex items-center justify-between text-blue-900">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-blue-400">Smart Kitchen</p>
              <h3 className="text-2xl font-semibold">Sản phẩm liên quan</h3>
            </div>
            <Link to="/products" className="text-sm font-semibold text-blue-500 hover:text-blue-700">
              Xem tất cả
            </Link>
          </div>
          {related.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/products/${item.slug}`}
                  className="group rounded-2xl border border-blue-100 bg-blue-50/40 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-3 overflow-hidden rounded-xl bg-white">
                    <img
                      src={item.image_url || item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      className="h-32 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="line-clamp-2 text-sm font-semibold text-blue-900">{item.name}</p>
                  <p className="mt-2 text-base font-bold text-blue-600">{formatPrice(item.price)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-600">
              Chưa có sản phẩm liên quan. Hãy quay lại sau nhé!
            </p>
          )}
        </section>
      </main>

      {showZoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <button
            onClick={() => setShowZoom(false)}
            className="absolute right-8 top-8 rounded-full bg-white/90 p-3 text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative w-full max-w-4xl">
            <img src={gallery[selectedImage]} alt={product.name} className="w-full rounded-[32px]" />
            {selectedImage > 0 && (
              <button
                onClick={() => setSelectedImage((prev) => prev - 1)}
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-slate-600"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {selectedImage < gallery.length - 1 && (
              <button
                onClick={() => setSelectedImage((prev) => prev + 1)}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-slate-600"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-slate-700">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold">Chia sẻ sản phẩm</h4>
              <button onClick={() => setShowShare(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[Share2, Sparkles, Share2, Share2].map((Icon, index) => (
                <button key={index} className="rounded-2xl border border-slate-200 p-3">
                  <Icon className="mx-auto h-5 w-5 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
