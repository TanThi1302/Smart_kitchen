# Kitchen E-commerce Website - Malloca Clone

Website thương mại điện tử bán thiết bị nhà bếp, xây dựng bằng React, Node.js, và PostgreSQL 16.

## 📋 Tổng quan dự án

### Công nghệ sử dụng

- **Frontend**: React 18 + Vite + ShadcnUI + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL 16 (Docker)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Routing**: React Router v6

### Các trang chức năng

1. ✅ **Trang chủ** - Banner, danh mục nổi bật, sản phẩm featured
2. ✅ **Trang sản phẩm** - Danh sách, bộ lọc, tìm kiếm, phân trang
3. ✅ **Chi tiết sản phẩm** - Thông tin chi tiết, hình ảnh, thông số kỹ thuật
4. ✅ **Giỏ hàng** - Thêm/xóa sản phẩm, tính tổng tiền
5. ✅ **Thanh toán** - Form đặt hàng demo (không thanh toán thật)
6. ✅ **Tin tức** - Danh sách bài viết, chi tiết bài viết
7. ✅ **Giới thiệu & Khuyến mãi** - Thông tin công ty, chương trình ưu đãi
8. ✅ **Liên hệ & Tuyển dụng** - Form liên hệ, danh sách vị trí tuyển dụng
9. ✅ **Admin CMS** - Quản lý sản phẩm, bài viết, đơn hàng

## 🚀 Quickstart - Chạy dự án trong 2 phút

### Yêu cầu

