import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkDbConnection } from './config/db.js';
import { seedAdminUser } from './config/seedAdmin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Task Management API is running...');
});

// Start Server and Run Checks
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  await checkDbConnection();
  await seedAdminUser();
});