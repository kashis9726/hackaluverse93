import { Router } from 'express';
import mongoose from 'mongoose';
import Question from '../models/Question';
import Answer from '../models/Answer';
import { requireAuth, requireProfileCompleted, requireRole, type AuthRequest } from '../middleware/authMiddleware';

const router = Router();

const ensureDb = (res: any) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Database not connected' });
    return false;
  }
  return true;
};

// Anyone can view questions
router.get('/', async (_req, res) => {
  if (!ensureDb(res)) return;
  const questions = await Question.find().sort({ createdAt: -1 }).populate('authorId').populate('answers');
  res.json(questions);
});

// Students create questions (participation)
router.post('/', requireAuth, requireProfileCompleted, requireRole(['student']), async (req: AuthRequest, res) => {
  if (!ensureDb(res)) return;
  const { title, content } = req.body as { title?: string; content?: string };
  if (!title || !content) return res.status(400).json({ message: 'title and content are required' });

  const created = await Question.create({
    authorId: req.user!.id,
    title,
    content,
  });

  const populated = await Question.findById(created._id).populate('authorId').populate('answers');
  return res.status(201).json(populated || created);
});

// Alumni (and also students/admin) can answer
router.post('/:id/answers', requireAuth, requireProfileCompleted, requireRole(['student', 'alumni', 'admin']), async (req: AuthRequest, res) => {
  if (!ensureDb(res)) return;
  const q = await Question.findById(req.params.id);
  if (!q) return res.status(404).json({ message: 'Question not found' });

  const { content } = req.body as { content?: string };
  if (!content) return res.status(400).json({ message: 'content is required' });

  const answer = await Answer.create({
    authorId: req.user!.id,
    questionId: q._id,
    content,
  });

  await Question.updateOne({ _id: q._id }, { $push: { answers: answer._id } });
  const populated = await Answer.findById(answer._id).populate('authorId');
  return res.status(201).json(populated || answer);
});

export default router;
