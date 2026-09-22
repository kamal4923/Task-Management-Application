const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Support Vercel serverless /tmp directory writable path
const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const dbPath = isVercel ? path.join('/tmp', 'tasks.db') : path.resolve(__dirname, 'tasks.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Async helper functions
db.getAsync = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

db.runAsync = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// Initialize tables and seed initial data
async function initDb() {
  try {
    // Create Users table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Tasks table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'To Do',
        priority TEXT NOT NULL DEFAULT 'Medium',
        category TEXT NOT NULL DEFAULT 'Work',
        due_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Check if demo user exists, if not seed demo data
    const existingUser = await db.getAsync(`SELECT * FROM users WHERE email = ?`, ['demo@taskmaster.com']);
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userResult = await db.runAsync(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        ['Demo User', 'demo@taskmaster.com', hashedPassword]
      );

      const userId = userResult.lastID;
      const today = new Date();

      const sampleTasks = [
        {
          title: 'Design Full-Stack Application Architecture',
          description: 'Establish SQLite schema, REST endpoints, JWT authorization flow, and Socket.IO real-time channels.',
          status: 'Completed',
          priority: 'High',
          category: 'Work',
          due_date: new Date(today.getTime() - 86400000).toISOString().split('T')[0]
        },
        {
          title: 'Build Interactive Kanban Board & Filter Toolbar',
          description: 'Implement column drag & drop, status badges, priority filtering, and full-text search.',
          status: 'In Progress',
          priority: 'Urgent',
          category: 'Feature',
          due_date: new Date(today.getTime() + 86400000 * 2).toISOString().split('T')[0]
        },
        {
          title: 'Setup Socket.IO Real-Time WebSocket Listener',
          description: 'Ensure multi-client session updates reflect immediately across all open user browsers.',
          status: 'In Review',
          priority: 'High',
          category: 'Feature',
          due_date: new Date(today.getTime() + 86400000 * 3).toISOString().split('T')[0]
        },
        {
          title: 'Write Unit & Integration Test Suite',
          description: 'Test authentication, task validation, database operations, and route endpoints.',
          status: 'To Do',
          priority: 'Medium',
          category: 'Work',
          due_date: new Date(today.getTime() + 86400000 * 5).toISOString().split('T')[0]
        },
        {
          title: 'Review Responsive Mobile Navigation',
          description: 'Verify layout flexbox/grid responsiveness on mobile browsers and tablet viewports.',
          status: 'To Do',
          priority: 'Low',
          category: 'Personal',
          due_date: new Date(today.getTime() + 86400000 * 7).toISOString().split('T')[0]
        }
      ];

      for (const t of sampleTasks) {
        await db.runAsync(
          `INSERT INTO tasks (user_id, title, description, status, priority, category, due_date)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [userId, t.title, t.description, t.status, t.priority, t.category, t.due_date]
        );
      }
      console.log('Database initialized with seed data (Demo user: demo@taskmaster.com / password123)');
    }
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
}

initDb();

module.exports = db;
