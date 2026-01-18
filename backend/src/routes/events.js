"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Event_1 = __importDefault(require("../models/Event"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const ensureDb = (res) => {
    if (mongoose_1.default.connection.readyState !== 1) {
        res.status(503).json({ message: 'Database not connected' });
        return false;
    }
    return true;
};
// Public list
router.get('/', async (_req, res) => {
    if (!ensureDb(res))
        return;
    const events = await Event_1.default.find().sort({ date: 1 }).populate('organizerId');
    res.json(events);
});
// Alumni/admin can create events
router.post('/', authMiddleware_1.requireAuth, authMiddleware_1.requireProfileCompleted, (0, authMiddleware_1.requireRole)(['alumni', 'admin']), async (req, res) => {
    if (!ensureDb(res))
        return;
    const { title, date, location, description } = req.body;
    if (!title || !date)
        return res.status(400).json({ message: 'title and date are required' });
    const created = await Event_1.default.create({
        organizerId: req.user.id,
        title,
        date: new Date(date),
        ...(location ? { location } : {}),
        ...(description ? { description } : {}),
    });
    const populated = await Event_1.default.findById(created._id).populate('organizerId');
    return res.status(201).json(populated || created);
});
exports.default = router;
//# sourceMappingURL=events.js.map