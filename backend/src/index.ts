import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Routes
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import blogsRoutes from './routes/blogs';
import eventsRoutes from './routes/events';
import internshipsRoutes from './routes/internships';
import startupsRoutes from './routes/startups';
import challengesRoutes from './routes/challenges';
import qaRoutes from './routes/qa';
import activityRoutes from './routes/activity';

import { log, logError } from './utils';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/internships', internshipsRoutes);
app.use('/api/startups', startupsRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/activity', activityRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Start server
const start = async () => {
  const port = Number(process.env.PORT || 4000);
  const env = process.env.NODE_ENV || 'development';

  log('[SERVER]', `Starting in ${env} mode...`);
  log('[SERVER]', `Backend working directory: ${process.cwd()}`);
  log('[SERVER]', `Admin email configured: ${Boolean((process.env.ADMIN_EMAIL || '').trim())}`);

  // Connect to MongoDB - REQUIRED
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    logError('[DATABASE]', 'MONGODB_URI is not configured - cannot start server');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    log('[DATABASE]', '✓ MongoDB connected');
    log('[DATABASE]', `Database: ${mongoose.connection.name}`);
    log('[DATABASE]', `Host: ${mongoose.connection.host}`);
  } catch (err) {
    logError('[DATABASE]', 'Failed to connect to MongoDB');
    logError('[DATABASE]', err);
    process.exit(1);
  }

  // Start listening
  app.listen(port, () => {
    log('[SERVER]', `✓ Backend listening on http://localhost:${port}`);
  });
};

void start();
