"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Blog_1 = __importDefault(require("../models/Blog"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const activityService_1 = require("../services/activityService");
const router = (0, express_1.Router)();
const ensureDb = (res) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        res.status(503).json({ message: 'Database not connected' });
        return false;
    }
    return true;
};
// Public (read-only)
router.get('/', async (_req, res) => {
    if (!ensureDb(res))
        return;
    const blogs = await Blog_1.default.find().sort({ createdAt: -1 }).populate('authorId');
    res.json(blogs);
});
// Alumni/admin can create blogs
router.post('/', authMiddleware_1.requireAuth, authMiddleware_1.requireProfileCompleted, (0, authMiddleware_1.requireRole)(['alumni', 'admin']), async (req, res) => {
    if (!ensureDb(res))
        return;
    const { title, content, image, category, tags } = req.body;
    if (!content)
        return res.status(400).json({ message: 'content is required' });
    const blog = await Blog_1.default.create({
        authorId: req.user.id,
        content,
        ...(typeof image === 'string' && image.trim() ? { image: image.trim() } : {}),
        ...(typeof category === 'string' && category.trim() ? { category: category.trim() } : {}),
        ...(Array.isArray(tags) ? { tags: tags.filter((t) => typeof t === 'string' && t.trim()).map((t) => t.trim()) } : {}),
        ...(title ? { title } : {}),
        type: 'post',
    });
    // Log activity - blogs by alumni are public
    await activityService_1.ActivityService.logActivity({
        userId: req.user.id,
        type: 'blog_created',
        title: `Published blog: "${title || 'Untitled'}"`,
        description: content.substring(0, 100),
        relatedId: blog._id,
        relatedType: 'Blog',
        visibility: 'public'
    });
    // TRIGGER NOTIFICATION
    // We don't await this so it runs in background (or we can await if critical)
    // For better reliability we could await or use a queue. Here we await to ensure it runs but don't block response too much logic inside.
    // Actually, let's catch errors so it doesn't fail request.
    Promise.resolve().then(() => __importStar(require('../services/notificationService'))).then(service => {
        service.createPostNotification(blog).catch(err => console.error('Notification trigger failed', err));
    });
    const populated = await Blog_1.default.findById(blog._id).populate('authorId');
    return res.status(201).json(populated || blog);
});
exports.default = router;
//# sourceMappingURL=blogs.js.map