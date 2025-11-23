import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, FileText, Mail } from 'lucide-react'
import ProductsManagement from './ProductsManagement'
import OrdersManagement from './OrdersManagement'
import TestOrders from './TestOrders'
import PostsManagement from './PostsManagement'
import { adminGetStats } from '@/services/api'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    newOrders: 0,
    totalCustomers: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminGetStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Trang Quản Trị</h1>

      <div className="mb-8 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Lưu ý:</strong> Đây là trang quản trị demo. Click vào các card để quản lý.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products */}
        <Link to="/admin/products">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-6 w-6 text-blue-600" />
                Sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Quản lý danh sách sản phẩm: thêm, sửa, xóa
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Orders */}
        <Link to="/admin/orders">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-6 w-6 text-green-600" />
                Đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Quản lý đơn hàng và trạng thái giao hàng
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Posts */}
        <Link to="/admin/posts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-6 w-6 text-orange-600" />
                Bài viết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Quản lý tin tức và bài viết
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Contact */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-6 w-6 text-pink-600" />
              Tin nhắn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Quản lý tin nhắn liên hệ (Coming soon)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Thống kê tổng quan</h2>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Đang tải dữ liệu...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-2">Tổng sản phẩm</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-2">Đơn hàng mới</p>
                <p className="text-3xl font-bold text-green-600">{stats.newOrders}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-2">Khách hàng</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalCustomers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-2">Doanh thu tháng</p>
                <p className="text-3xl font-bold text-orange-600">
                  {formatCurrency(stats.monthlyRevenue)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Admin() {
  return (
    <div>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="test-orders" element={<TestOrders />} />
        <Route path="posts" element={<PostsManagement />} />
      </Routes>
    </div>
  )
}
