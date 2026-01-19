import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import Connection from '../models/Connection';
import Notification from '../models/Notification';
import User from '../models/User';
import { logError } from '../utils'; // Keeping import just in case, but will use console.error

const router = Router();

// GET all accepted connections for current user
router.get('/', requireAuth, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const connections = await Connection.find({
            $or: [
                { followerId: userId, status: 'accepted' },
                { followingId: userId, status: 'accepted' }
            ]
        });

        // Map to just the OTHER user's ID
        const connectedIds = connections.map(c =>
            c.followerId.toString() === userId ? c.followingId.toString() : c.followerId.toString()
        );

        res.json({ connectedIds });
    } catch (error) {
        console.error('get connections error', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET status with a specific user
router.get('/status/:userId', requireAuth, async (req: any, res) => {
    try {
        const currentUserId = req.user.id;
        const targetUserId = req.params.userId;

        const connection = await Connection.findOne({
            $or: [
                { followerId: currentUserId, followingId: targetUserId },
                { followerId: targetUserId, followingId: currentUserId }
            ]
        });

        if (!connection) {
            return res.json({ status: 'none' });
        }

        if (connection.status === 'accepted') {
            return res.json({ status: 'accepted' });
        }

        // Pending: Check who initiated
        if (connection.followerId.toString() === currentUserId) {
            return res.json({ status: 'pending_sent' });
        } else {
            return res.json({ status: 'pending_received', requestId: connection._id });
        }

    } catch (error) {
        console.error('get connection status error', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST request connection
router.post('/request', requireAuth, async (req: any, res) => {
    try {
        const followerId = req.user.id; // me
        const { followingId } = req.body; // target

        if (followerId === followingId) {
            return res.status(400).json({ message: 'Cannot connect with yourself' });
        }

        const existing = await Connection.findOne({
            $or: [
                { followerId, followingId },
                { followerId: followingId, followingId: followerId }
            ]
        });

        if (existing) {
            return res.status(400).json({ message: 'Connection already exists or pending' });
        }

        await Connection.create({
            followerId,
            followingId,
            status: 'pending'
        });

        // Notify target
        const sender = await User.findById(followerId).select('name');
        await Notification.create({
            userId: followingId,
            type: 'connection',
            referenceId: followerId, // Link to sender's profile
            message: `${sender?.name || 'Someone'} sent you a connection request`,
            isRead: false
        });

        res.json({ message: 'Request sent' });
    } catch (error) {
        console.error('request connection error', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST accept connection
router.post('/accept', requireAuth, async (req: any, res) => {
    try {
        const userId = req.user.id; // me (acceptor)
        const { requesterId } = req.body; // the one who sent request

        const connection = await Connection.findOne({
            followerId: requesterId,
            followingId: userId,
            status: 'pending'
        });

        if (!connection) {
            return res.status(404).json({ message: 'Request not found' });
        }

        connection.status = 'accepted';
        await connection.save();

        // Notify requester
        const acceptor = await User.findById(userId).select('name');
        await Notification.create({
            userId: requesterId,
            type: 'connection',
            referenceId: userId,
            message: `${acceptor?.name || 'Someone'} accepted your connection request`,
            isRead: false
        });

        res.json({ message: 'Connection accepted' });
    } catch (error) {
        console.error('accept connection error', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
