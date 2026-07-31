import pool from '../config/db.js';

// 1. Create a new Task
export const createTask = async (req, res) => {
  const { title, description, priority, status, due_date } = req.body;
  const userId = req.user.id;

  // Validation
  if (!title || !priority || !status || !due_date) {
    return res.status(400).json({ message: 'Title, Priority, Status, and Due Date are required.' });
  }

  // Validation: Due Date cannot be earlier than today
  const today = new Date().toISOString().split('T')[0];
  if (due_date < today) {
    return res.status(400).json({ message: 'Due date cannot be in the past.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO tasks (user_id, title, description, priority, status, due_date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, title, description || '', priority, status, due_date]
    );

    res.status(201).json({
      message: 'Task created successfully',
      taskId: result.insertId
    });
  } catch (error) {
    console.error('❌ Create Task Error:', error.message);
    res.status(500).json({ message: 'Server error while creating task.' });
  }
};

// 2. Get All Tasks (With Search, Filter, Sort, and Dashboard Stats)
export const getTasks = async (req, res) => {
  const userId = req.user.id;
  const { search, status, priority, sortBy } = req.query;

  try {
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const queryParams = [userId];

    // Search by Title
    if (search) {
      query += ' AND title LIKE ?';
      queryParams.push(`%${search}%`);
    }

    // Filter by Status
    if (status) {
      query += ' AND status = ?';
      queryParams.push(status);
    }

    // Filter by Priority
    if (priority) {
      query += ' AND priority = ?';
      queryParams.push(priority);
    }

    // Sorting
    if (sortBy === 'oldest') {
      query += ' ORDER BY created_at ASC';
    } else if (sortBy === 'due_date') {
      query += ' ORDER BY due_date ASC';
    } else {
      query += ' ORDER BY created_at DESC'; // Default: Newest first
    }

    const [tasks] = await pool.query(query, queryParams);

    res.status(200).json(tasks);
  } catch (error) {
    console.error('❌ Get Tasks Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching tasks.' });
  }
};

// 3. Get Single Task by ID
export const getTaskById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('❌ Get Task By ID Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching task.' });
  }
};

// 4. Update Task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, priority, status, due_date } = req.body;

  try {
    const [existingTask] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    if (existingTask.length === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    await pool.query(
      `UPDATE tasks 
       SET title = ?, description = ?, priority = ?, status = ?, due_date = ? 
       WHERE id = ? AND user_id = ?`,
      [
        title || existingTask[0].title,
        description !== undefined ? description : existingTask[0].description,
        priority || existingTask[0].priority,
        status || existingTask[0].status,
        due_date || existingTask[0].due_date,
        id,
        userId
      ]
    );

    res.status(200).json({ message: 'Task updated successfully.' });
  } catch (error) {
    console.error('❌ Update Task Error:', error.message);
    res.status(500).json({ message: 'Server error while updating task.' });
  }
};

// 5. Delete Task
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('❌ Delete Task Error:', error.message);
    res.status(500).json({ message: 'Server error while deleting task.' });
  }
};

// 6. Get Dashboard Summary Stats
export const getDashboardStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const [total] = await pool.query('SELECT COUNT(*) as count FROM tasks WHERE user_id = ?', [userId]);
    const [pending] = await pool.query('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = "Pending"', [userId]);
    const [inProgress] = await pool.query('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = "In Progress"', [userId]);
    const [completed] = await pool.query('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status = "Completed"', [userId]);
    const [overdue] = await pool.query(
      'SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status != "Completed" AND due_date < CURDATE()',
      [userId]
    );

    res.status(200).json({
      totalTasks: total[0].count,
      pendingTasks: pending[0].count,
      inProgressTasks: inProgress[0].count,
      completedTasks: completed[0].count,
      overdueTasks: overdue[0].count
    });
  } catch (error) {
    console.error('❌ Dashboard Stats Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching dashboard stats.' });
  }
};