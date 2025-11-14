import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ShoppingCart, Heart, Share2, ChefHat, Check,
  Truck, RefreshCw, Shield, CreditCard, ChevronRight,
  Minus, Plus, MapPin, MessageCircle, Gift, Package,
  ZoomIn, Play, Award, ThumbsUp, Facebook, Twitter,
  Instagram, Link as LinkIcon, X, ChevronLeft, Info, Loader2, AlertCircle, BookOpen
} from 'lucide-react'
import { getProductBySlug, getRelatedProducts } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import useCartStore from '@/store/cartStore'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const addItem = useCartStore(state => state.addItem)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState('2L')
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [showZoom, setShowZoom] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showCartPopup, setShowCartPopup] = useState(false)

  // Fetch product data
  const { data: productData, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug
  })

  // Fetch related products
  const { data: relatedData, isLoading: relatedLoading } = useQuery({
    queryKey: ['related-products', slug],
    queryFn: () => getRelatedProducts(slug),
    enabled: !!slug
  })

  const product = productData?.data?.data
  const relatedProducts = relatedData?.data?.data || []

  // Handle images - use fallback images
  const fallbackImages = Array.isArray(product?.images) ? product?.images : (product?.images ? [product?.images] : (product?.image ? [product?.image] : []))
  const allImages = fallbackImages
  // Remove duplicates and filter out invalid URLs
  const images = allImages.filter((img, index, self) =>
    self.findIndex(i => (typeof i === 'string' ? i : i?.image_url) === (typeof img === 'string' ? img : img?.image_url)) === index
  ).filter(img => {
    const url = typeof img === 'string' ? img : img?.image_url
    return url && url.trim() !== ''
  })
  const placeholderImage = 'https://via.placeholder.com/500x500?text=No+Image'

  // Get image URLs for display
  const imageUrls = images.map(img => typeof img === 'string' ? img : img?.image_url)

  // Safe price parsing and formatting
  const parsePrice = (price) => {
    if (!price) return null
    const cleaned = typeof price === 'string' ? price.replace(/[,₫]/g, '') : price
    const num = Number(cleaned)
    return isNaN(num) ? null : num
  }

  const safeFormatPrice = (price) => {
    const parsed = parsePrice(price)
    return parsed !== null ? formatPrice(parsed) : 'Đang cập nhật'
  }

  // Redirect if product not found
  useEffect(() => {
    if (productError) {
      navigate('/products')
      toast({
        title: "Sản phẩm không tồn tại",
        description: "Sản phẩm bạn tìm kiếm không có sẵn.",
        variant: "destructive"
      })
    }
  }, [productError, navigate, toast])

  useEffect(() => {
    setSelectedImage(0)
  }, [product])

  // Parse specifications from product data
  const getSpecifications = () => {
    if (!product?.specifications) {
      return []
    }

    try {
      let specs = product.specifications
      if (typeof specs === 'string') {
        try {
          specs = JSON.parse(specs)
        } catch (e) {
          // If parsing fails, treat it as a plain string
          return [{ label: 'Thông số', value: String(specs) }];
        }
      }

      if (Array.isArray(specs)) {
        return specs.map(spec => {
          if (typeof spec === 'object' && spec !== null && 'label' in spec && 'value' in spec) {
            return spec;
          } else if (typeof spec === 'object' && spec !== null) {
            // Handle cases where array elements are objects but not directly {label, value}
            return Object.entries(spec).map(([key, value]) => ({ label: key, value: value })).flat();
          } else {
            // Fallback for unexpected array elements
            return { label: 'Thông số', value: String(spec) };
          }
        }).flat(); // Flatten in case of nested arrays from object parsing
      } else if (typeof specs === 'object' && specs !== null) {
        return Object.entries(specs).map(([key, value]) => ({
          label: key,
          value: value
        }))
      }
    } catch (error) {
      console.error('Error parsing specifications:', error)
    }

    return []
  }

  const specifications = getSpecifications()

  const policies = [
    { icon: Truck, title: 'Miễn phí vận chuyển', desc: 'Đơn hàng từ 500K' },
    { icon: RefreshCw, title: 'Đổi trả 30 ngày', desc: 'Nếu có lỗi từ NSX' },
    { icon: Shield, title: 'Bảo hành 24 tháng', desc: 'Chính hãng toàn quốc' },
    { icon: CreditCard, title: 'Thanh toán linh hoạt', desc: 'COD, chuyển khoản, trả góp' }
  ]

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const currentPrice = parsePrice(product?.sale_price) || parsePrice(product?.price)
  const crossedPrice = parsePrice(product?.sale_price) ? parsePrice(product?.price) : null
  const discount = crossedPrice && currentPrice && crossedPrice > currentPrice ? Math.round(((crossedPrice - currentPrice) / crossedPrice) * 100) : 0

  const handleAddToCart = () => {
    if (!product) return
    const cartItem = {
      ...product,
      quantity,
      variant: selectedVariant,
    }
    addItem(cartItem)
    setShowCartPopup(true)
    setTimeout(() => setShowCartPopup(false), 3000)
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} đã được thêm vào giỏ hàng.`,
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Không tìm thấy sản phẩm</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      {/* <header className="bg-white border-b-2 border-cyan-100 shadow-sm sticky top-0 z-40">
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
            
            <button className="relative bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-6 py-3 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2">
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
      </header> */}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-cyan-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="hover:text-cyan-600 cursor-pointer">Trang chủ</span>
            <ChevronRight className="h-4 w-4" />
            <span className="hover:text-cyan-600 cursor-pointer">Thiết bị điện</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-cyan-600 font-medium">Nồi áp suất</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Product Section */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-cyan-100 p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="relative mb-4 bg-gray-50 rounded-2xl overflow-hidden group">
                <img
                  src={imageUrls[selectedImage] || placeholderImage}
                  alt={product.name}
                  className="w-full h-[500px] object-contain cursor-zoom-in"
                  onClick={() => setShowZoom(true)}
                />
                
                {/* Zoom Icon */}
                <button
                  onClick={() => setShowZoom(true)}
                  className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <ZoomIn className="h-5 w-5 text-gray-700" />
                </button>

                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {(product.tags || []).map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative rounded-xl overflow-hidden border-3 transition-all ${
                      selectedImage === i
                        ? 'border-cyan-500 ring-2 ring-cyan-300'
                        : 'border-gray-200 hover:border-cyan-300'
                    }`}
                  >
                    <img
                      src={imageUrls[i] || placeholderImage}
                      alt={`View ${i + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>

     
            </div>

            {/* Right: Product Info */}
            <div>
              {/* Product Name & SKU */}
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500">
                  SKU: <span className="font-medium text-gray-700">{product.sku}</span> | 
                  Thương hiệu: <span className="font-medium text-cyan-600">{product.brand}</span>
                </p>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    {safeFormatPrice(product?.sale_price || product?.price)}
                  </p>
                  {discount > 0 && (
                    <span className="bg-red-500 text-white text-lg font-bold px-3 py-1 rounded-full">
                      -{discount}%
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-lg text-gray-500 line-through">
                    {safeFormatPrice(product?.price)}
                  </p>
                )}
              </div>

              
              {/* Quantity & Stock */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Số lượng</h3>
                  <p className="text-sm text-gray-600">
                    Còn lại: <span className="font-bold text-green-600">{product.stock}</span> sản phẩm
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border-2 border-cyan-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 bg-gray-50 hover:bg-cyan-50 text-gray-700 transition-colors"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center font-bold text-lg border-x-2 border-cyan-200 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-3 bg-gray-50 hover:bg-cyan-50 text-gray-700 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
                >
                  <ShoppingCart className="h-6 w-6" />
                  MUA NGAY
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
                >
                  <ShoppingCart className="h-6 w-6" />
                  THÊM VÀO GIỎ
                </button>
              </div>

              

              {/* Policies */}
              <div className="grid grid-cols-2 gap-3">
                {policies.map((policy, i) => {
                  const Icon = policy.icon
                  return (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-100 rounded-xl p-4"
                    >
                      <Icon className="h-6 w-6 text-cyan-600 mb-2" />
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {policy.title}
                      </h4>
                      <p className="text-xs text-gray-600">{policy.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-cyan-100 mb-8">
          {/* Tab Headers */}
          <div className="border-b-2 border-gray-100 flex">
            {[
              { id: 'description', label: 'Mô tả sản phẩm', icon: Info },
              { id: 'specs', label: 'Thông số kỹ thuật', icon: Package },
              { id: 'manual', label: 'Hướng dẫn sử dụng', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 font-semibold transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-cyan-600 border-b-4 border-cyan-500 bg-cyan-50'
                      : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                  {tab.id === 'reviews' && (
                    <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full ml-1">
                      {product.reviews}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                {(product.description_highlights || product.description) ? (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description_highlights || product.description}
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Mô tả sản phẩm chưa được cập nhật.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Thông số kỹ thuật
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {specifications.map((spec, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-r from-gray-50 to-cyan-50 border-2 border-gray-200 rounded-xl p-4 hover:border-cyan-300 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">{spec.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6">
                  <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="h-6 w-6 text-cyan-600" />
                    Chứng nhận & Tiêu chuẩn
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 text-center">
                      <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="font-semibold text-sm">Chứng nhận ISO 9001</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center">
                      <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="font-semibold text-sm">Tiêu chuẩn CE</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center">
                      <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="font-semibold text-sm">An toàn FDA</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'manual' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BookOpen className="h-7 w-7 text-cyan-600" />
                  Hướng dẫn sử dụng
                </h3>

                <div className="space-y-6">
                  {/* Safety Instructions */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6">
                    <h4 className="font-bold text-lg text-red-900 mb-4 flex items-center gap-2">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                      Lưu ý an toàn quan trọng
                    </h4>
                    <ul className="space-y-2 text-red-800">
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        Không mở nắp khi nồi đang có áp suất
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        Không vượt quá mức nước tối đa (2/3 dung tích nồi)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        Không sử dụng trên bếp ga không có van an toàn
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        Giữ khoảng cách an toàn với trẻ em và vật dễ cháy
                      </li>
                    </ul>
                  </div>

                  {/* Usage Steps */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6">
                    <h4 className="font-bold text-lg text-cyan-900 mb-4 flex items-center gap-2">
                      <ChefHat className="h-6 w-6 text-cyan-600" />
                      Cách sử dụng cơ bản
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Chuẩn bị:</h5>
                        <ol className="space-y-2 text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="bg-cyan-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                            Kiểm tra van an toàn và gioăng cao su
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-cyan-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                            Cho thực phẩm và nước vào nồi (không quá 2/3)
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-cyan-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                            Đóng chặt nắp và khóa an toàn
                          </li>
                        </ol>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Nấu:</h5>
                        <ol className="space-y-2 text-gray-700" start="4">
                          <li className="flex items-start gap-2">
                            <span className="bg-cyan-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
                            Bật bếp ở mức nhiệt cao cho đến khi có áp suất
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-cyan-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">5</span>
                            Giảm nhiệt xuống mức trung bình để duy trì áp suất
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-cyan-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">6</span>
                            Tắt bếp và để áp suất tự nhiên giảm
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Cooking Programs */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                    <h4 className="font-bold text-lg text-green-900 mb-4 flex items-center gap-2">
                      <Play className="h-6 w-6 text-green-600" />
                      Chương trình nấu tự động
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                        <h5 className="font-semibold text-gray-900 mb-2">Cơm</h5>
                        <p className="text-sm text-gray-600">25-35 phút</p>
                        <p className="text-xs text-gray-500 mt-1">Nấu cơm trắng, cơm nếp</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                        <h5 className="font-semibold text-gray-900 mb-2">Thịt hầm</h5>
                        <p className="text-sm text-gray-600">35-45 phút</p>
                        <p className="text-xs text-gray-500 mt-1">Thịt bò, thịt gà, sườn</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                        <h5 className="font-semibold text-gray-900 mb-2">Canh/Súp</h5>
                        <p className="text-sm text-gray-600">15-25 phút</p>
                        <p className="text-xs text-gray-500 mt-1">Canh rau, súp gà</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                        <h5 className="font-semibold text-gray-900 mb-2">Đồ hộp</h5>
                        <p className="text-sm text-gray-600">10-15 phút</p>
                        <p className="text-xs text-gray-500 mt-1">Thịt hộp, rau củ</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                        <h5 className="font-semibold text-gray-900 mb-2">Hấp</h5>
                        <p className="text-sm text-gray-600">20-30 phút</p>
                        <p className="text-xs text-gray-500 mt-1">Hấp cá, hấp trứng</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                        <h5 className="font-semibold text-gray-900 mb-2">Tự nấu</h5>
                        <p className="text-sm text-gray-600">Theo nhu cầu</p>
                        <p className="text-xs text-gray-500 mt-1">Điều chỉnh thời gian thủ công</p>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6">
                    <h4 className="font-bold text-lg text-purple-900 mb-4 flex items-center gap-2">
                      <RefreshCw className="h-6 w-6 text-purple-600" />
                      Bảo quản & Bảo dưỡng
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Vệ sinh sau mỗi lần sử dụng:</h5>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Rửa sạch nồi và nắp bằng nước ấm</li>
                          <li>• Kiểm tra và làm sạch van an toàn</li>
                          <li>• Lau khô hoàn toàn trước khi cất giữ</li>
                          <li>• Không sử dụng chất tẩy rửa mạnh</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Bảo dưỡng định kỳ:</h5>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• Thay gioăng cao su 6-12 tháng/lần</li>
                          <li>• Kiểm tra van an toàn hàng tháng</li>
                          <li>• Bảo quản nơi khô ráo, thoáng mát</li>
                          <li>• Mang đến trung tâm bảo hành định kỳ</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-cyan-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Gift className="h-7 w-7 text-cyan-600" />
            Sản phẩm liên quan
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(relatedProducts || []).map((relProduct) => (
              <Link
                key={relProduct.id}
                to={`/products/${relProduct.slug}`}
                className="bg-white border-2 border-cyan-100 rounded-2xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={relProduct.image_url || relProduct.image || placeholderImage}
                    alt={relProduct.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                 
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
                    {relProduct.name}
                  </h4>
                  <p className="text-lg font-bold text-cyan-600">
                    {formatPrice(relProduct.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {showZoom && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowZoom(false)}
            className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <X className="h-6 w-6 text-gray-800" />
          </button>
          <div className="relative max-w-5xl w-full">
            <img
              src={imageUrls[selectedImage]}
              alt={product.name}
              className="w-full h-auto rounded-2xl"
            />
            {selectedImage > 0 && (
              <button
                onClick={() => setSelectedImage(selectedImage - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <ChevronLeft className="h-6 w-6 text-gray-800" />
              </button>
            )}
            {selectedImage < imageUrls.length - 1 && (
              <button
                onClick={() => setSelectedImage(selectedImage + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <ChevronRight className="h-6 w-6 text-gray-800" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Chia sẻ sản phẩm</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-blue-50 transition-colors">
                <div className="bg-blue-500 p-3 rounded-full">
                  <Facebook className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-blue-50 transition-colors">
                <div className="bg-blue-400 p-3 rounded-full">
                  <Twitter className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs text-gray-600">Twitter</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-pink-50 transition-colors">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs text-gray-600">Instagram</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="bg-gray-500 p-3 rounded-full">
                  <LinkIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs text-gray-600">Copy Link</span>
              </button>
            </div>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 flex items-center gap-3">
              <input
                type="text"
                value="https://kitchenstore.vn/noi-ap-suat-pro"
                readOnly
                className="flex-1 bg-transparent focus:outline-none text-sm text-gray-600"
              />
              <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-600 transition-colors">
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Popup Notification */}
      {showCartPopup && (
        <div className="fixed top-24 right-4 bg-white border-2 border-green-400 rounded-2xl shadow-2xl p-6 z-50 animate-in slide-in-from-right">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">
                Đã thêm vào giỏ hàng!
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {product.name}
              </p>
              <div className="flex gap-2">
                <button className="text-sm text-cyan-600 font-semibold hover:text-cyan-700">
                  Xem giỏ hàng
                </button>
                <span className="text-gray-300">|</span>
                <button className="text-sm text-orange-600 font-semibold hover:text-orange-700">
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

     
    </div>
  )
}