import { Link } from 'react-router-dom'
import { ShoppingCart, Menu, Search, X, Utensils, ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useCartStore from '@/store/cartStore'
import { useState } from 'react'

export default function Header() {
  const itemCount = useCartStore((state) => state.getItemCount())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b sticky top-0 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <ChefHat className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Kitchen Store</h3>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Trang chủ
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Sản phẩm
            </Link>
            <Link to="/posts" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Tin tức
            </Link>
            <Link to="/promotion" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Khuyến mãi
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Giới thiệu
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Liên hệ
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sản phẩm
              </Link>
              <Link
                to="/posts"
                className="text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tin tức 
              </Link>
              <Link
                to="/promotion"
                className="text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Khuyến mãi
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Giới thiệu
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
