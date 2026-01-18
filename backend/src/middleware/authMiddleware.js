"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireProfileCompleted = exports.requireAuth = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const getBearerToken = (req) => {
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();
    if (!token)
        return null;
    return token;
};
const requireAuth = async (req, res, next) => {
    const token = getBearerToken(req);
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    if (mongoose_1.default.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Database not connected' });
    }
    try {
        const dbUser = await User_1.default.findOne({ authToken: token }).select('_id role email');
        if (!dbUser) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = { id: dbUser._id.toString(), role: dbUser.role, email: dbUser.email };
        return next();
    }
    catch {
        return res.status(500).json({ message: 'Failed to authenticate' });
    }
};
exports.requireAuth = requireAuth;
const requireProfileCompleted = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    if (req.user.role === 'admin')
        return next();
    if (mongoose_1.default.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Database not connected' });
    }
    const dbUser = await User_1.default.findById(req.user.id).select('profileCompleted');
    if (!dbUser) {
        return res.status(401).json({ message: 'User not found' });
    }
    if (!dbUser.profileCompleted) {
        return res.status(403).json({ message: 'Profile setup required', code: 'PROFILE_INCOMPLETE' });
    }
    return next();
};
exports.requireProfileCompleted = requireProfileCompleted;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. ${roles.join(' or ')} role required.` });
        }
        if (req.user.role === 'admin') {
            const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
            if (adminEmail && req.user.email.toLowerCase() !== adminEmail) {
                return res.status(403).json({ message: 'Access denied. Admin email not allowed.' });
            }
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=authMiddleware.js.map