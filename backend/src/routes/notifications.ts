import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { getNotifications, markAsRead } from '../controllers/notificationController';

const router = Router();

router.get('/', requireAuth, getNotifications);
router.post('/mark-read', requireAuth, markAsRead);

export default router;
