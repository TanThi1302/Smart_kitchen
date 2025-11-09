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
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  brand VARCHAR(100),
  specifications JSONB,
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
  post_type VARCHAR(50),
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

-- Insert sample products (20 sản phẩm)
INSERT INTO products (name, slug, description, price, sale_price, stock, category_id, brand, is_featured) VALUES
('Bếp từ đôi Malloca MH-03IB', 'bep-tu-doi-malloca-mh-03ib', 'Bếp từ đôi công nghệ Đức, tiết kiệm điện 40%', 8500000, 7650000, 50, 1, 'Malloca', true),
('Bếp từ đơn Malloca MH-01I', 'bep-tu-don-malloca-mh-01i', 'Bếp từ đơn nhỏ gọn, phù hợp gia đình nhỏ', 4200000, 3780000, 80, 1, 'Malloca', false),
('Máy hút mùi Malloca MC-90IH', 'may-hut-mui-malloca-mc-90ih', 'Máy hút mùi áp tường công suất 900m3/h', 6800000, NULL, 35, 2, 'Malloca', true),
('Chậu rửa đôi Malloca MS-6402', 'chau-rua-doi-malloca-ms-6402', 'Chậu rửa inox 304 cao cấp 2 hộc', 3500000, 3150000, 60, 3, 'Malloca', false),
('Lò nướng âm Malloca MOV-60ES', 'lo-nuong-am-malloca-mov-60es', 'Lò nướng âm tủ 60L, 10 chức năng nướng', 12000000, NULL, 25, 4, 'Malloca', true),
('Bếp từ Bosch PIF-875N34E', 'bep-tu-bosch-pif-875n34e', 'Bếp từ Bosch series 8, cảm ứng và hẹn giờ thông minh', 14990000, 13500000, 30, 1, 'Bosch', true),
('Máy hút mùi Bosch DWB97JM60', 'may-hut-mui-bosch-dwb97jm60', 'Máy hút mùi kính cong, công suất 770m3/h', 12990000, 11900000, 20, 2, 'Bosch', true),
('Chậu rửa Blanco Metra 6 S-IF', 'chau-rua-blanco-metra-6-s-if', 'Chậu rửa Blanco đá nhân tạo, 2 hộc, kèm phụ kiện', 8990000, 8200000, 40, 3, 'Blanco', false),
('Lò nướng Bosch HBG634BB1B', 'lo-nuong-bosch-hbg634bb1b', 'Lò nướng Bosch 71L, 3D Hotair, màn hình TFT', 16890000, 15800000, 15, 4, 'Bosch', true),
('Bếp từ Teka IZ-7200FSC', 'bep-tu-teka-iz-7200fsc', 'Bếp từ Teka Tây Ban Nha, 4 vùng nấu, Bridge zone', 10900000, 9500000, 45, 1, 'Teka', false),
('Máy hút mùi Teka DHC-90-90', 'may-hut-mui-teka-dhc-90-90', 'Máy hút mùi đảo Teka, kính cong, công suất lớn', 12900000, NULL, 18, 2, 'Teka', false),
('Chậu rửa Teka BE-F 45.1', 'chau-rua-teka-be-f-45.1', 'Chậu rửa Teka inox cao cấp 1 hộc, bộ xả và phụ kiện kèm', 5990000, 5400000, 55, 3, 'Teka', false),
('Lò nướng Teka HLB 8400', 'lo-nuong-teka-hlb-8400', 'Lò nướng Teka 70L, nhiều chế độ nướng và vệ sinh pyrolytic', 14400000, 13000000, 22, 4, 'Teka', false),
('Bếp từ Hafele HC-I772B', 'bep-tu-hafele-hc-i772b', 'Bếp từ Hafele 2 vùng, công nghệ IQ-touch, thiết kế âm bàn', 12500000, 11000000, 28, 1, 'Hafele', false),
('Máy hút mùi Hafele H-N90D', 'may-hut-mui-hafele-h-n90d', 'Máy hút mùi âm tủ Hafele, LED và bộ lọc than hoạt tính', 9500000, 8800000, 35, 2, 'Hafele', false),
('Chậu rửa Hafele Zen-N45A', 'chau-rua-hafele-zen-n45a', 'Chậu rửa Hafele đá nhân tạo, kích thước 450mm', 6490000, 5900000, 50, 3, 'Hafele', false),
('Lò nướng Hafele HO-E60D', 'lo-nuong-hafele-ho-e60d', 'Lò nướng Hafele 60L, đa chức năng, kèm khay nướng mềm', 13500000, NULL, 12, 4, 'Hafele', false),
('Bếp điện từ Eurosun EU-TT650G', 'bep-dien-tu-eurosun-eu-tt650g', 'Bếp điện từ Eurosun 3 vùng nấu, mặt kính Schott', 7900000, 7250000, 38, 1, 'Eurosun', false),
('Máy hút mùi Eurosun EH-T2169B', 'may-hut-mui-eurosun-eh-t2169b', 'Máy hút mùi Eurosun kính thẳng, công suất 900m3/h', 6200000, 5700000, 60, 2, 'Eurosun', false),
('Chậu rửa Konox KN8540B', 'chau-rua-konox-kn8540b', 'Chậu rửa Konox inox 304, đáy chịu nhiệt cao', 4490000, 3990000, 70, 3, 'Konox', false);

