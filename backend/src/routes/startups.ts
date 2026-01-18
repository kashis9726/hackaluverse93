import { Router } from 'express';
import mongoose from 'mongoose';
import Startup from '../models/Startup';
import { requireAuth, requireProfileCompleted, requireRole, type AuthRequest } from '../middleware/authMiddleware';

const router = Router();

const ensureDb = (res: any) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Database not connected' });
    return false;
  }
  return true;
};

// Public list
router.get('/', async (_req, res) => {
  if (!ensureDb(res)) return;
  const startups = await Startup.find().sort({ createdAt: -1 }).populate('ownerId');
  res.json(startups);
});

// Students can create startups (UI: students create startups)
router.post('/', requireAuth, requireProfileCompleted, requireRole(['student', 'admin']), async (req: AuthRequest, res) => {
  if (!ensureDb(res)) return;
  const { title, tagline } = req.body as { title?: string; tagline?: string };
  if (!title) return res.status(400).json({ message: 'title is required' });

  const created = await Startup.create({
    ownerId: req.user!.id,
    title,
    ...(tagline ? { tagline } : {}),
  });

  const populated = await Startup.findById(created._id).populate('ownerId');
  return res.status(201).json(populated || created);
});

export default router;
