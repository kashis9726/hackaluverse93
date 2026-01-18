"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Authentication Routes
 * /api/auth/*
 */
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authService_1 = require("../services/authService");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const router = (0, express_1.Router)();
/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post('/signup', async (req, res) => {
    try {
        const { name, email, role, password } = req.body;
        const result = await authService_1.AuthService.signup({ name, email, role, password });
        res.status(constants_1.HTTP_STATUS.CREATED).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : constants_1.ERROR_MESSAGES.FAILED_AUTH;
        (0, utils_1.logError)('[AUTH] signup', error);
        res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({ message });
    }
});
/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
    try {
        const { email, role, password } = req.body;
        const result = await authService_1.AuthService.login({ email, role, password });
        res.json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : constants_1.ERROR_MESSAGES.FAILED_AUTH;
        (0, utils_1.logError)('[AUTH] login', error);
        res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ message });
    }
});
/**
 * POST /api/auth/admin-login
 * Admin login
 */
router.post('/admin-login', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(constants_1.HTTP_STATUS.BAD_REQUEST).json({ message: 'Email is required' });
        }
        const result = await authService_1.AuthService.adminLogin(email);
        res.json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : constants_1.ERROR_MESSAGES.FAILED_AUTH;
        (0, utils_1.logError)('[AUTH] admin-login', error);
        const statusCode = message.includes('not configured') || message.includes('Not allowed')
            ? constants_1.HTTP_STATUS.FORBIDDEN
            : constants_1.HTTP_STATUS.UNAUTHORIZED;
        res.status(statusCode).json({ message });
    }
});
/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authMiddleware_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await authService_1.AuthService.verifyToken(req.headers.authorization?.replace('Bearer ', '') || '');
        res.json({ user });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : constants_1.ERROR_MESSAGES.FAILED_AUTH;
        (0, utils_1.logError)('[AUTH] me', error);
        res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ message });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map