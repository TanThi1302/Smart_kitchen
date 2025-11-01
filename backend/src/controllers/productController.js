const db = require('../config/database');

// Get all products with pagination and filters
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sort = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, c.name as category_name,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;

    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND c.slug = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY p.${sort} ${order}`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = true';
    const countParams = [];
    if (category) {
      countQuery += ' AND c.slug = $1';
      countParams.push(category);
    }
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single product by slug
exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const productQuery = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1 AND p.is_active = true
    `;
    const productResult = await db.query(productQuery, [slug]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = productResult.rows[0];

    // Get product images
    const imagesQuery = 'SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order';
    const imagesResult = await db.query(imagesQuery, [product.id]);
    product.images = imagesResult.rows;

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const query = `
      SELECT p.*,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
      FROM products p
      WHERE p.is_featured = true AND p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT 8
    `;
    const result = await db.query(query);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, sale_price, stock, category_id, brand, specifications, is_featured } = req.body;

    const query = `
      INSERT INTO products (name, slug, description, price, sale_price, stock, category_id, brand, specifications, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [name, slug, description, price, sale_price || null, stock, category_id, brand, specifications, is_featured || false];
    const result = await db.query(query, values);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, price, sale_price, stock, category_id, brand, specifications, is_featured, is_active } = req.body;

    const query = `
      UPDATE products
      SET name = $1, slug = $2, description = $3, price = $4, sale_price = $5,
          stock = $6, category_id = $7, brand = $8, specifications = $9,
          is_featured = $10, is_active = $11, updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `;
    const values = [name, slug, description, price, sale_price, stock, category_id, brand, specifications, is_featured, is_active, id];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM products WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get product images
exports.getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;

    const query = 'SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order';
    const result = await db.query(query, [productId]);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching product images:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Add product image
exports.addProductImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const { image_url, is_primary = false, display_order = 0 } = req.body;

    // If setting as primary, unset other primary images
    if (is_primary) {
      await db.query('UPDATE product_images SET is_primary = false WHERE product_id = $1', [productId]);
    }

    const query = `
      INSERT INTO product_images (product_id, image_url, is_primary, display_order)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [productId, image_url, is_primary, display_order];
    const result = await db.query(query, values);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error adding product image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Update product image
exports.updateProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { image_url, is_primary, display_order } = req.body;

    // If setting as primary, unset other primary images for this product
    if (is_primary) {
      const productQuery = 'SELECT product_id FROM product_images WHERE id = $1';
      const productResult = await db.query(productQuery, [imageId]);
      if (productResult.rows.length > 0) {
        await db.query('UPDATE product_images SET is_primary = false WHERE product_id = $1', [productResult.rows[0].product_id]);
      }
    }

    const query = `
      UPDATE product_images
      SET image_url = $1, is_primary = $2, display_order = $3
      WHERE id = $4
      RETURNING *
    `;
    const values = [image_url, is_primary, display_order, imageId];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product image not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating product image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Delete product image
exports.deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const query = 'DELETE FROM product_images WHERE id = $1 RETURNING id';
    const result = await db.query(query, [imageId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product image not found' });
    }

    res.json({ success: true, message: 'Product image deleted successfully' });
  } catch (error) {
    console.error('Error deleting product image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
