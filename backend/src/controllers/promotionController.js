const pool = require('../config/database');

// Lấy các khuyến mãi đang hoạt động
const getActivePromotions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM promotions
      WHERE is_active = true 
        AND start_date <= NOW() 
        AND end_date >= NOW()
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getActivePromotions
};