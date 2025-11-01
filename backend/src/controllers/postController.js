const db = require('../config/database');

// Get all posts (public - only published)
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM posts WHERE is_published = true';
    const params = [];

    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }

    query += ' ORDER BY published_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM posts WHERE is_published = true';
    const countParams = [];
    if (category) {
      countQuery += ' AND category = $1';
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
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Get all posts (including unpublished)
exports.getAllPostsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 100, category } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM posts';
    const params = [];

    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM posts';
    const countParams = [];
    if (category) {
      countQuery += ' WHERE category = $1';
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
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get post by slug
exports.getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const query = 'SELECT * FROM posts WHERE slug = $1 AND is_published = true';
    const result = await db.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Create post
exports.createPost = async (req, res) => {
  try {
    const { title, slug, content, excerpt, thumbnail_url, category, author, is_published } = req.body;

    const query = `
      INSERT INTO posts (title, slug, content, excerpt, thumbnail_url, category, author, is_published, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      title, slug, content, excerpt, thumbnail_url, category, author,
      is_published, is_published ? new Date() : null
    ];
    const result = await db.query(query, values);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Update post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, excerpt, thumbnail_url, category, author, is_published } = req.body;

    const query = `
      UPDATE posts
      SET title = $1, slug = $2, content = $3, excerpt = $4, thumbnail_url = $5,
          category = $6, author = $7, is_published = $8,
          published_at = CASE WHEN $8 = true AND published_at IS NULL THEN NOW() ELSE published_at END,
          updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;
    const values = [title, slug, content, excerpt, thumbnail_url, category, author, is_published, id];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: Delete post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM posts WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
