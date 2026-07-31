import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL connection pool එක සාදාගැනීම
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Database Connection එක test කිරීම සඳහා function එකක්
export const checkDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected ');
    connection.release();
  } catch (error) {
    console.error('❌ Database Connection Error:', error.message);
  }
};

export default pool;