-- Insert sample product images for those 20 products
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
(1, 'https://placehold.co/600x600/FF7F00/FFFFFF/png?text=Bếp+Từ+Đôi+Malloca+MH-03IB', true, 0),
(2, 'https://placehold.co/600x600/FF7F00/FFFFFF/png?text=Bếp+Từ+Đơn+Malloca+MH-01I', true, 0),
(3, 'https://placehold.co/600x600/FF7F00/FFFFFF/png?text=Máy+Hút+Mùi+Malloca+MC-90IH', true, 0),
(4, 'https://placehold.co/600x600/FF7F00/FFFFFF/png?text=Chậu+Rửa+Đôi+Malloca+MS-6402', true, 0),
(5, 'https://placehold.co/600x600/FF7F00/FFFFFF/png?text=Lò+Nướng+Âm+Malloca+MOV-60ES', true, 0),
(6, 'https://placehold.co/600x600/007700/FFFFFF/png?text=Bếp+Từ+Bosch+PIF-875N34E', true, 0),
(7, 'https://placehold.co/600x600/007700/FFFFFF/png?text=Máy+Hút+Mùi+Bosch+DWB97JM60', true, 0),
(8, 'https://placehold.co/600x600/007700/FFFFFF/png?text=Chậu+Rửa+Blanco+Metra+6+S-IF', true, 0),
(9, 'https://placehold.co/600x600/007700/FFFFFF/png?text=Lò+Nướng+Bosch+HBG634BB1B', true, 0),
(10, 'https://placehold.co/600x600/003366/FFFFFF/png?text=Bếp+Từ+Teka+IZ-7200FSC', true, 0),
(11, 'https://placehold.co/600x600/003366/FFFFFF/png?text=Máy+Hút+Mùi+Teka+DHC-90-90', true, 0),
(12, 'https://placehold.co/600x600/003366/FFFFFF/png?text=Chậu+Rửa+Teka+BE-F+45.1', true, 0),
(13, 'https://placehold.co/600x600/003366/FFFFFF/png?text=Lò+Nướng+Teka+HLB+8400', true, 0),
(14, 'https://placehold.co/600x600/990000/FFFFFF/png?text=Bếp+Từ+Hafele+HC-I772B', true, 0),
(15, 'https://placehold.co/600x600/990000/FFFFFF/png?text=Máy+Hút+Mùi+Hafele+H-N90D', true, 0),
(16, 'https://placehold.co/600x600/990000/FFFFFF/png?text=Chậu+Rửa+Hafele+Zen-N45A', true, 0),
(17, 'https://placehold.co/600x600/990000/FFFFFF/png?text=Lò+Nướng+Hafele+HO-E60D', true, 0),
(18, 'https://placehold.co/600x600/CC0000/FFFFFF/png?text=Bếp+Điện+Từ+Eurosun+EU-TT650G', true, 0),
(19, 'https://placehold.co/600x600/CC0000/FFFFFF/png?text=Máy+Hút+Mùi+Eurosun+EH-T2169B', true, 0),
(20, 'https://placehold.co/600x600/CC0000/FFFFFF/png?text=Chậu+Rửa+Konox+KN8540B', true, 0);


