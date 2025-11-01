const pool = require('../config/database');

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Lấy sản phẩm nổi bật
const getFeaturedProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE p.is_active = true AND p.is_featured = true
      ORDER BY p.created_at DESC
      LIMIT 8
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Lấy sản phẩm theo slug
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const productResult = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1 AND p.is_active = true
    `, [slug]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imagesResult = await pool.query(`
      SELECT image_url, is_primary, display_order
      FROM product_images
      WHERE product_id = $1
      ORDER BY display_order
    `, [productResult.rows[0].id]);

    const product = {
      ...productResult.rows[0],
      images: imagesResult.rows
    };

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Lấy sản phẩm theo danh mục
const getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE c.slug = $1 AND p.is_active = true
      ORDER BY p.created_at DESC
    `, [slug]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// QUAN TRỌNG: Phải có dòng này
module.exports = {
  getAllProducts,
  getFeaturedProducts,
  getProductBySlug,
  getProductsByCategory
};