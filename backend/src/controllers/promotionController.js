const db = require('../config/database');

// Get active promotions
exports.getActivePromotions = async (req, res) => {
  try {
    const query = `
      SELECT * FROM promotions
      WHERE is_active = true
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
      ORDER BY created_at DESC
    `;
    const result = await db.query(query);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Get all promotions
exports.getAllPromotions = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const query = 'SELECT * FROM promotions ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await db.query(query, [limit, offset]);

    const countResult = await db.query('SELECT COUNT(*) FROM promotions');
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
    console.error('Error fetching promotions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Create promotion
exports.createPromotion = async (req, res) => {
  try {
    const { title, description, discount_percent, discount_amount, start_date, end_date, is_active } = req.body;

    const query = `
      INSERT INTO promotions (title, description, discount_percent, discount_amount, start_date, end_date, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [title, description, discount_percent, discount_amount, start_date, end_date, is_active];
    const result = await db.query(query, values);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Update promotion
exports.updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, discount_percent, discount_amount, start_date, end_date, is_active } = req.body;

    const query = `
      UPDATE promotions
      SET title = $1, description = $2, discount_percent = $3, discount_amount = $4,
          start_date = $5, end_date = $6, is_active = $7
      WHERE id = $8
      RETURNING *
    `;
    const values = [title, description, discount_percent, discount_amount, start_date, end_date, is_active, id];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating promotion:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Delete promotion
exports.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM promotions WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }

    res.json({ success: true, message: 'Promotion deleted successfully' });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
