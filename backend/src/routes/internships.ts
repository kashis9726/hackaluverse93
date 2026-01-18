import { Router } from 'express';
import mongoose from 'mongoose';
import Internship from '../models/Internship';
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
  const internships = await Internship.find().sort({ createdAt: -1 }).populate('postedById');
  res.json(internships);
});

// Alumni/admin can post internships
router.post('/', requireAuth, requireProfileCompleted, requireRole(['alumni', 'admin']), async (req: AuthRequest, res) => {
  if (!ensureDb(res)) return;
  const { title, company, description } = req.body as {
    title?: string;
    company?: string;
    description?: string;
  };
  if (!title) return res.status(400).json({ message: 'title is required' });

  const created = await Internship.create({
    postedById: req.user!.id,
    title,
    ...(company ? { company } : {}),
    ...(description ? { description } : {}),
  });

  const populated = await Internship.findById(created._id).populate('postedById');
  return res.status(201).json(populated || created);
});

// Students apply (UI: students participate)
router.post('/:id/apply', requireAuth, requireProfileCompleted, requireRole(['student']), async (req: AuthRequest, res) => {
  if (!ensureDb(res)) return;
  const internship = await Internship.findById(req.params.id);
  if (!internship) return res.status(404).json({ message: 'Internship not found' });

  const userId = req.user!.id;
  const already = (internship as any).applicants?.some((a: any) => a.toString() === userId);
  if (already) return res.status(409).json({ message: 'Already applied' });

  await Internship.updateOne({ _id: internship._id }, { $addToSet: { applicants: userId } });
  return res.status(201).json({ success: true });
});

export default router;
