"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Challenge_1 = __importDefault(require("../models/Challenge"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const ensureDb = (res) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        res.status(503).json({ message: 'Database not connected' });
        return false;
    }
    return true;
};
// Anyone can view challenges
router.get('/', async (_req, res) => {
    if (!ensureDb(res))
        return;
    const challenges = await Challenge_1.default.find().sort({ createdAt: -1 }).populate('authorId');
    res.json(challenges);
});
// Alumni/admin create challenges
router.post('/', authMiddleware_1.requireAuth, authMiddleware_1.requireProfileCompleted, (0, authMiddleware_1.requireRole)(['alumni', 'admin']), async (req, res) => {
    if (!ensureDb(res))
        return;
    const { title, description } = req.body;
    if (!title)
        return res.status(400).json({ message: 'title is required' });
    const created = await Challenge_1.default.create({
        authorId: req.user.id,
        title,
        ...(description ? { description } : {}),
    });
    const populated = await Challenge_1.default.findById(created._id).populate('authorId');
    return res.status(201).json(populated || created);
});
// Students submit solutions
router.post('/:id/submissions', authMiddleware_1.requireAuth, authMiddleware_1.requireProfileCompleted, (0, authMiddleware_1.requireRole)(['student']), async (req, res) => {
    if (!ensureDb(res))
        return;
    const challenge = await Challenge_1.default.findById(req.params.id);
    if (!challenge)
        return res.status(404).json({ message: 'Challenge not found' });
    const { content } = req.body;
    if (!content)
        return res.status(400).json({ message: 'content is required' });
    const submissionId = new mongoose_1.default.Types.ObjectId().toString();
    await Challenge_1.default.updateOne({ _id: challenge._id }, {
        $push: {
            submissions: {
                id: submissionId,
                studentId: req.user.id,
                content,
                createdAt: new Date(),
            },
        },
    });
    return res.status(201).json({ success: true, submissionId });
});
exports.default = router;
//# sourceMappingURL=challenges.js.map