import { Link } from 'react-router-dom'
import { Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Kitchen Store</h3>
            <p className="text-sm mb-4">
              Chuyên cung cấp thiết bị nhà bếp cao cấp, hiện đại với chất lượng tốt nhất
            </p>
            <div className="flex space-x-3">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold mb-4">Sản phẩm</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=bep-tu" className="hover:text-primary transition-colors">
                  Bếp từ
                </Link>
              </li>
              <li>
                <Link to="/products?category=may-hut-mui" className="hover:text-primary transition-colors">
                  Máy hút mùi
                </Link>
              </li>
              <li>
                <Link to="/products?category=chau-rua" className="hover:text-primary transition-colors">
                  Chậu rửa
                </Link>
              </li>
              <li>
                <Link to="/products?category=lo-nuong" className="hover:text-primary transition-colors">
                  Lò nướng
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/posts" className="hover:text-primary transition-colors">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary transition-colors">
                  Quản trị
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <a href="tel:18001212" className="hover:text-primary transition-colors">
                  1800 1212
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:info@kitchenstore.com" className="hover:text-primary transition-colors">
                  info@kitchenstore.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Kitchen Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
