import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createOrder } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'
import useCartStore from '@/store/cartStore'
import { CheckCircle } from 'lucide-react'

export default function Checkout() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const clearCart = useCartStore((state) => state.clearCart)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  })

  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const total = getTotal()

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await createOrder(data)
      return res.data
    },
    onSuccess: (data) => {
      setOrderId(data.data.id)
      setOrderSuccess(true)
      clearCart()
    },
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const orderData = {
      ...formData,
      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    }

    mutation.mutate(orderData)
  }

  if (items.length === 0 && !orderSuccess) {
    navigate('/cart')
    return null
  }

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-12 pb-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h2>
            <p className="text-gray-600 mb-2">
              Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là:
            </p>
            <p className="text-2xl font-bold text-primary mb-6">#{orderId}</p>
            <p className="text-gray-600 mb-8">
              Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/')}>Về trang chủ</Button>
              <Button variant="outline" onClick={() => navigate('/products')}>
                Tiếp tục mua sắm
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Họ và tên *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123456789"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Địa chỉ giao hàng *</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Ghi chú</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Ghi chú về đơn hàng, ví dụ: giao hàng giờ hành chính..."
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Đây là trang thanh toán demo. Không có giao dịch thật sự xảy ra.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="line-clamp-1 flex-1">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold ml-2">
                        {formatPrice((item.sale_price || item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Tổng cộng:</span>
                  <span className="text-primary text-2xl">{formatPrice(total)}</span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Đang xử lý...' : 'Đặt hàng'}
                </Button>

                {mutation.isError && (
                  <p className="text-red-500 text-sm mt-3 text-center">
                    Có lỗi xảy ra. Vui lòng thử lại.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
