const express = require('express');
const cors = require('cors');
const authRoutes = require('../server/routes/auth');
const createTasksRouter = require('../server/routes/tasks');

const app = express();

app.use(cors());
app.use(express.json());

// Serverless fallback for Socket.IO io instance in serverless
const dummyIo = {
  to: () => ({
    emit: () => {}
  })
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: 'vercel-serverless', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', createTasksRouter(dummyIo));

module.exports = app;