-- Insert sample promotions
INSERT INTO promotions (title, description, discount_percent, start_date, end_date, is_active) VALUES
('Khuyến mãi Tết 2025', 'Giảm giá 10-20% toàn bộ sản phẩm', 15.00, NOW(), NOW() + INTERVAL '30 days', true),
('Flash Sale Cuối Tuần', 'Giảm 25% các sản phẩm bếp từ', 25.00, NOW(), NOW() + INTERVAL '7 days', true);

-- Insert sample posts
INSERT INTO posts 
(title, slug, content, excerpt, thumbnail_url, category, author, post_type, is_published, published_at)
VALUES
(
  'Bếp từ thông minh – Giải pháp hiện đại cho căn bếp Việt',
  'bep-tu-thong-minh',
  'Bếp từ ngày càng trở thành lựa chọn phổ biến...',
  'Bếp từ ngày càng được ưa chuộng...',
  'https://placehold.co/600x600/0066CC/FFFFFF/png?text=Bep+Tu+Doi',
  'Bếp từ',
  'Admin',
  'tin-tuc',
  true,
  NOW()
),
(
  'Máy hút mùi – Giữ cho không gian bếp luôn trong lành',
  'may-hut-mui-hien-dai',
  'Máy hút mùi giúp loại bỏ khói, dầu mỡ...',
  'Giữ không gian bếp trong lành...',
  'https://placehold.co/600x600/0066CC/FFFFFF/png?text=May+Hut+Mui',
  'Máy hút mùi',
  'Admin',
  'tin-tuc',
  true,
  NOW()
),
(
  'Ưu đãi đặc biệt Malloca 2025 – Giảm đến 30%',
  'uu-dai-malloca-2025',
  'Chương trình khuyến mãi lớn nhất năm dành cho khách hàng Malloca...',
  'Giảm giá đến 30% cho các sản phẩm bếp và thiết bị nhà bếp cao cấp.',
  'https://placehold.co/600x600/FF6600/FFFFFF/png?text=Khuyen+Mai',
  'Khuyến mãi',
  'Admin',
  'khuyen-mai',
  true,
  NOW()
),
(
  'Malloca tại Vietbuild 2025 – Không gian bếp thông minh',
  'malloca-vietbuild-2025',
  'Malloca tham dự triển lãm Vietbuild 2025 với các sản phẩm công nghệ mới...',
  'Khám phá xu hướng bếp thông minh tại Vietbuild 2025.',
  'https://placehold.co/600x600/009900/FFFFFF/png?text=Su+Kien',
  'Sự kiện',
  'Admin',
  'su-kien',
  true,
  NOW()
),
(
  '5 mẹo giữ bếp luôn sạch sẽ',
  '5-meo-giu-bep-sach',
  'Cẩm nang giúp căn bếp của bạn luôn gọn gàng và sạch sẽ...',
  'Bí quyết giữ bếp sáng bóng mỗi ngày.',
  'https://placehold.co/600x600/0066FF/FFFFFF/png?text=Cam+Nang+Bep',
  'Cẩm nang bếp',
  'Admin',
  'cam-nang-bep',
  true,
  NOW()
);


-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@malloca.com', '$2a$10$xQYzN.ZvKqKvFT5qVLqVHeSQZqN8xJXGF8h3ZW3mxvZGFvqGvvUK6', 'Administrator', 'admin');

-- Insert sample job postings
INSERT INTO job_postings (title, department, location, description, requirements, is_active) VALUES
('Nhân viên kinh doanh', 'Kinh doanh', 'Hà Nội', 'Tìm kiếm nhân viên kinh doanh năng động', 'Kinh nghiệm 1 năm trở lên', true),
('Kỹ thuật viên bảo hành', 'Kỹ thuật', 'TP.HCM', 'Kỹ thuật viên sửa chữa thiết bị nhà bếp', 'Am hiểu về điện tử', true);
