const db = require('../config/database');

// Get all products with pagination and filters
exports.getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 12, category, search, brand, sort = 'created_at', order = 'DESC' } = req.query;


    if (sort === 'price-asc') {
      sort = 'price';
      order = 'ASC';
    } else if (sort === 'price-desc') {
      sort = 'price';
      order = 'DESC';
    }

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

    if (brand) {
      query += ` AND p.brand ILIKE $${paramIndex}`;
      params.push(`%${brand}%`);
      paramIndex++;
    }

    if (sort === 'price') {
      query += ` ORDER BY COALESCE(p.sale_price, p.price) ${order}`;
    } else {
      query += ` ORDER BY p.${sort} ${order}`;
    }
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    let countQuery = 'SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = true';
    const countParams = [];
    let countParamIndex = 1;
    if (category) {
      countQuery += ` AND c.slug = $${countParamIndex}`;
      countParams.push(category);
      countParamIndex++;
    }
    if (search) {
      countQuery += ` AND (p.name ILIKE $${countParamIndex} OR p.description ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }
    if (brand) {
      countQuery += ` AND p.brand ILIKE $${countParamIndex}`;
      countParams.push(`%${brand}%`);
      countParamIndex++;
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
    const { name, slug, description, price, sale_price, stock, category_id, brand, specifications, is_featured, is_active } = req.body;
    const imageUrl = req.body.image; 
    
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      let uniqueSlug = slug;
      let counter = 1;
      while (true) {
        const slugCheckQuery = 'SELECT id FROM products WHERE slug = $1';
        const slugCheckResult = await client.query(slugCheckQuery, [uniqueSlug]);
        if (slugCheckResult.rows.length === 0) {
          break;
        }
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }


      const productQuery = `
        INSERT INTO products (name, slug, description, price, sale_price, stock, category_id, brand, specifications, is_featured, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      const productValues = [name, uniqueSlug, description, price, sale_price || null, stock, category_id, brand, specifications, is_featured || false, is_active !== undefined ? is_active : true];
      const productResult = await client.query(productQuery, productValues);
      const product = productResult.rows[0];

      if (imageUrl) {
        await client.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES ($1, $2, $3, $4)',
          [product.id, imageUrl, true, 0]
        );
      }

      const finalProductQuery = `
        SELECT p.*,
               COALESCE(json_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), '[]') as images
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = $1
        GROUP BY p.id
      `;
      const finalResult = await client.query(finalProductQuery, [product.id]);

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product: finalResult.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
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

// Get related products by category
exports.getRelatedProducts = async (req, res) => {
  try {
    const { slug } = req.params;

    const productQuery = 'SELECT category_id FROM products WHERE slug = $1 AND is_active = true';
    const productResult = await db.query(productQuery, [slug]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const categoryId = productResult.rows[0].category_id;

    const relatedQuery = `
      SELECT p.*,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
      FROM products p
      WHERE p.category_id = $1 AND p.slug != $2 AND p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT 4
    `;
    const relatedResult = await db.query(relatedQuery, [categoryId, slug]);

    res.json({ success: true, data: relatedResult.rows });
  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get product suggestions based on keywords and category
exports.getProductSuggestions = async (req, res) => {
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
    const productName = product.name.toLowerCase();
    const categoryName = (product.category_name || '').toLowerCase();

    const suggestionConfigs = [
      {
        keywords: ['bếp từ', 'bep tu', 'hob', 'đôi', 'don'],
        title: 'Một số loại bếp từ khác',
        description: 'Tối ưu trải nghiệm nấu nướng với dụng cụ đồng bộ.',
        categorySlugs: ['bep-tu']
      },
    ];

    let matchedConfig = null;
    for (const config of suggestionConfigs) {
      const hasKeywordMatch = config.keywords.some(keyword =>
        productName.includes(keyword) || categoryName.includes(keyword)
      );
      if (hasKeywordMatch) {
        matchedConfig = config;
        break;
      }
    }

    if (!matchedConfig) {
      matchedConfig = {
        title: 'Gợi ý nâng cấp gian bếp',
        description: 'Những món đồ nhỏ xinh giúp hoàn thiện trải nghiệm sử dụng.',
        categorySlugs: []
      };
    }

    let suggestionsQuery;
    let suggestionsParams;

    if (matchedConfig.categorySlugs.length > 0) {
      const categoryPlaceholders = matchedConfig.categorySlugs.map((_, index) => `$${index + 2}`).join(', ');
      suggestionsQuery = `
        SELECT p.*,
               (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE c.slug IN (${categoryPlaceholders}) AND p.slug != $1 AND p.is_active = true
        ORDER BY p.created_at DESC
        LIMIT 3
      `;
      suggestionsParams = [slug, ...matchedConfig.categorySlugs];
    } else {
      suggestionsQuery = `
        SELECT p.*,
               (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
        FROM products p
        WHERE p.is_featured = true AND p.slug != $1 AND p.is_active = true
        ORDER BY RANDOM()
        LIMIT 3
      `;
      suggestionsParams = [slug];
    }

    const suggestionsResult = await db.query(suggestionsQuery, suggestionsParams);

    const suggestions = suggestionsResult.rows.map(product => ({
      name: product.name,
      price: Number(product.price),
      image: product.image_url || 'https://placehold.co/400x400?text=Product',
      slug: product.slug
    }));

    res.json({
      success: true,
      data: {
        title: matchedConfig.title,
        description: matchedConfig.description,
        items: suggestions
      }
    });
  } catch (error) {
    console.error('Error fetching product suggestions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create new product with images
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      sale_price,
      stock,
      category_id,
      brand,
      is_featured,
      is_active
    } = req.body;


    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');


      const baseSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      let uniqueSlug = baseSlug;
      let counter = 1;
      while (true) {
        const slugCheckQuery = 'SELECT id FROM products WHERE slug = $1';
        const slugCheckResult = await client.query(slugCheckQuery, [uniqueSlug]);
        if (slugCheckResult.rows.length === 0) {
          break; 
        }
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      const productQuery = `
        INSERT INTO products (name, slug, description, price, sale_price, stock, category_id, brand, is_featured, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `;
      const productValues = [
        name,
        uniqueSlug,
        description,
        price,
        sale_price || null,
        stock,
        category_id,
        brand || null,
        is_featured || false,
        is_active !== undefined ? is_active : true
      ];

      const productResult = await client.query(productQuery, productValues);
      const productId = productResult.rows[0].id;

      if (req.files && req.files.length > 0) {
        const imageQueries = req.files.map((file, index) => {
          const imageUrl = file.path; 
          return client.query(
            'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES ($1, $2, $3, $4)',
            [productId, imageUrl, index === 0, index]
          );
        });

        await Promise.all(imageQueries);
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { id: productId }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get unique brands
exports.getBrands = async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT brand
      FROM products
      WHERE brand IS NOT NULL AND brand != '' AND is_active = true
      ORDER BY brand
    `;
    const result = await db.query(query);

    res.json({
      success: true,
      data: result.rows.map(row => row.brand)
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Welcome endpoint with logging
exports.welcome = async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Welcome endpoint accessed`);

    res.json({
      success: true,
      message: 'Welcome to the Smart Kitchen API!',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Error in welcome endpoint:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
