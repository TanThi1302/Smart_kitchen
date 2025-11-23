const db = require('../config/database');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total products count
    const productsQuery = 'SELECT COUNT(*) as count FROM products WHERE is_active = true';
    const productsResult = await db.query(productsQuery);
    const totalProducts = parseInt(productsResult.rows[0].count);

    // Get new orders count (pending status)
    const newOrdersQuery = "SELECT COUNT(*) as count FROM orders WHERE status = 'pending'";
    const newOrdersResult = await db.query(newOrdersQuery);
    const newOrders = parseInt(newOrdersResult.rows[0].count);

    // Get total unique customers (count unique emails from orders)
    const customersQuery = 'SELECT COUNT(DISTINCT email) as count FROM orders';
    const customersResult = await db.query(customersQuery);
    const totalCustomers = parseInt(customersResult.rows[0].count);

    // Get monthly revenue (current month)
    const monthlyRevenueQuery = `
      SELECT COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
        AND status != 'cancelled'
    `;
    const monthlyRevenueResult = await db.query(monthlyRevenueQuery);
    const monthlyRevenue = parseFloat(monthlyRevenueResult.rows[0].revenue);

    res.json({
      success: true,
      data: {
        totalProducts,
        newOrders,
        totalCustomers,
        monthlyRevenue
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
