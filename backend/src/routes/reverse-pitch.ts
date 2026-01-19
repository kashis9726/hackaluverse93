import { Router } from 'express';
import mongoose from 'mongoose';
import ReversePitch from '../models/ReversePitch';
import { requireAuth, requireProfileCompleted, requireRole, type AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Get all reverse pitches
router.get('/', async (_req, res) => {
    const pitches = await ReversePitch.find().sort({ createdAt: -1 }).populate('authorId');
    res.json(pitches);
});

// Create reverse pitch (Alumni/Admin)
router.post('/', requireAuth, requireProfileCompleted, requireRole(['alumni', 'admin']), async (req: AuthRequest, res) => {
    const { title, description, industry, budget, deadline } = req.body;

    const created = await ReversePitch.create({
        authorId: req.user!.id,
        title,
        description,
        industry,
        budget,
        deadline,
        submissions: []
    });

    const populated = await (ReversePitch as any).findById(created._id).populate('authorId');
    res.status(201).json(populated);
});

// Submit solution (Student)
router.post('/:id/submissions', requireAuth, requireProfileCompleted, requireRole(['student']), async (req: AuthRequest, res) => {
    const { content } = req.body;
    const submissionId = new mongoose.Types.ObjectId().toString();

    await (ReversePitch as any).updateOne(
        { _id: req.params.id },
        {
            $push: {
                submissions: {
                    id: submissionId,
                    studentId: req.user!.id,
                    content,
                    createdAt: new Date(),
                    status: 'pending'
                }
            }
        }
    );

    res.status(201).json({ success: true, submissionId });
});

export default router;