- Node.js 18+ ([Download](https://nodejs.org/))
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop/))
- Git ([Download](https://git-scm.com/))

### Các bước thực hiện

**1. Clone repository**

```bash
git clone https://github.com/TanThi1302/Smart_kitchen.git
cd Smart_kitchen
git checkout product-admin
```

**2. Cài đặt dependencies**

```bash
npm run install:all
```

**3. Tạo file cấu hình môi trường**

```bash
# Windows (PowerShell)
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env

# Linux/Mac
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**4. Khởi động database**

```bash
docker-compose up -d
```

**5. Chạy ứng dụng**

```bash
npm run dev
```

**6. Mở trình duyệt**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

✅ **Done!** Ứng dụng đã sẵn sàng!

---

## 📝 Hướng dẫn chi tiết

### Cấu hình Database

Database sẽ tự động khởi tạo với:

- **Database**: `kitchen_ecommerce`
- **Username**: `admin`
- **Password**: `admin123`
- **Port**: `5432`
- **Schema & Sample Data**: Tự động load từ `database/init.sql`

```bash
# Kiểm tra container đang chạy
docker ps

# Xem logs database
docker-compose logs -f postgres

# Dừng database
docker-compose down

# Reset database (xóa data và tạo lại)
docker-compose down -v
docker-compose up -d
```

### Các lệnh Development

```bash
# Chạy Backend + Frontend cùng lúc
npm run dev

# Chạy riêng Backend
npm run dev:backend

# Chạy riêng Frontend
npm run dev:frontend

# Build production
npm run build

# Preview production build
npm run start:frontend
```

## 📁 Cấu trúc dự án

```
kitchen-ecommerce/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Kết nối PostgreSQL
│   │   ├── controllers/
│   │   │   ├── productController.js # CRUD sản phẩm
│   │   │   ├── categoryController.js
│   │   │   ├── orderController.js
│   │   │   ├── postController.js
│   │   │   └── contactController.js
│   │   ├── routes/
│   │   │   └── index.js            # API routes
│   │   └── server.js               # Entry point
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # ShadcnUI components
│   │   │   ├── layout/             # Header, Footer, Nav
│   │   │   └── product/            # Product components
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Posts.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── admin/
│   │   ├── services/               # API calls
│   │   ├── store/                  # Zustand store
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── database/
│   └── init.sql                    # Database schema + sample data
└── docker-compose.yml              # PostgreSQL container
```

## 🗄️ Database Schema

### Các bảng chính:

- **categories** - Danh mục sản phẩm
- **products** - Sản phẩm (name, price, stock, specifications...)
- **product_images** - Hình ảnh sản phẩm
- **orders** - Đơn hàng
- **order_items** - Chi tiết đơn hàng
- **posts** - Bài viết/Tin tức
- **promotions** - Chương trình khuyến mãi
- **users** - Người dùng
- **contact_messages** - Tin nhắn liên hệ
- **job_postings** - Vị trí tuyển dụng

## 🔌 API Endpoints

### Products

- `GET /api/products` - Lấy danh sách sản phẩm (có pagination, filter, search)
- `GET /api/products/featured` - Lấy sản phẩm nổi bật
- `GET /api/products/:slug` - Chi tiết sản phẩm
- `POST /api/admin/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/admin/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/admin/products/:id` - Xóa sản phẩm (Admin)

### Categories

- `GET /api/categories` - Lấy tất cả danh mục
- `GET /api/categories/:slug` - Chi tiết danh mục

### Orders

- `POST /api/orders` - Tạo đơn hàng mới (Checkout)
- `GET /api/orders/:id` - Chi tiết đơn hàng
- `GET /api/admin/orders` - Lấy tất cả đơn hàng (Admin)
- `PUT /api/admin/orders/:id/status` - Cập nhật trạng thái đơn hàng (Admin)

### Posts (News)

- `GET /api/posts` - Lấy danh sách bài viết
- `GET /api/posts/:slug` - Chi tiết bài viết
- `POST /api/admin/posts` - Tạo bài viết mới (Admin)
- `PUT /api/admin/posts/:id` - Cập nhật bài viết (Admin)
- `DELETE /api/admin/posts/:id` - Xóa bài viết (Admin)

### Other

- `GET /api/promotions` - Lấy danh sách khuyến mãi
- `GET /api/jobs` - Lấy danh sách tuyển dụng
- `POST /api/contact` - Gửi tin nhắn liên hệ
- `GET /api/admin/contact-messages` - Lấy tất cả tin nhắn (Admin)

## 🎨 Tham khảo UI/UX từ malloca.com

Website đã được thiết kế dựa trên:

- Giao diện hiện đại, clean
- Màu chủ đạo: Xanh dương (#0066CC)
- Layout responsive cho mobile
- Menu navigation rõ ràng
- Product grid với hình ảnh lớn
- Chi tiết sản phẩm với specifications
- Call-to-action buttons nổi bật

## 📱 Responsive Design

- **Desktop**: Full layout với sidebar, nhiều cột
- **Tablet**: 2 cột grid, menu collapse
- **Mobile**: 1 cột, bottom navigation, hamburger menu

## 🔐 Tài khoản Admin mẫu

- Email: `admin@malloca.com`
- Password: `admin123`

## 🛠️ Development Tips

### Chạy tất cả services cùng lúc:

```bash
# Terminal 1: Database
docker-compose up

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Frontend
cd frontend && npm run dev
```

### Kiểm tra database:

```bash
# Connect vào PostgreSQL
docker exec -it kitchen_ecommerce_db psql -U admin -d kitchen_ecommerce

# Xem tables
\dt

# Xem data
SELECT * FROM products;
```

### Build Production:

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## 📝 TODO - Các tính năng cần hoàn thiện

### Frontend (Cần tạo thêm các file component):

1. **Layout Components**

   - `src/components/layout/Header.jsx`
   - `src/components/layout/Footer.jsx`
   - `src/components/layout/Navigation.jsx`

2. **Pages**

   - `src/pages/Home.jsx`
   - `src/pages/Products.jsx`
   - `src/pages/ProductDetail.jsx`
   - `src/pages/Cart.jsx`
   - `src/pages/Checkout.jsx`
   - `src/pages/Posts.jsx`
   - `src/pages/PostDetail.jsx`
   - `src/pages/About.jsx`
   - `src/pages/Contact.jsx`
   - `src/pages/admin/*`

3. **Services & Store**

   - `src/services/api.js`
   - `src/store/cartStore.js`
   - `src/utils/helpers.js`

4. **Main Files**
   - `src/App.jsx`
   - `src/main.jsx`
   - `index.html`

### Backend (Đã hoàn thành):

- ✅ Database schema
- ✅ All controllers
- ✅ Routes
- ✅ Server setup

### Tính năng bổ sung (Optional):

- [ ] Authentication với JWT
- [ ] Upload hình ảnh real
- [ ] Email notification
- [ ] Payment gateway integration
- [ ] Advanced search với Elasticsearch
- [ ] Product reviews
- [ ] Wishlist
- [ ] Product comparison

## 🐛 Xử lý lỗi thường gặp

### ❌ Docker không chạy?

```bash
# 1. Cài Docker Desktop từ docker.com
# 2. Mở Docker Desktop và đợi nó khởi động
# 3. Chạy lại:
docker-compose up -d

# Kiểm tra Docker:
docker --version
docker ps
```

### ❌ Lỗi kết nối database

```bash
# Kiểm tra container đang chạy
docker ps

# Restart container
docker-compose down
docker-compose up -d

# Xem logs
docker-compose logs -f postgres

# Reset database (xóa data và tạo lại)
docker-compose down -v
docker-compose up -d
```

### ❌ Port 5000 hoặc 5173 bị chiếm

```bash
# Backend - Tạo file backend/.env
PORT=5001

# Frontend - Thay đổi trong frontend/vite.config.js
server: {
  port: 5174
}

# PostgreSQL - Thay đổi trong docker-compose.yml
ports:
  - "5433:5432"
```

### ❌ "Cannot find module" hoặc lỗi dependencies

```bash
# Xóa và cài lại
rm -rf node_modules package-lock.json
npm install

cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### ❌ Git clone failed (SSH key)

```bash
# Nếu clone bằng SSH không được, dùng HTTPS:
git clone https://github.com/TanThi1302/Smart_kitchen.git
```

### ❌ Lỗi CORS

- Kiểm tra `backend/src/server.js` đã config CORS đúng origin
- Frontend URL mặc định: `http://localhost:5173`
- Backend CORS đã được config cho `http://localhost:5173`

## 📞 Hỗ trợ & Tài nguyên

### Debug

- Check console logs trong browser (F12)
- Check terminal logs của backend/frontend
- Xem logs database: `docker-compose logs -f`

### Tài liệu tham khảo

- **SETUP_GUIDE.md** - Hướng dẫn chi tiết từng bước
- **TEST_ADMIN.md** - Hướng dẫn test chức năng Admin
- React: https://react.dev
- Vite: https://vitejs.dev
- ShadcnUI: https://ui.shadcn.com
- TailwindCSS: https://tailwindcss.com

## 📄 License

MIT License - Dự án học tập

---

**Lưu ý**: Đây là dự án demo, không nên sử dụng trực tiếp trong production mà không có security hardening.
