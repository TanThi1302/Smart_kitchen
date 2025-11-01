import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminGetOrders, adminUpdateOrderStatus, getOrderById } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDate } from '@/lib/utils'
import { Eye, RefreshCw, Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react'

export default function OrdersManagement() {
  const queryClient = useQueryClient()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter, page],
    queryFn: async () => {
      const res = await adminGetOrders({ status: statusFilter || undefined, page, limit: 20 })
      return res.data
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => adminUpdateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders'])
      if (selectedOrder) {
        fetchOrderDetail(selectedOrder.id)
      }
    },
  })

  const orders = ordersData?.data || []
  const pagination = ordersData?.pagination || { page: 1, totalPages: 1 }

  const fetchOrderDetail = async (orderId) => {
    const res = await getOrderById(orderId)
    setSelectedOrder(res.data.data)
    setIsDetailOpen(true)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-800' },
      shipping: { label: 'Đang giao', className: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Đã giao', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-800' },
    }

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Đơn hàng</h1>
        <Button onClick={() => queryClient.invalidateQueries(['admin-orders'])} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tất cả</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('pending')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Chờ xử lý</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('confirmed')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Đã xác nhận</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'confirmed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('shipping')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Đang giao</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'shipping').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('delivered')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Đã giao</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-4">
        <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="shipping">Đang giao</SelectItem>
            <SelectItem value="delivered">Đã giao</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Mã ĐH</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Khách hàng</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Số điện thoại</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tổng tiền</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Ngày đặt</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      Không có đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm">#{order.id}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{order.full_name}</p>
                          <p className="text-sm text-gray-500">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{order.phone}</td>
                      <td className="px-4 py-3 font-semibold">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-3 text-sm">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchOrderDetail(order.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Trang trước
          </Button>
          <div className="flex items-center gap-2">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? 'default' : 'outline'}
                onClick={() => setPage(i + 1)}
                className="w-10"
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
          >
            Trang sau
          </Button>
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3">Thông tin khách hàng</h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
                  <p><strong>Họ tên:</strong> {selectedOrder.full_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.email}</p>
                  <p><strong>Số điện thoại:</strong> {selectedOrder.phone}</p>
                  <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                  {selectedOrder.notes && (
                    <p><strong>Ghi chú:</strong> {selectedOrder.notes}</p>
                  )}
                </div>
              </div>

              {/* Order Status */}
              <div>
                <h3 className="font-semibold mb-3">Trạng thái đơn hàng</h3>
                <div className="flex items-center gap-4">
                  {getStatusBadge(selectedOrder.status)}
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(status) =>
                      updateStatusMutation.mutate({ id: selectedOrder.id, status })
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                      <SelectItem value="shipping">Đang giao</SelectItem>
                      <SelectItem value="delivered">Đã giao</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Sản phẩm</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Sản phẩm</th>
                        <th className="px-4 py-2 text-center">Số lượng</th>
                        <th className="px-4 py-2 text-right">Đơn giá</th>
                        <th className="px-4 py-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image_url || 'https://placehold.co/50x50?text=P'}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <span>{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">{formatPrice(item.price)}</td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {formatPrice(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-semibold">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-right">Tổng cộng:</td>
                        <td className="px-4 py-3 text-right text-lg text-primary">
                          {formatPrice(selectedOrder.total_amount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-sm text-gray-600">
                <p>Ngày đặt: {formatDate(selectedOrder.created_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
