const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE || 'malloca_db',
  user: process.env.PG_USER || 'tanthi',
  password: process.env.PG_PASSWORD || '13022004',
});

async function testConnection() {
  console.log('🔌 Testing database connection...');
  console.log('Host:', process.env.PG_HOST);
  console.log('Port:', process.env.PG_PORT);
  console.log('Database:', process.env.PG_DATABASE);
  console.log('User:', process.env.PG_USER);
  
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log('Current time:', result.rows[0].now);
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Gợi ý dựa trên error code
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Giải pháp: PostgreSQL service không chạy hoặc sai port');
      console.log('   - Kiểm tra PostgreSQL service trong Services (services.msc)');
      console.log('   - Hoặc kiểm tra port có đúng 5432 không');
    } else if (error.code === '28P01') {
      console.log('\n💡 Giải pháp: Password sai');
    } else if (error.code === '3D000') {
      console.log('\n💡 Giải pháp: Database không tồn tại');
      console.log('   - Tạo database bằng pgAdmin hoặc psql');
    } else if (error.code === '28000') {
      console.log('\n💡 Giải pháp: User không tồn tại hoặc không có quyền');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();