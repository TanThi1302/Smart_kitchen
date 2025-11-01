import { Link } from 'react-router-dom'
import { Facebook, Youtube, Mail, Utensils, Phone, MapPin, ChefHat } from 'lucide-react'


export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <ChefHat className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Kitchen Store</h3>
            </div>
            <p className="text-cyan-100 text-sm mb-4">
              Thiết bị nhà bếp cao cấp, chất lượng đảm bảo, giá cả hợp lý.
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

          <div>
            <h4 className="font-bold mb-4">Danh mục</h4>
            <ul className="space-y-2 text-sm text-cyan-100">
              <li className="hover:text-white cursor-pointer transition-colors">Dụng cụ nấu nướng</li>
              <li className="hover:text-white cursor-pointer transition-colors">Dao & thớt</li>
              <li className="hover:text-white cursor-pointer transition-colors">Thiết bị điện</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-cyan-100">
              <li className="hover:text-white cursor-pointer transition-colors">Chính sách đổi trả</li>
              <li className="hover:text-white cursor-pointer transition-colors">Hướng dẫn mua hàng</li>
              <li className="hover:text-white cursor-pointer transition-colors">Liên hệ</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-cyan-100">
              <li>Hotline: 1900-xxxx</li>
              <li>Email: support@kitchenstore.vn</li>
              <li>Giờ làm việc: 8:00 - 22:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cyan-500 mt-8 pt-8 text-center text-cyan-100 text-sm">
          © 2025 Kitchen Store. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
