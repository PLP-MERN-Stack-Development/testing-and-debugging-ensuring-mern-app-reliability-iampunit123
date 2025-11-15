
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Mock posts routes for testing
app.get('/api/posts', (req, res) => {
  res.json([{ id: 1, title: 'Test Post', content: 'Test content' }]);
});

app.get('/api/posts/:id', (req, res) => {
  res.json({ id: req.params.id, title: 'Test Post', content: 'Test content' });
});

app.post('/api/posts', (req, res) => {
  res.status(201).json({ id: 2, ...req.body });
});

app.put('/api/posts/:id', (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

app.delete('/api/posts/:id', (req, res) => {
  res.json({ message: 'Post deleted' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
