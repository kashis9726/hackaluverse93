"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Blog_1 = __importDefault(require("../models/Blog"));
const authMiddleware_1 = require("../middleware/authMiddleware");
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
    const populated = await Blog_1.default.findById(blog._id).populate('authorId');
    return res.status(201).json(populated || blog);
});
exports.default = router;
//# sourceMappingURL=blogs.js.map