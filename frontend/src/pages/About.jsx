import { Card, CardContent } from '@/components/ui/card'
import { Shield, Award, Users, Truck } from 'lucide-react'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Về Kitchen Store</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Chúng tôi chuyên cung cấp thiết bị nhà bếp cao cấp, hiện đại với cam kết chất lượng và dịch vụ tốt nhất
        </p>
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div>
          <img
            src="https://placehold.co/600x400?text=Kitchen+Store"
            alt="Kitchen Store"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Câu chuyện của chúng tôi</h2>
          <p className="text-gray-700 mb-4">
            Kitchen Store được thành lập với sứ mệnh mang đến cho mọi gia đình Việt những thiết bị nhà bếp chất lượng cao,
            hiện đại và an toàn. Chúng tôi tin rằng một căn bếp tốt là nơi bắt đầu của những bữa ăn ngon và hạnh phúc gia đình.
          </p>
          <p className="text-gray-700 mb-4">
            Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi tự hào là đối tác tin cậy của hàng ngàn gia đình và
            nhà hàng trên toàn quốc. Chúng tôi cam kết mang đến sản phẩm chính hãng, giá cả hợp lý và dịch vụ hậu mãi tận tâm.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Giá trị cốt lõi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Chất lượng</h3>
              <p className="text-gray-600 text-sm">
                100% sản phẩm chính hãng, được kiểm tra kỹ lưỡng
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Uy tín</h3>
              <p className="text-gray-600 text-sm">
                Hơn 10 năm kinh nghiệm, được khách hàng tin tưởng
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Tận tâm</h3>
              <p className="text-gray-600 text-sm">
                Đội ngũ nhân viên chuyên nghiệp, tư vấn nhiệt tình
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Giao hàng nhanh</h3>
              <p className="text-gray-600 text-sm">
                Giao hàng toàn quốc, nhanh chóng và an toàn
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-5xl font-bold mb-2">10+</p>
            <p className="text-blue-100">Năm kinh nghiệm</p>
          </div>
          <div>
            <p className="text-5xl font-bold mb-2">5000+</p>
            <p className="text-blue-100">Khách hàng hài lòng</p>
          </div>
          <div>
            <p className="text-5xl font-bold mb-2">500+</p>
            <p className="text-blue-100">Sản phẩm chính hãng</p>
          </div>
          <div>
            <p className="text-5xl font-bold mb-2">50+</p>
            <p className="text-blue-100">Đối tác thương hiệu</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Bạn đã sẵn sàng nâng cấp nhà bếp?</h2>
        <p className="text-gray-600 mb-6">
          Khám phá bộ sưu tập sản phẩm của chúng tôi và tìm thiết bị phù hợp cho nhà bếp của bạn
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/products">
            <button className="bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors">
              Xem sản phẩm
            </button>
          </a>
          <a href="/contact">
            <button className="border border-primary text-primary px-8 py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors">
              Liên hệ tư vấn
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}
