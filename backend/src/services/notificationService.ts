import Notification from '../models/Notification';
import User from '../models/User';
import { Types } from 'mongoose';

/**
 * Creates a notification for a new Post (Blog/Internship)
 * Logic:
 * 1. Post/Internship created.
 * 2. Find relevant users.
 * 3. Batch insert notifications.
 */

export const createPostNotification = async (post: any) => {
    try {
        // 1. Identify Target Audience
        // If it's a general post, maybe notify followers?
        // For now, let's assume "Intelligent" matching based on category/tags vs User Interests.

        const postTags = post.tags || [];
        const postCategory = post.category || '';

        // Find users who have interests matching tags or category
        // Or users in same department if post is department specific (not in schema yet, assuming general)

        const relevantUsers = await User.find({
            $or: [
                { interests: { $in: postTags } },
                { interests: postCategory } // simple match
            ],
            _id: { $ne: post.authorId } // Don't notify self
        }).select('_id').lean();

        if (relevantUsers.length === 0) return;

        const notifications = relevantUsers.map(u => ({
            userId: u._id,
            type: 'post',
            referenceId: post.id || post._id,
            message: `New post by an alumni in ${postCategory || 'your interest area'}`,
            isRead: false
        }));

        await Notification.insertMany(notifications);
        console.log(`Created ${notifications.length} post notifications.`);

    } catch (error) {
        console.error('Error creating post notification:', error);
    }
};

export const createInternshipNotification = async (internship: any) => {
    try {
        // Logic: Match Internship Skills -> User Skills
        // Logic: Match Internship Domain -> User Interests

        const requiredSkills = internship.skills || [];
        const domain = internship.type || ''; // Assuming 'type' or description holds domain info, schema has 'type', 'title'

        // Simple matching query
        const relevantUsers = await User.find({
            role: 'student', // Only notify students about internships
            $or: [
                { skills: { $in: requiredSkills } },
                { interests: { $regex: domain, $options: 'i' } } // loose match
            ],
            _id: { $ne: internship.postedById }
        }).select('_id').lean();

        const notifications = relevantUsers.map(u => ({
            userId: u._id,
            type: 'internship',
            referenceId: internship.id || internship._id,
            message: `New Internship in ${internship.title} matching your profile`,
            isRead: false
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
            console.log(`Created ${notifications.length} internship notifications.`);
        }

    } catch (error) {
        console.error('Error creating internship notification:', error);
    }
};
