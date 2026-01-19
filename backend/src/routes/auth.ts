/**
 * Authentication Routes
 * /api/auth/*
 */
import { Router } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware';
import { requireAuth } from '../middleware/authMiddleware';
import { AuthService } from '../services/authService';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';

const router = Router();

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const result = await AuthService.signup({ name, email, role, password });
    res.status(HTTP_STATUS.CREATED).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_AUTH;
    console.error('[AUTH] signup', error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, role, password } = req.body;
    const result = await AuthService.login({ email, role, password });
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_AUTH;
    console.error('[AUTH] login', error);
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message });
  }
});

/**
 * POST /api/auth/admin-login
 * Admin login
 */
router.post('/admin-login', async (req, res) => {
  try {
    const { email } = req.body as { email?: string };
    if (!email) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Email is required' });
    }

    const result = await AuthService.adminLogin(email);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_AUTH;
    console.error('[AUTH] admin-login', error);
    const statusCode = message.includes('not configured') || message.includes('Not allowed')
      ? HTTP_STATUS.FORBIDDEN
      : HTTP_STATUS.UNAUTHORIZED;
    res.status(statusCode).json({ message });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const user = await AuthService.verifyToken(req.headers.authorization?.replace('Bearer ', '') || '');
    res.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_AUTH;
    console.error('[AUTH] me', error);
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message });
  }
});

export default router;
