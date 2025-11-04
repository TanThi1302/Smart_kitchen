import { useState } from 'react'
import { 
  ShoppingCart, Heart, Share2, ChefHat, Star, Check, 
  Truck, RefreshCw, Shield, CreditCard, ChevronRight,
  Minus, Plus, MapPin, MessageCircle, Gift, Package,
  ZoomIn, Play, Award, ThumbsUp, Facebook, Twitter,
  Instagram, Link as LinkIcon, X, ChevronLeft, Info
} from 'lucide-react'

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState('2L')
  const [selectedColor, setSelectedColor] = useState('Đỏ')
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [showZoom, setShowZoom] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [cart, setCart] = useState([])
  const [showCartPopup, setShowCartPopup] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')

  const product = {
    id: 1,
    name: 'Nồi Áp Suất Đa Năng Cao Cấp SmartCook Pro',
    sku: 'NSC-2024-PRO',
    brand: 'KitchenAid',
    price: 3500000,
    salePrice: 2790000,
    rating: 4.8,
    reviews: 342,
    stock: 45,
    sold: 1250,
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&h=800&fit=crop'
    ],
    variants: ['1.5L', '2L', '2.5L', '3L'],
    colors: ['Đỏ', 'Bạc', 'Đen'],
    tags: ['Bán chạy', 'Giảm giá sốc', 'Miễn phí vận chuyển']
  }

  const specifications = [
    { label: 'Dung tích', value: '2.0 Lít' },
    { label: 'Công suất', value: '1200W' },
    { label: 'Chất liệu', value: 'Thép không gỉ 304' },
    { label: 'Áp suất tối đa', value: '80 kPa' },
    { label: 'Chương trình nấu', value: '12 chế độ tự động' },
    { label: 'Điện áp', value: '220V - 50Hz' },
    { label: 'Bảo hành', value: '24 tháng chính hãng' },
    { label: 'Xuất xứ', value: 'Nhật Bản' }
  ]

  const policies = [
    { icon: Truck, title: 'Miễn phí vận chuyển', desc: 'Đơn hàng từ 500K' },
    { icon: RefreshCw, title: 'Đổi trả 30 ngày', desc: 'Nếu có lỗi từ NSX' },
    { icon: Shield, title: 'Bảo hành 24 tháng', desc: 'Chính hãng toàn quốc' },
    { icon: CreditCard, title: 'Thanh toán linh hoạt', desc: 'COD, chuyển khoản, trả góp' }
  ]

  const relatedProducts = [
    {
      id: 2,
      name: 'Bộ nồi inox 5 món',
      price: 1990000,
      image: 'https://images.unsplash.com/photo-1584990347449-39b223174921?w=300&h=300&fit=crop',
      rating: 4.7
    },
    {
      id: 3,
      name: 'Chảo chống dính 28cm',
      price: 890000,
      image: 'https://images.unsplash.com/photo-1565117933268-0e7102cd4cee?w=300&h=300&fit=crop',
      rating: 4.6
    },
    {
      id: 4,
      name: 'Máy xay sinh tố',
      price: 1650000,
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=300&h=300&fit=crop',
      rating: 4.8
    },
    {
      id: 5,
      name: 'Bộ dao 6 món',
      price: 1200000,
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=300&h=300&fit=crop',
      rating: 4.9
    }
  ]

  const customerReviews = [
    {
      id: 1,
      name: 'Nguyễn Thị Mai',
      rating: 5,
      date: '15/10/2024',
      comment: 'Sản phẩm rất tốt, nấu cơm nhanh và ngon. Thiết kế đẹp, dễ sử dụng.',
      images: ['https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=150&h=150&fit=crop'],
      verified: true,
      helpful: 24
    },
    {
      id: 2,
      name: 'Trần Văn Hùng',
      rating: 4,
      date: '10/10/2024',
      comment: 'Chất lượng tốt, đóng gói cẩn thận. Giao hàng nhanh.',
      images: [],
      verified: true,
      helpful: 18
    },
    {
      id: 3,
      name: 'Lê Thị Hoa',
      rating: 5,
      date: '05/10/2024',
      comment: 'Đã dùng được 2 tuần, rất hài lòng. Nấu nhiều món được, tiết kiệm thời gian.',
      images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=150&h=150&fit=crop'],
      verified: true,
      helpful: 32
    }
  ]

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const discount = Math.round(((product.price - product.salePrice) / product.price) * 100)

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity,
      variant: selectedVariant,
      color: selectedColor
    }
    setCart([...cart, cartItem])
    setShowCartPopup(true)
    setTimeout(() => setShowCartPopup(false), 3000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    alert('Chuyển đến trang thanh toán...')
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
                  src={product.images[selectedImage]}
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
                  {product.tags.map((tag, i) => (
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
                {product.images.map((img, i) => (
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
                      src={img}
                      alt={`View ${i + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Video Button */}
              <button className="w-full mt-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl py-3 flex items-center justify-center gap-2 text-cyan-700 font-semibold hover:from-cyan-100 hover:to-blue-100 transition-colors">
                <Play className="h-5 w-5" />
                Xem video sản phẩm
              </button>
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

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">{product.rating}</span>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <button className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
                  {product.reviews} đánh giá
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{product.sold}</span> đã bán
                </p>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    {formatPrice(product.salePrice)}
                  </p>
                  <span className="bg-red-500 text-white text-lg font-bold px-3 py-1 rounded-full">
                    -{discount}%
                  </span>
                </div>
                <p className="text-lg text-gray-500 line-through">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Variants */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-cyan-600" />
                  Dung tích
                </h3>
                <div className="flex gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        selectedVariant === variant
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Màu sắc</h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        selectedColor === color
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
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

              {/* Secondary Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex-1 border-2 border-cyan-300 text-cyan-600 font-semibold py-3 rounded-xl hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                  />
                  Yêu thích
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex-1 border-2 border-cyan-300 text-cyan-600 font-semibold py-3 rounded-xl hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="h-5 w-5" />
                  Chia sẻ
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
              { id: 'reviews', label: 'Đánh giá', icon: Star }
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Nồi Áp Suất Đa Năng SmartCook Pro
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Nồi áp suất đa năng SmartCook Pro là sản phẩm tiên tiến nhất của KitchenAid, 
                  được thiết kế để mang lại trải nghiệm nấu nướng hoàn hảo cho gia đình bạn. 
                  Với công nghệ áp suất thông minh và 12 chương trình nấu tự động, 
                  bạn có thể chế biến mọi món ăn từ cơm, soup, thịt kho đến các món hầm, 
                  nấu chậm một cách dễ dàng và tiết kiệm thời gian.
                </p>
                
                <h4 className="text-xl font-bold text-gray-900 mb-3">Tính năng nổi bật:</h4>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>12 chương trình nấu tự động:</strong> Cơm trắng, cơm gạo lứt, súp, thịt kho, 
                      hầm xương, nấu chậm, hấp, xào, làm sữa chua, làm bánh, hâm nóng, giữ ấm
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Công nghệ áp suất thông minh:</strong> Tự động điều chỉnh áp suất 
                      phù hợp với từng món ăn, đảm bảo thức ăn chín đều và giữ nguyên dinh dưỡng
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>An toàn tuyệt đối:</strong> 10 lớp bảo vệ an toàn, 
                      van xả áp tự động, khóa nắp thông minh
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Màn hình LED thông minh:</strong> Hiển thị rõ ràng, 
                      dễ dàng điều khiển và theo dõi quá trình nấu
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Tiết kiệm điện năng:</strong> Công suất 1200W, 
                      tiết kiệm đến 70% thời gian và 50% điện năng so với nấu truyền thống
                    </span>
                  </li>
                </ul>

                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-cyan-900 mb-3 flex items-center gap-2">
                    <Gift className="h-6 w-6" />
                    Quà tặng kèm theo:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-cyan-600" />
                      Xửng hấp inox cao cấp
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-cyan-600" />
                      Muỗng múc cơm chống dính
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-cyan-600" />
                      Cốc đong lường
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-cyan-600" />
                      Sách hướng dẫn 100+ công thức nấu ăn
                    </li>
                  </ul>
                </div>
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
                        <span className="text-gray-900 font-bold">{spec.value}</span>
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

            {activeTab === 'reviews' && (
              <div>
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  {/* Rating Summary */}
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-8 text-center md:w-80">
                    <div className="text-6xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      {product.rating}
                    </div>
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 font-medium">
                      {product.reviews} đánh giá
                    </p>

                    {/* Rating Breakdown */}
                    <div className="mt-6 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-8">{star}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                              style={{
                                width: `${star === 5 ? 75 : star === 4 ? 15 : star === 3 ? 7 : star === 2 ? 2 : 1}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {star === 5 ? 256 : star === 4 ? 52 : star === 3 ? 24 : star === 2 ? 7 : 3}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Write Review */}
                  <div className="flex-1">
                    <h4 className="font-bold text-xl text-gray-900 mb-4">
                      Viết đánh giá của bạn
                    </h4>
                    <div className="bg-white border-2 border-cyan-200 rounded-2xl p-6">
                      <div className="mb-4">
                        <label className="block font-semibold text-gray-700 mb-2">
                          Đánh giá của bạn
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  star <= rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block font-semibold text-gray-700 mb-2">
                          Nhận xét của bạn
                        </label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full border-2 border-cyan-200 rounded-xl p-4 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 min-h-32"
                          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        ></textarea>
                      </div>

                      <button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all">
                        Gửi đánh giá
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  <h4 className="font-bold text-xl text-gray-900">
                    Đánh giá từ khách hàng
                  </h4>
                  {customerReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-cyan-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900">{review.name}</p>
                              {review.verified && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  Đã mua hàng
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {review.comment}
                      </p>

                      {review.images.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {review.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`Review ${i + 1}`}
                              className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 cursor-pointer hover:border-cyan-400 transition-colors"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 text-gray-600 hover:text-cyan-600 transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          Hữu ích ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))}
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
            {relatedProducts.map((relProduct) => (
              <div
                key={relProduct.id}
                className="bg-white border-2 border-cyan-100 rounded-2xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={relProduct.image}
                    alt={relProduct.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
                    {relProduct.name}
                  </h4>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(relProduct.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">
                      {relProduct.rating}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-cyan-600">
                    {formatPrice(relProduct.price)}
                  </p>
                </div>
              </div>
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
              src={product.images[selectedImage]}
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
            {selectedImage < product.images.length - 1 && (
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

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-40">
        <MessageCircle className="h-6 w-6" />
      </button>

     
     
    </div>
  )
}