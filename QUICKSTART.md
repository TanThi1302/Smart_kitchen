# ⚡ QUICKSTART - Chạy nhanh dự án

## 🎯 Tóm tắt nhanh

Dự án gồm 3 phần chính:
1. **Database** (PostgreSQL 16 - Docker)
2. **Backend** (Node.js/Express - Port 5000)
3. **Frontend** (React/Vite - Port 5173)

## 📋 Yêu cầu

- Node.js 18+ (đã cài)
- Docker Desktop (cần cài)
- npm hoặc yarn

## 🚀 Chạy trong 3 phút

### Terminal 1 - Database
```bash
# Từ thư mục gốc D:\malloca_clone
docker-compose up
```

### Terminal 2 - Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 3 - Frontend
```bash
cd frontend
npm install
npm run dev
```

## ✅ Kiểm tra

- Backend: http://localhost:5000/health
- Frontend: http://localhost:5173
- API Products: http://localhost:5000/api/products

## 📂 Files đã tạo sẵn

### Backend (HOÀN CHỈNH ✅)
```
backend/
├── src/
│   ├── config/database.js          ✅ Kết nối PostgreSQL
│   ├── controllers/                 ✅ 5 controllers
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── postController.js
│   │   └── contactController.js
│   ├── routes/index.js             ✅ Tất cả routes
│   └── server.js                   ✅ Express server
├── package.json                    ✅
└── .env                            ✅
```

### Database (HOÀN CHỈNH ✅)
```
database/
└── init.sql                        ✅ Schema + sample data
docker-compose.yml                  ✅
```

### Frontend (CẦN BỔ SUNG ⚠️)
```
frontend/
├── src/
│   ├── lib/utils.js               ✅ Utility functions
│   ├── services/api.js            ✅ API calls
│   ├── store/cartStore.js         ✅ Cart state management
│   ├── index.css                  ✅ Tailwind setup
│   ├── components/                ⚠️ CẦN TẠO
│   │   ├── layout/
│   │   │   ├── Layout.jsx        📝 Có trong SETUP_GUIDE
│   │   │   ├── Header.jsx        📝 Có trong SETUP_GUIDE
│   │   │   └── Footer.jsx        📝 Có trong SETUP_GUIDE
│   │   └── ui/                   ⚠️ Sẽ tạo bằng shadcn CLI
│   ├── pages/                     ⚠️ CẦN TẠO
│   │   ├── Home.jsx              📝 Có trong SETUP_GUIDE
│   │   ├── Products.jsx          ❌ Chưa có
│   │   ├── ProductDetail.jsx     ❌ Chưa có
│   │   ├── Cart.jsx              ❌ Chưa có
│   │   ├── Checkout.jsx          ❌ Chưa có
│   │   ├── Posts.jsx             ❌ Chưa có
│   │   ├── PostDetail.jsx        ❌ Chưa có
│   │   ├── About.jsx             ❌ Chưa có
│   │   ├── Contact.jsx           ❌ Chưa có
│   │   └── admin/                ❌ Chưa có
│   ├── App.jsx                   📝 Có trong SETUP_GUIDE
│   └── main.jsx                  📝 Có trong SETUP_GUIDE
├── index.html                    📝 Có trong SETUP_GUIDE
├── vite.config.js                ✅
├── tailwind.config.js            ✅
├── postcss.config.js             ✅
└── package.json                  ✅
```

## 📖 Hướng dẫn chi tiết

Đọc file **SETUP_GUIDE.md** để:
- Cài đặt ShadcnUI components
- Copy code cho các component còn thiếu
- Tạo đầy đủ các pages
- Troubleshooting

## 🎨 Tính năng đã implement (Backend)

### Products API
- ✅ GET /api/products - Danh sách sản phẩm (có filter, search, pagination)
- ✅ GET /api/products/featured - Sản phẩm nổi bật
- ✅ GET /api/products/:slug - Chi tiết sản phẩm
- ✅ POST/PUT/DELETE /api/admin/products/* - CRUD admin

### Categories API
- ✅ GET /api/categories - Danh sách danh mục
- ✅ GET /api/categories/:slug - Chi tiết danh mục

### Orders API
- ✅ POST /api/orders - Tạo đơn hàng
- ✅ GET /api/orders/:id - Chi tiết đơn hàng
- ✅ GET /api/admin/orders - Quản lý đơn hàng (admin)

### Posts API
- ✅ GET /api/posts - Danh sách bài viết
- ✅ GET /api/posts/:slug - Chi tiết bài viết
- ✅ POST/PUT/DELETE /api/admin/posts/* - CRUD admin

### Other APIs
- ✅ GET /api/promotions - Khuyến mãi
- ✅ GET /api/jobs - Tuyển dụng
- ✅ POST /api/contact - Liên hệ

## 🗄️ Database

PostgreSQL 16 với sample data:
- 5 categories (Bếp từ, Máy hút mùi, Chậu rửa, Lò nướng, Máy rửa bát)
- 5 products với hình ảnh placeholder
- 2 posts (tin tức)
- 2 promotions (khuyến mãi)
- 2 job postings (tuyển dụng)
- 1 admin user (admin@malloca.com / admin123)

## 🔥 Next Steps (Để hoàn thiện dự án)

1. **Chạy setup ShadcnUI** (5 phút)
   ```bash
   cd frontend
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add button card input label select dialog dropdown-menu toast badge table tabs
   ```

2. **Tạo các component cơ bản** (10 phút)
   - Copy code từ SETUP_GUIDE.md:
   - Layout.jsx, Header.jsx, Footer.jsx
   - App.jsx, main.jsx, index.html

3. **Tạo trang Home** (5 phút)
   - Copy Home.jsx từ SETUP_GUIDE.md

4. **Test chạy** (2 phút)
   - Chạy 3 terminals
   - Mở http://localhost:5173
   - Kiểm tra trang chủ hiển thị sản phẩm

5. **Tạo các pages còn lại** (1-2 giờ)
   - Products, ProductDetail, Cart, Checkout
   - Posts, PostDetail, About, Contact
   - Admin pages

6. **Responsive + Polish** (30 phút)
   - Thêm responsive breakpoints
   - Loading states
   - Error handling

## 💡 Tips

- Backend đã HOÀN CHỈNH, chỉ cần chạy `npm install` và `npm run dev`
- Database tự động init khi docker-compose up
- Frontend cần tạo thêm pages, nhưng infrastructure đã sẵn sàng
- ShadcnUI components sẽ tự động tạo folder `src/components/ui/`

## 🐛 Common Issues

**Docker không chạy?**
```bash
# Install Docker Desktop from docker.com
# Sau đó:
docker-compose up -d
```

**Port 5000 bị chiếm?**
```bash
# Thay đổi trong backend/.env
PORT=5001
```

**Frontend lỗi module?**
```bash
cd frontend
rm -rf node_modules
npm install
```

## 📞 Need Help?

1. Đọc **SETUP_GUIDE.md** - Hướng dẫn chi tiết từng bước
2. Đọc **README.md** - Tổng quan dự án, API endpoints, database schema
3. Check console logs trong browser (F12)
4. Check terminal logs của backend/frontend

---

**TL;DR**: Backend + Database DONE ✅. Frontend cần tạo thêm UI components và pages (có sẵn code mẫu trong SETUP_GUIDE.md)
