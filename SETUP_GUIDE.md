# Hướng dẫn Setup và Hoàn thiện Dự án

## 📦 BƯỚC 1: Cài đặt Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install

# Cài đặt thêm dependency còn thiếu
npm install tailwindcss-animate
```

## 🗄️ BƯỚC 2: Khởi động Database

```bash
# Từ thư mục gốc
docker-compose up -d

# Kiểm tra
docker ps

# Xem logs nếu có lỗi
docker-compose logs -f
```

Database sẽ tự động:
- Tạo database `kitchen_ecommerce`
- Chạy schema từ `database/init.sql`
- Insert dữ liệu mẫu (5 sản phẩm, 2 bài viết, categories, etc.)

## 🚀 BƯỚC 3: Chạy Backend

```bash
cd backend
npm run dev
```

Kiểm tra: http://localhost:5000/health

## 🎨 BƯỚC 4: Setup ShadcnUI Components

```bash
cd frontend

# Initialize shadcn-ui
npx shadcn-ui@latest init

# Khi được hỏi, chọn:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Cài đặt components cần thiết
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
npx shadcn@latest add badge
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add separator
npx shadcn@latest add avatar
npx shadcn@latest add sheet
```

## 💻 BƯỚC 5: Tạo các file Frontend còn thiếu

### 5.1. Tạo `frontend/index.html`

```html
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kitchen Ecommerce - Thiết bị nhà bếp</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 5.2. Tạo `frontend/src/main.jsx`

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
```

### 5.3. Tạo `frontend/src/App.jsx`

```jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Posts from './pages/Posts'
import PostDetail from './pages/PostDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/admin/Admin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="posts" element={<Posts />} />
        <Route path="posts/:slug" element={<PostDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="admin/*" element={<Admin />} />
      </Route>
    </Routes>
  )
}

export default App
```

### 5.4. Tạo Layout Component

Tạo file `frontend/src/components/layout/Layout.jsx`:

```jsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

### 5.5. Tạo Header Component

Tạo file `frontend/src/components/layout/Header.jsx`:

```jsx
import { Link } from 'react-router-dom'
import { ShoppingCart, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useCartStore from '@/store/cartStore'

export default function Header() {
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            Kitchen Store
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
            <Link to="/posts" className="hover:text-primary">Tin tức</Link>
            <Link to="/about" className="hover:text-primary">Giới thiệu</Link>
            <Link to="/contact" className="hover:text-primary">Liên hệ</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
```

### 5.6. Tạo Footer Component

Tạo file `frontend/src/components/layout/Footer.jsx`:

```jsx
import { Link } from 'react-router-dom'
import { Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Kitchen Store</h3>
            <p className="text-sm mb-4">
              Chuyên cung cấp thiết bị nhà bếp cao cấp, hiện đại
            </p>
            <div className="flex space-x-3">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-primary" />
              <Youtube className="h-5 w-5 cursor-pointer hover:text-primary" />
              <Mail className="h-5 w-5 cursor-pointer hover:text-primary" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Sản phẩm</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-primary">Bếp từ</Link></li>
              <li><Link to="/products" className="hover:text-primary">Máy hút mùi</Link></li>
              <li><Link to="/products" className="hover:text-primary">Chậu rửa</Link></li>
              <li><Link to="/products" className="hover:text-primary">Lò nướng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary">Giới thiệu</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Liên hệ</Link></li>
              <li><Link to="/posts" className="hover:text-primary">Tin tức</Link></li>
              <li><Link to="/admin" className="hover:text-primary">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>1800 1212</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>info@kitchenstore.com</span>
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
```

### 5.7. Tạo Home Page

Tạo file `frontend/src/pages/Home.jsx`:

```jsx
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getFeaturedProducts, getPromotions } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import useCartStore from '@/store/cartStore'

export default function Home() {
  const { data: productsData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const res = await getFeaturedProducts()
      return res.data
    },
  })

  const { data: promotionsData } = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const res = await getPromotions()
      return res.data
    },
  })

  const addItem = useCartStore((state) => state.addItem)
  const products = productsData?.data || []
  const promotions = promotionsData?.data || []

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Thiết Bị Nhà Bếp Hiện Đại
          </h1>
          <p className="text-xl mb-8">Chất lượng cao - Giá cả hợp lý</p>
          <Link to="/products">
            <Button size="lg" variant="secondary">
              Xem Sản Phẩm
            </Button>
          </Link>
        </div>
      </section>

      {/* Promotions */}
      {promotions.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-6">Khuyến Mãi Hot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <Card key={promo.id} className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <Badge variant="destructive" className="mb-2">
                    Giảm {promo.discount_percent}%
                  </Badge>
                  <h3 className="font-bold text-lg mb-2">{promo.title}</h3>
                  <p className="text-sm text-gray-600">{promo.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Sản Phẩm Nổi Bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <Link to={`/products/${product.slug}`}>
                  <img
                    src={product.image_url || 'https://placehold.co/300x300'}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="space-y-1">
                    {product.sale_price && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </p>
                    )}
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(product.sale_price || product.price)}
                    </p>
                  </div>
                </Link>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => addItem(product)}
                >
                  Thêm vào giỏ
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
```

## 🔧 BƯỚC 6: Chạy Frontend

```bash
cd frontend
npm run dev
```

Truy cập: http://localhost:5173

## ✅ Kiểm tra

1. Database đang chạy: `docker ps`
2. Backend API: http://localhost:5000/health
3. Frontend: http://localhost:5173
4. Test API: http://localhost:5000/api/products

## 📝 CÁC FILE CÒN THIẾU CẦN TẠO

### Pages
- `frontend/src/pages/Products.jsx` - Danh sách sản phẩm
- `frontend/src/pages/ProductDetail.jsx` - Chi tiết sản phẩm
- `frontend/src/pages/Cart.jsx` - Giỏ hàng
- `frontend/src/pages/Checkout.jsx` - Thanh toán
- `frontend/src/pages/Posts.jsx` - Danh sách tin tức
- `frontend/src/pages/PostDetail.jsx` - Chi tiết tin tức
- `frontend/src/pages/About.jsx` - Giới thiệu
- `frontend/src/pages/Contact.jsx` - Liên hệ
- `frontend/src/pages/admin/Admin.jsx` - Trang admin

### Components
- Product cards, filters, search
- Forms (checkout, contact)
- Admin tables, forms

## 🎯 Checklist Hoàn thiện

- [ ] Database chạy thành công
- [ ] Backend API hoạt động
- [ ] Frontend hiển thị được trang chủ
- [ ] Tạo đầy đủ các pages còn lại
- [ ] Tạo responsive design
- [ ] Test chức năng giỏ hàng
- [ ] Test chức năng checkout
- [ ] Tạo trang admin hoàn chỉnh

## 🐛 Troubleshooting

### Lỗi "Cannot find module"
```bash
npm install
```

### Lỗi kết nối database
```bash
docker-compose down
docker-compose up -d
```

### Lỗi CORS
Kiểm tra `backend/src/server.js` đã config CORS với origin `http://localhost:5173`

### Port bị chiếm
Thay đổi port trong `.env` (backend) hoặc `vite.config.js` (frontend)

## 📚 Tài liệu tham khảo

- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [ShadcnUI](https://ui.shadcn.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/)
