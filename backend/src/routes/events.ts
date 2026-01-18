import { Router } from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event';
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
  const events = await Event.find().sort({ date: 1 }).populate('organizerId');
  res.json(events);
});

// Alumni/admin can create events
router.post('/', requireAuth, requireProfileCompleted, requireRole(['alumni', 'admin']), async (req: AuthRequest, res) => {
  if (!ensureDb(res)) return;
  const { title, date, location, description } = req.body as {
    title?: string;
    date?: string;
    location?: string;
    description?: string;
  };
  if (!title || !date) return res.status(400).json({ message: 'title and date are required' });

  const created = await Event.create({
    organizerId: req.user!.id,
    title,
    date: new Date(date),
    ...(location ? { location } : {}),
    ...(description ? { description } : {}),
  });

  const populated = await Event.findById(created._id).populate('organizerId');
  return res.status(201).json(populated || created);
});

export default router;
