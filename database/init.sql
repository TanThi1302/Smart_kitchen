-- Kitchen E-commerce Database Schema
-- PostgreSQL 16

-- Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  description_basic TEXT,
  description_highlights TEXT,
  bonus_gift TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  brand VARCHAR(100),
  specifications JSONB,
  colors JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Product Images Table
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Promotions Table
CREATE TABLE promotions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_percent DECIMAL(5,2),
  discount_amount DECIMAL(10,2),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts (News/Blog) Table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  thumbnail_url VARCHAR(500),
  category VARCHAR(100),
  author VARCHAR(255),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL
);

-- Job Postings Table
CREATE TABLE job_postings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  location VARCHAR(255),
  description TEXT,
  requirements TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contact Messages Table
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(is_published);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Insert sample data for categories
INSERT INTO categories (name, slug, description) VALUES
('Bếp từ', 'bep-tu', 'Các loại bếp từ hiện đại, tiết kiệm điện'),
('Máy hút mùi', 'may-hut-mui', 'Máy hút mùi công nghệ cao, khử mùi hiệu quả'),
('Chậu rửa', 'chau-rua', 'Chậu rửa inox cao cấp, bền đẹp'),
('Lò nướng', 'lo-nuong', 'Lò nướng đa năng, nướng bánh chuyên nghiệp'),
('Máy rửa bát', 'may-rua-bat', 'Máy rửa bát tự động, tiện lợi');

-- Insert sample products
INSERT INTO products (name, slug, description, price, sale_price, stock, category_id, brand, is_featured) VALUES
('Bếp từ đôi Malloca MH-03IB', 'bep-tu-doi-malloca-mh-03ib', 'Bếp từ đôi công nghệ Đức, tiết kiệm điện 40%', 8500000, 7650000, 50, 1, 'Malloca', true),
('Bếp từ đơn Malloca MH-01I', 'bep-tu-don-malloca-mh-01i', 'Bếp từ đơn nhỏ gọn, phù hợp gia đình nhỏ', 4200000, 3780000, 80, 1, 'Malloca', false),
('Máy hút mùi Malloca MC-90IH', 'may-hut-mui-malloca-mc-90ih', 'Máy hút mùi áp tường công suất 900m3/h', 6800000, NULL, 35, 2, 'Malloca', true),
('Chậu rửa đôi Malloca MS-6402', 'chau-rua-doi-malloca-ms-6402', 'Chậu rửa inox 304 cao cấp 2 hộc', 3500000, 3150000, 60, 3, 'Malloca', false),
('Lò nướng âm Malloca MOV-60ES', 'lo-nuong-am-malloca-mov-60es', 'Lò nướng âm tủ 60L, 10 chức năng nướng', 12000000, NULL, 25, 4, 'Malloca', true);

-- Insert sample product images
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
(1, 'https://m.media-amazon.com/images/I/81tUeVaBX1L._AC_SX679_.jpg', true, 0),
(2, 'https://m.media-amazon.com/images/I/81DpE03AdAL._AC_SX679_.jpg', true, 0),
(3, 'https://m.media-amazon.com/images/I/61OB2hCikTL._AC_SX679_.jpg', true, 0),
(4, 'https://images.unsplash.com/photo-1621953884578-02a3ddb96f46?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1742', true, 0),
(5, 'https://m.media-amazon.com/images/I/71NntrH1zgL._SX522_.jpg', true, 0);

-- Insert sample promotions
IINSERT INTO promotions (title, description, discount_percent, discount_amount, start_date, end_date, is_active) VALUES
('Khuyến mãi Tết 2025', 'Giảm giá 10-20% toàn bộ sản phẩm', 15.00, NULL, NOW(), NOW() + INTERVAL '30 days', true),
('Flash Sale Cuối Tuần', 'Giảm 25% các sản phẩm bếp từ', 25.00, NULL, NOW(), NOW() + INTERVAL '7 days', true),
('Ưu đãi khai trương showroom Đà Nẵng', 'Ưu đãi 20% phí thiết kế và combo thiết bị khi khai trương showroom mới', 20.00, NULL, NOW() + INTERVAL '5 days', NOW() + INTERVAL '25 days', true),
('Voucher thiết bị gia đình', 'Tặng ngay 3.000.000đ khi hoàn tất bản vẽ bếp trong tháng này', NULL, 3000000, NOW(), NOW() + INTERVAL '40 days', true);

-- Insert sample posts
INSERT INTO posts (title, slug, content, excerpt, category, author, is_published, published_at) VALUES
('Cách chọn bếp từ phù hợp cho gia đình', 'cach-chon-bep-tu-phu-hop', 'Nội dung chi tiết về cách chọn bếp từ...', 'Hướng dẫn chi tiết giúp bạn chọn bếp từ phù hợp', 'Hướng dẫn', 'Admin', true, NOW()),
('Top 5 máy hút mùi bán chạy 2025', 'top-5-may-hut-mui-ban-chay-2025', 'Danh sách 5 máy hút mùi được yêu thích nhất...', 'Tổng hợp những máy hút mùi được khách hàng tin dùng', 'Tin tức', 'Admin', true, NOW());

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@malloca.com', '$2a$10$xQYzN.ZvKqKvFT5qVLqVHeSQZqN8xJXGF8h3ZW3mxvZGFvqGvvUK6', 'Administrator', 'admin');

-- Insert sample job postings
INSERT INTO job_postings (title, department, location, description, requirements, is_active) VALUES
('Nhân viên kinh doanh', 'Kinh doanh', 'Hà Nội', 'Tìm kiếm nhân viên kinh doanh năng động', 'Kinh nghiệm 1 năm trở lên', true),
('Kỹ thuật viên bảo hành', 'Kỹ thuật', 'TP.HCM', 'Kỹ thuật viên sửa chữa thiết bị nhà bếp', 'Am hiểu về điện tử', true);
