import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI, promotionAPI } from '../services/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, promotionsRes] = await Promise.all([
        productAPI.getFeatured(),
        categoryAPI.getAll(),
        promotionAPI.getActive()
      ]);
      
      setFeaturedProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setPromotions(promotionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary to-blue-350 text-white">
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

      {/* Promotions Banner */}
      {promotions.length > 0 && (
        <section className="py-8 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-4 text-white">
              <span className="text-2xl">🎉</span>
              <div className="text-center">
                <h3 className="font-bold text-lg">{promotions[0].title}</h3>
                <p className="text-sm">{promotions[0].description}</p>
              </div>
              <Link 
                to="/promotions" 
                className="bg-white text-secondary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Xem ngay
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16">
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
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition group"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition">
                <img src={category.image} alt="" />
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-primary transition">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.product_count } sản phẩm
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Sản phẩm nổi bật</h2>
            <p className="text-gray-600">Những sản phẩm được khách hàng yêu thích nhất</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
                <Link to={`/product/${product.slug}`}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.images}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                    />
                    {product.sale_price && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{Math.round((1 - product.sale_price / product.price) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{product.category_name}</p>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      {product.sale_price ? (
                        <>
                          <span className="text-lg font-bold text-red-600">
                            {formatPrice(product.sale_price)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition">
                      Xem chi tiết
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              to="/products" 
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Tại sao chọn chúng tôi?</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Chất lượng đảm bảo</h3>
              <p className="text-gray-600">Sản phẩm chính hãng 100%</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Giao hàng miễn phí</h3>
              <p className="text-gray-600">Toàn quốc cho đơn từ 5 triệu</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Bảo hành dài hạn</h3>
              <p className="text-gray-600">Bảo hành chính hãng tới 10 năm</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">Tư vấn nhiệt tình, chuyên nghiệp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Cần tư vấn thêm?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a 
              href="tel:18001212" 
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center gap-2"
            >
              <span>📞</span> Gọi ngay: 1800 1212
            </a>
            <Link 
              to="/contact" 
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
            >
              Gửi yêu cầu tư vấn
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;