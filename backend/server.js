const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./authRoutes');
app.use('/auth', authRoutes);

const taskRoutes = require('./routes');
app.use('/task', taskRoutes);

// MongoDB
mongoose.connect('mongodb://localhost/todoapp')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.listen(3003, () => console.log('🚀 Server running at http://localhost:3003'));
