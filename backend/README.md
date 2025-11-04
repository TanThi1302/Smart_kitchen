# Smart Kitchen Backend

Backend API cho website thương mại điện tử thiết bị nhà bếp.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Sao chép file môi trường:
```bash
cp .env.example .env
```

3. Cập nhật các biến môi trường trong `.env`:
- `DATABASE_URL`: URL kết nối PostgreSQL
- `API_KEY`: API key cho seeding script (nếu cần)

## Chạy ứng dụng

### Development:
```bash
npm run dev
```

### Production:
```bash
npm start
```



## API Endpoints

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:slug` - Lấy chi tiết sản phẩm
- `POST /api/admin/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/admin/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/admin/products/:id` - Xóa sản phẩm (Admin)

### Categories
- `GET /api/categories` - Lấy danh sách danh mục

## Database Schema

### products
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- slug (VARCHAR UNIQUE)
- description (TEXT)
- price (DECIMAL)
- sale_price (DECIMAL)
- stock (INTEGER)
- category_id (INTEGER)
- brand (VARCHAR)
- specifications (JSONB)
- is_featured (BOOLEAN)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### categories
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- slug (VARCHAR UNIQUE)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### product_images
- id (SERIAL PRIMARY KEY)
- product_id (INTEGER)
- image_url (VARCHAR)
- is_primary (BOOLEAN)
- display_order (INTEGER)
- created_at (TIMESTAMP)
