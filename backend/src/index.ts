import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { initSocket } from './socket';

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
import reversePitchRoutes from './routes/reverse-pitch';
import recommendationRoutes from './routes/recommendations';
import notificationRoutes from './routes/notifications';
import connectionRoutes from './routes/connections';

import { log, logError } from './utils';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = initSocket(httpServer);

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
app.use('/api/reverse-pitch', reversePitchRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/activity', activityRoutes);

import chatRoutes from './routes/chat';
app.use('/api/chat', chatRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/connections', connectionRoutes);

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

  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    logError('[DATABASE]', 'MONGODB_URI is not configured - starting server without database connection');
  }

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      log('[DATABASE]', '✓ MongoDB connected');
      log('[DATABASE]', `Database: ${mongoose.connection.name}`);
      log('[DATABASE]', `Host: ${mongoose.connection.host}`);
    } catch (err) {
      logError('[DATABASE]', 'Failed to connect to MongoDB - starting server anyway');
      logError('[DATABASE]', err);
    }
  }

  // Start listening
  httpServer.listen(port, () => {
    log('[SERVER]', `✓ Backend listening on http://localhost:${port}`);
    log('[SERVER]', `✓ Socket.IO initialized`);
  });
};

void start();
