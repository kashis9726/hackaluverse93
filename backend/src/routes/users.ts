/**
 * User Routes
 * /api/users/*
 */
import { Router } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware';
import { requireAuth, requireProfileCompleted, requireRole } from '../middleware/authMiddleware';
import { UserService } from '../services/userService';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import { log, logError } from '../utils';

const router = Router();

/**
 * GET /api/users
 * Get all visible user profiles (requires auth and complete profile)
 */
router.get('/', requireAuth, requireProfileCompleted, async (_req, res) => {
  try {
    const users = await UserService.getAllVisibleUsers();
    res.json(users);
  } catch (error) {
    logError('[USERS] getAll', error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({ message: ERROR_MESSAGES.FAILED_TO_FETCH });
  }
});

/**
 * GET /api/users/:userId
 * Get specific user profile (public if visible)
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserService.getUserById(userId);
    res.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_FETCH;
    const statusCode = message.includes('Invalid') ? HTTP_STATUS.BAD_REQUEST : HTTP_STATUS.NOT_FOUND;
    res.status(statusCode).json({ message });
  }
});

/**
 * GET /api/users/me
 * Get current user profile (auth required)
 */
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const user = await UserService.getUserProfile(userId);
    res.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_FETCH;
    logError('[USERS] getMe', error);
    res.status(HTTP_STATUS.NOT_FOUND).json({ message });
  }
});

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;
    const user = await UserService.updateProfile(userId, role, req.body);
    res.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_UPDATE;
    logError('[USERS] updateProfile', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message });
  }
});

/**
 * PATCH /api/users/:userId/visibility
 * Toggle profile visibility
 */
router.patch('/:userId/visibility', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.userId as string;
    const currentUserId = req.user!.id;

    // Only user or admin can change visibility
    if (userId !== currentUserId && req.user!.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: ERROR_MESSAGES.ACCESS_DENIED });
    }

    const { visible } = req.body as { visible?: boolean };
    const visibleValue: boolean = visible === true;
    const user = await UserService.toggleProfileVisibility(userId, visibleValue);
    res.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_UPDATE;
    const statusCode = message.includes('Invalid') ? HTTP_STATUS.BAD_REQUEST : HTTP_STATUS.NOT_FOUND;
    res.status(statusCode).json({ message });
  }
});

/**
 * GET /api/users/search/:query
 * Search users
 */
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const users = await UserService.searchUsers(query);
    res.json(users);
  } catch (error) {
    const message = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_FETCH;
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message });
  }
});

/**
 * POST /api/users
 * Create user (admin only)
 */
router.post('/', requireAuth, requireRole(['admin']), async (req: AuthRequest, res) => {
  try {
    const { name, email, role } = req.body as { name?: string; email?: string; role?: string };
    if (!email || !role) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Email and role are required' });
    }

    const user = await UserService.createUser(name || 'User', email, role);
    res.status(HTTP_STATUS.CREATED).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_CREATE;
    logError('[USERS] create', error);
    const statusCode = message.includes('exists') ? HTTP_STATUS.CONFLICT : HTTP_STATUS.BAD_REQUEST;
    res.status(statusCode).json({ message });
  }
});

export default router;
