const db = require('../config/database');

// Submit contact message
exports.createContactMessage = async (req, res) => {
  try {
    const { full_name, email, phone, subject, message } = req.body;

    const query = `
      INSERT INTO contact_messages (full_name, email, phone, subject, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [full_name, email, phone || null, subject || null, message];
    const result = await db.query(query, values);

    res.status(201).json({ success: true, data: result.rows[0], message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get job postings
exports.getJobPostings = async (req, res) => {
  try {
    const query = `
      SELECT * FROM job_postings
      WHERE is_active = true
      ORDER BY created_at DESC
    `;
    const result = await db.query(query);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching job postings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get promotions
exports.getPromotions = async (req, res) => {
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

// Admin: Get all contact messages
exports.getAllContactMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const query = 'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await db.query(query, [limit, offset]);

    const countResult = await db.query('SELECT COUNT(*) FROM contact_messages');
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
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Mark message as read
exports.markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'UPDATE contact_messages SET is_read = true WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
