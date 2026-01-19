"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Question_1 = __importDefault(require("../models/Question"));
const Answer_1 = __importDefault(require("../models/Answer"));
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
// Anyone can view questions
router.get('/', async (_req, res) => {
    if (!ensureDb(res))
        return;
    const questions = await Question_1.default.find().sort({ createdAt: -1 }).populate('authorId').populate('answers');
    res.json(questions);
});
// Students create questions (participation)
router.post('/', authMiddleware_1.requireAuth, authMiddleware_1.requireProfileCompleted, (0, authMiddleware_1.requireRole)(['student']), async (req, res) => {
    if (!ensureDb(res))
        return;
    const { title, content } = req.body;
    if (!title || !content)
        return res.status(400).json({ message: 'title and content are required' });
    const created = await Question_1.default.create({
        authorId: req.user.id,
        title,
        content,
    });
    // Log activity - visible to alumni
    await activityService_1.ActivityService.logActivity({
        userId: req.user.id,
        type: 'question_asked',
        title: `Asked: "${title}"`,
        description: content.substring(0, 100),
        relatedId: created._id,
        relatedType: 'Question',
        visibility: 'alumni' // Alumni can see questions
    });
    const populated = await Question_1.default.findById(created._id).populate('authorId').populate('answers');
    return res.status(201).json(populated || created);
});
// Alumni (and also students/admin) can answer
router.post('/:id/answers', authMiddleware_1.requireAuth, authMiddleware_1.requireProfileCompleted, (0, authMiddleware_1.requireRole)(['student', 'alumni', 'admin']), async (req, res) => {
    if (!ensureDb(res))
        return;
    const q = await Question_1.default.findById(req.params.id);
    if (!q)
        return res.status(404).json({ message: 'Question not found' });
    const { content } = req.body;
    if (!content)
        return res.status(400).json({ message: 'content is required' });
    const answer = await Answer_1.default.create({
        authorId: req.user.id,
        questionId: q._id,
        content,
    });
    // Log activity - visible to public when alumni answers
    if (req.user.role === 'alumni') {
        await activityService_1.ActivityService.logActivity({
            userId: req.user.id,
            type: 'answer_posted',
            title: `Answered question`,
            description: content.substring(0, 100),
            relatedId: answer._id,
            relatedType: 'Answer',
            visibility: 'public'
        });
    }
    await Question_1.default.updateOne({ _id: q._id }, { $push: { answers: answer._id } });
    const populated = await Answer_1.default.findById(answer._id).populate('authorId');
    return res.status(201).json(populated || answer);
});
exports.default = router;
//# sourceMappingURL=qa.js.map