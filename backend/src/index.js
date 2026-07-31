import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkDbConnection } from './config/db.js';
import { seedAdminUser } from './config/seedAdmin.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js'; // <-- Import Task Routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); // <-- Use Task Routes

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