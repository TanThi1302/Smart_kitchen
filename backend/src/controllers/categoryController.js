
const db = require('../config/database');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const query = `
      SELECT c.*,
             COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      GROUP BY c.id
      ORDER BY c.name

    `;
    const result = await db.query(query);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const query = 'SELECT * FROM categories WHERE slug = $1';
    const result = await db.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Create category
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, image_url, parent_id } = req.body;

    const query = `
      INSERT INTO categories (name, slug, description, image_url, parent_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [name, slug, description, image_url, parent_id || null];
    const result = await db.query(query, values);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image_url, parent_id } = req.body;

    const query = `
      UPDATE categories
      SET name = $1, slug = $2, description = $3, image_url = $4, parent_id = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;
    const values = [name, slug, description, image_url, parent_id, id];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM categories WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

