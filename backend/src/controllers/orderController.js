const db = require('../config/database');

// Create new order (checkout)
exports.createOrder = async (req, res) => {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const { full_name, email, phone, address, notes, items } = req.body;

    // Calculate total
    let total_amount = 0;
    for (const item of items) {
      const productQuery = 'SELECT price, sale_price FROM products WHERE id = $1';
      const productResult = await client.query(productQuery, [item.product_id]);

      if (productResult.rows.length === 0) {
        throw new Error(`Product with id ${item.product_id} not found`);
      }

      const product = productResult.rows[0];
      const price = product.sale_price || product.price;
      total_amount += price * item.quantity;
    }

    // Create order
    const orderQuery = `
      INSERT INTO orders (full_name, email, phone, address, notes, total_amount, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const orderValues = [full_name, email, phone, address, notes, total_amount, 'pending'];
    const orderResult = await client.query(orderQuery, orderValues);
    const order = orderResult.rows[0];

    // Create order items
    for (const item of items) {
      const productQuery = 'SELECT price, sale_price FROM products WHERE id = $1';
      const productResult = await client.query(productQuery, [item.product_id]);
      const product = productResult.rows[0];
      const price = product.sale_price || product.price;
      const itemTotal = price * item.quantity;

      const itemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price, total)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await client.query(itemQuery, [order.id, item.product_id, item.quantity, price, itemTotal]);

      // Update product stock
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
    }

    await client.query('COMMIT');

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  } finally {
    client.release();
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const orderQuery = 'SELECT * FROM orders WHERE id = $1';
    const orderResult = await db.query(orderQuery, [id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Get order items with product details
    const itemsQuery = `
      SELECT oi.*, p.name, p.slug,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `;
    const itemsResult = await db.query(itemsQuery, [id]);
    order.items = itemsResult.rows;

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM orders';
    const params = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM orders';
    const countParams = [];
    if (status) {
      countQuery += ' WHERE status = $1';
      countParams.push(status);
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
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const query = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
    const result = await db.query(query, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
