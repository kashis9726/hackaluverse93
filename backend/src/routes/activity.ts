import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware';
import { ActivityService } from '../services/activityService';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import { logError } from '../utils';

const router = Router();

/**
 * GET /api/activity/feed
 * Get personalized activity feed based on user role
 */
router.get('/feed', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = (req as any).user;
    const limit = parseInt(req.query.limit as string) || 50;

    let activities;
    if (user.role === 'alumni') {
      activities = await ActivityService.getAlumniActivityFeed(limit);
    } else {
      activities = await ActivityService.getStudentActivityFeed(limit);
    }

    res.json({ activities });
  } catch (error) {
    logError('[ACTIVITY] feed', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      message: ERROR_MESSAGES.FAILED_TO_FETCH
    });
  }
});

/**
 * GET /api/activity/user/:userId
 * Get activities by a specific user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    const activities = await ActivityService.getUserActivities(
      userId as any,
      limit
    );

    res.json({ activities });
  } catch (error) {
    logError('[ACTIVITY] user', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      message: ERROR_MESSAGES.FAILED_TO_FETCH
    });
  }
});

/**
 * GET /api/activity/qa
 * Get latest Q&A activities (for real-time updates)
 */
router.get('/qa', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const activities = await ActivityService.getLatestQAndA(limit);

    res.json({ activities });
  } catch (error) {
    logError('[ACTIVITY] qa', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      message: ERROR_MESSAGES.FAILED_TO_FETCH
    });
  }
});

/**
 * PUT /api/activity/:activityId/read
 * Mark activity as read
 */
router.put('/:activityId/read', requireAuth, async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = (req as any).userId;

    const activity = await ActivityService.markActivityAsRead(
      activityId as any,
      userId
    );

    res.json({ activity });
  } catch (error) {
    logError('[ACTIVITY] mark-read', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      message: ERROR_MESSAGES.FAILED_TO_UPDATE
    });
  }
});

/**
 * GET /api/activity/unread/count
 * Get unread activities count
 */
router.get('/unread/count', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const count = await ActivityService.getUnreadCount(userId);

    res.json({ count });
  } catch (error) {
    logError('[ACTIVITY] unread-count', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      message: ERROR_MESSAGES.FAILED_TO_FETCH
    });
  }
});

export default router;
