import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats
} from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply Authentication Middleware to all task routes
router.use(authenticateToken);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/stats', getDashboardStats);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;