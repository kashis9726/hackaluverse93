import { Router } from 'express';
import mongoose from 'mongoose';
import Challenge from '../models/Challenge';
import { requireAuth, requireProfileCompleted, requireRole, type AuthRequest } from '../middleware/authMiddleware';

const router = Router();

const ensureDb = (res: any) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Database not connected' });
    return false;
  }
  return true;
};

// Anyone can view challenges
router.get('/', async (_req, res) => {
  if (!ensureDb(res)) return;
  const challenges = await Challenge.find().sort({ createdAt: -1 }).populate('authorId');
  res.json(challenges);
});

// Alumni/admin create challenges
router.post('/', requireAuth, requireProfileCompleted, requireRole(['alumni', 'admin']), async (req: AuthRequest, res) => {
  if (!ensureDb(res)) return;
  const { title, description } = req.body as { title?: string; description?: string };
  if (!title) return res.status(400).json({ message: 'title is required' });

  const created = await Challenge.create({
    authorId: req.user!.id,
    title,
    ...(description ? { description } : {}),
  });

  const populated = await Challenge.findById(created._id).populate('authorId');
  return res.status(201).json(populated || created);
});

// Students submit solutions
router.post('/:id/submissions', requireAuth, requireProfileCompleted, requireRole(['student']), async (req: AuthRequest, res) => {
  if (!ensureDb(res)) return;
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

  const { content } = req.body as { content?: string };
  if (!content) return res.status(400).json({ message: 'content is required' });

  const submissionId = new mongoose.Types.ObjectId().toString();
  await Challenge.updateOne(
    { _id: challenge._id },
    {
      $push: {
        submissions: {
          id: submissionId,
          studentId: req.user!.id,
          content,
          createdAt: new Date(),
        },
      },
    }
  );

  return res.status(201).json({ success: true, submissionId });
});

export default router;
