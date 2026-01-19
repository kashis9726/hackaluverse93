import express, { Request, Response } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import Message from '../models/Message';
import ChatRoom from '../models/ChatRoom';

const router = express.Router();

interface AuthRequest extends Request {
    user?: { id: string };
}

// Get message history with a specific user
router.get('/history/:otherUserId', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { otherUserId } = req.params;

        // 1. Find the conversation ID
        const room = await ChatRoom.findOne({
            participants: { $all: [userId, otherUserId] }
        });

        if (!room) {
            res.json([]); // No history
            return;
        }

        // 2. Fetch messages
        const messages = await Message.find({
            conversationId: room._id
        })
            .sort({ createdAt: 1 })
            .limit(100); // Limit for MVP

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history' });
    }
});

export default router;
