const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

module.exports = function (io) {
  const router = express.Router();

  // All task routes require authentication
  router.use(authenticateToken);

  // Get tasks (with search, filtering, and sorting)
  router.get('/', async (req, res) => {
    try {
      const userId = req.user.id;
      const { search, status, priority, category, sortBy } = req.query;

      let sql = `SELECT * FROM tasks WHERE user_id = ?`;
      const params = [userId];

      if (status && status !== 'All') {
        sql += ` AND status = ?`;
        params.push(status);
      }

      if (priority && priority !== 'All') {
        sql += ` AND priority = ?`;
        params.push(priority);
      }

      if (category && category !== 'All') {
        sql += ` AND category = ?`;
        params.push(category);
      }

      if (search && search.trim() !== '') {
        sql += ` AND (title LIKE ? OR description LIKE ?)`;
        const searchPattern = `%${search.trim()}%`;
        params.push(searchPattern, searchPattern);
      }

      // Sorting logic
      if (sortBy === 'due_date') {
        sql += ` ORDER BY CASE WHEN due_date IS NULL OR due_date = '' THEN 1 ELSE 0 END, due_date ASC`;
      } else if (sortBy === 'priority') {
        sql += ` ORDER BY CASE priority
                    WHEN 'Urgent' THEN 1
                    WHEN 'High' THEN 2
                    WHEN 'Medium' THEN 3
                    WHEN 'Low' THEN 4
                    ELSE 5 END ASC`;
      } else {
        // Default sort by created_at DESC
        sql += ` ORDER BY created_at DESC`;
      }

      const tasks = await db.allAsync(sql, params);
      res.json({ tasks });
    } catch (err) {
      console.error('Fetch tasks error:', err);
      res.status(500).json({ error: 'Failed to fetch tasks.' });
    }
  });

  // Get single task by ID
  router.get('/:id', async (req, res) => {
    try {
      const task = await db.getAsync(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id]);
      if (!task) {
        return res.status(404).json({ error: 'Task not found.' });
      }
      res.json({ task });
    } catch (err) {
      console.error('Fetch single task error:', err);
      res.status(500).json({ error: 'Failed to fetch task.' });
    }
  });

  // Create new task
  router.post('/', async (req, res) => {
    try {
      const { title, description, status = 'To Do', priority = 'Medium', category = 'Work', due_date } = req.body;

      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Task title is required.' });
      }

      const result = await db.runAsync(
        `INSERT INTO tasks (user_id, title, description, status, priority, category, due_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, title.trim(), description ? description.trim() : '', status, priority, category, due_date || null]
      );

      const newTask = await db.getAsync(`SELECT * FROM tasks WHERE id = ?`, [result.lastID]);

      // Emit WebSocket real-time event
      if (io) {
        io.to(`user_${req.user.id}`).emit('task:created', newTask);
      }

      res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (err) {
      console.error('Create task error:', err);
      res.status(500).json({ error: 'Failed to create task.' });
    }
  });

  // Update full task
  router.put('/:id', async (req, res) => {
    try {
      const { title, description, status, priority, category, due_date } = req.body;
      const taskId = req.params.id;

      const existing = await db.getAsync(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`, [taskId, req.user.id]);
      if (!existing) {
        return res.status(404).json({ error: 'Task not found or unauthorized.' });
      }

      const updatedTitle = title !== undefined ? title.trim() : existing.title;
      const updatedDescription = description !== undefined ? description.trim() : existing.description;
      const updatedStatus = status || existing.status;
      const updatedPriority = priority || existing.priority;
      const updatedCategory = category || existing.category;
      const updatedDueDate = due_date !== undefined ? due_date : existing.due_date;

      await db.runAsync(
        `UPDATE tasks
         SET title = ?, description = ?, status = ?, priority = ?, category = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND user_id = ?`,
        [updatedTitle, updatedDescription, updatedStatus, updatedPriority, updatedCategory, updatedDueDate, taskId, req.user.id]
      );

      const updatedTask = await db.getAsync(`SELECT * FROM tasks WHERE id = ?`, [taskId]);

      // Emit WebSocket real-time event
      if (io) {
        io.to(`user_${req.user.id}`).emit('task:updated', updatedTask);
      }

      res.json({ message: 'Task updated successfully', task: updatedTask });
    } catch (err) {
      console.error('Update task error:', err);
      res.status(500).json({ error: 'Failed to update task.' });
    }
  });

  // Patch task status (quick move in Kanban / status check)
  router.patch('/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      const taskId = req.params.id;

      if (!status) {
        return res.status(400).json({ error: 'Status is required.' });
      }

      const existing = await db.getAsync(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`, [taskId, req.user.id]);
      if (!existing) {
        return res.status(404).json({ error: 'Task not found or unauthorized.' });
      }

      await db.runAsync(
        `UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
        [status, taskId, req.user.id]
      );

      const updatedTask = await db.getAsync(`SELECT * FROM tasks WHERE id = ?`, [taskId]);

      // Emit WebSocket real-time event
      if (io) {
        io.to(`user_${req.user.id}`).emit('task:status_changed', updatedTask);
      }

      res.json({ message: 'Task status updated', task: updatedTask });
    } catch (err) {
      console.error('Patch status error:', err);
      res.status(500).json({ error: 'Failed to update status.' });
    }
  });

  // Delete task
  router.delete('/:id', async (req, res) => {
    try {
      const taskId = req.params.id;
      const existing = await db.getAsync(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`, [taskId, req.user.id]);
      if (!existing) {
        return res.status(404).json({ error: 'Task not found or unauthorized.' });
      }

      await db.runAsync(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [taskId, req.user.id]);

      // Emit WebSocket real-time event
      if (io) {
        io.to(`user_${req.user.id}`).emit('task:deleted', { id: Number(taskId) });
      }

      res.json({ message: 'Task deleted successfully', id: Number(taskId) });
    } catch (err) {
      console.error('Delete task error:', err);
      res.status(500).json({ error: 'Failed to delete task.' });
    }
  });

  return router;
};
