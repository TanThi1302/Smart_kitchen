import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminGetOrders, adminUpdateOrderStatus, getOrderById } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function OrdersManagement() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: async () => {
      const res = await adminGetOrders({
        status: statusFilter || undefined,
        page: 1,
        limit: 20
      })
      return res.data
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => adminUpdateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders'])
      alert('Cập nhật trạng thái thành công!')
      if (selectedOrder) {
        fetchOrderDetail(selectedOrder.id)
      }
    },
    onError: () => {
      alert('Lỗi khi cập nhật trạng thái')
    }
  })

  const fetchOrderDetail = async (orderId) => {
    try {
      const res = await getOrderById(orderId)
      setSelectedOrder(res.data.data)
      setIsDetailOpen(true)
    } catch (err) {
      alert('Không thể tải chi tiết đơn hàng')
    }
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Lỗi</h3>
          <p>{error.message}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <p>Đang tải dữ liệu...</p>
      </div>
    )
  }

  const orders = ordersData?.data || []

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Quản lý Đơn hàng</h1>

      <div className="mb-4">
        <p className="text-gray-600">Tổng: {orders.length} đơn hàng</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SĐT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Chưa có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.total_amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipping' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      onClick={() => fetchOrderDetail(order.id)}
                      variant="outline"
                      size="sm"
                    >
                      Xem chi tiết
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog chi tiết đơn hàng */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Chi tiết đơn hàng #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Cập nhật trạng thái */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Trạng thái đơn hàng</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Hiện tại:</span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedOrder.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    selectedOrder.status === 'shipping' ? 'bg-purple-100 text-purple-800' :
                    selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedOrder.status === 'pending' ? 'Chờ xử lý' :
                     selectedOrder.status === 'confirmed' ? 'Đã xác nhận' :
                     selectedOrder.status === 'shipping' ? 'Đang giao' :
                     selectedOrder.status === 'delivered' ? 'Đã giao' :
                     'Đã hủy'}
                  </span>
                  <span className="text-sm text-gray-600 ml-4">Cập nhật:</span>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(status) => {
                      updateStatusMutation.mutate({ id: selectedOrder.id, status })
                    }}
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

              {/* Thông tin khách hàng */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Họ tên:</p>
                    <p className="font-medium">{selectedOrder.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-medium">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Số điện thoại:</p>
                    <p className="font-medium">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Địa chỉ:</p>
                    <p className="font-medium">{selectedOrder.address}</p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="col-span-2">
                      <p className="text-gray-600">Ghi chú:</p>
                      <p className="font-medium bg-yellow-50 p-2 rounded border border-yellow-200">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div>
                <h3 className="font-semibold mb-3">Sản phẩm đã đặt</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Sản phẩm</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Số lượng</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Đơn giá</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image_url || 'https://via.placeholder.com/50'}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <span className="text-sm">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-sm">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-sm">{item.price}</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold">{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-right font-bold">Tổng cộng:</td>
                        <td className="px-4 py-3 text-right font-bold text-lg text-blue-600">
                          {selectedOrder.total_amount}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
