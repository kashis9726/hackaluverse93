import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        // Fetch unread or recent 20
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(20);

        // Count unread
        const unreadCount = await Notification.countDocuments({ userId, isRead: false });

        // FALLBACK: Ensure at least one notification for demo purposes
        if (notifications.length === 0) {
            const demoNotification = {
                _id: 'demo_welcome',
                message: 'Welcome to AluVerse! Complete your profile to get better recommendations.',
                type: 'system',
                isRead: false,
                createdAt: new Date()
            };
            res.json({
                notifications: [demoNotification],
                unreadCount: 1
            });
            return;
        }

        res.json({
            notifications,
            unreadCount
        });

    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: 'Server error fetching notifications' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { notificationIds } = req.body; // Array of IDs

        if (!Array.isArray(notificationIds)) {
            // Mark all as read if no specific IDs provided? Or just error.
            // Let's assume mark all as read if empty, or single.
            // Implementation: Mark specific ones.
            return res.status(400).json({ message: 'Invalid payload' });
        }

        await Notification.updateMany(
            { _id: { $in: notificationIds }, userId },
            { $set: { isRead: true } }
        );

        res.json({ message: 'Marked as read' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
