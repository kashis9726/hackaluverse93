import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { getRecommendedAlumni } from '../controllers/recommendationController';

const router = Router();

router.get('/alumni', requireAuth, getRecommendedAlumni);

export default router;
