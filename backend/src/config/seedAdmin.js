import pool from './db.js';
import bcrypt from 'bcryptjs';

export const seedAdminUser = async () => {
  try {
    const adminEmail = 'admin@test.com';
    
    // Check if admin exists
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [adminEmail]);

    if (rows.length === 0) {
      // Hash password
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      // Insert Admin
      await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        ['Admin User', adminEmail, hashedPassword]
      );
      
      console.log('👤 Default Admin User created successfully! (admin@test.com / 123456)');
    } else {
      console.log('ℹ️ Admin User already exists in the database.');
    }
  } catch (error) {
    console.error('❌ Admin Seed Error:', error.message);
  }
};