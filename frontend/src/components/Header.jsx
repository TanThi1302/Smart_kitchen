import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../services/api';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>📞 Hotline: 1800 1212</span>
            <span>✉️ info@smkitchen.com</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-secondary transition">Về chúng tôi</Link>
            <Link to="/contact" className="hover:text-secondary transition">Liên hệ</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Smart Kitchen</h1>
              <p className="text-xs text-gray-600">Smart Kitchen - Smart Life</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition">
              TRANG CHỦ
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary font-medium transition">
              SẢN PHẨM
            </Link>
            <Link to="/promotions" className="text-gray-700 hover:text-primary font-medium transition">
              KHUYẾN MÃI
            </Link>
            <Link to="/news" className="text-gray-700 hover:text-primary font-medium transition">
              TIN TỨC
            </Link>
            <Link to="/warranty" className="text-gray-700 hover:text-primary font-medium transition">
              BẢO HÀNH
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary font-medium transition">
              LIÊN HỆ
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="text-gray-700 hover:text-primary transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link to="/cart" className="relative text-gray-700 hover:text-primary transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-gray-700 hover:text-primary font-medium">TRANG CHỦ</Link>
              <Link to="/products" className="text-gray-700 hover:text-primary font-medium">SẢN PHẨM</Link>
              <Link to="/promotions" className="text-gray-700 hover:text-primary font-medium">KHUYẾN MÃI</Link>
              <Link to="/news" className="text-gray-700 hover:text-primary font-medium">TIN TỨC</Link>
              <Link to="/warranty" className="text-gray-700 hover:text-primary font-medium">BẢO HÀNH</Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary font-medium">LIÊN HỆ</Link>
            </div>
          </nav>
        )}
      </div>

      {/* Category Bar */}
      <div className="bg-gray-100 border-t">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-6 overflow-x-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="text-sm text-gray-700 hover:text-primary whitespace-nowrap font-medium transition"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;