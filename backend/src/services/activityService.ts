import Activity from '../models/Activity';
import type { ObjectId } from 'mongoose';

export class ActivityService {
  /**
   * Log an activity (question asked, answer posted, blog created, etc.)
   */
  static async logActivity(data: {
    userId: ObjectId;
    type: 'question_asked' | 'answer_posted' | 'blog_created' | 'challenge_created' | 'event_created' | 'user_signup' | 'blog_liked' | 'question_answered';
    title: string;
    description?: string;
    relatedId?: ObjectId;
    relatedType?: 'Question' | 'Answer' | 'Blog' | 'Challenge' | 'Event' | 'User';
    visibility?: 'public' | 'alumni' | 'students' | 'private';
  }) {
    try {
      const activity = await Activity.create({
        userId: data.userId,
        type: data.type,
        title: data.title,
        description: data.description,
        relatedId: data.relatedId,
        relatedType: data.relatedType,
        visibility: data.visibility || 'public',
      });

      return activity.populate('userId', 'name email profileImage role');
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }

  /**
   * Get activities for a user (personalized feed)
   */
  static async getUserActivities(userId: ObjectId, limit: number = 20) {
    try {
      return await Activity.find({ userId })
        .populate('userId', 'name email profileImage role')
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw error;
    }
  }

  /**
   * Get activity feed for alumni (see what students are doing + alumni activity)
   */
  static async getAlumniActivityFeed(limit: number = 50) {
    try {
      return await Activity.find({
        $or: [
          { visibility: 'public' },
          { visibility: 'alumni' },
          { type: { $in: ['question_asked', 'answer_posted', 'blog_created', 'user_signup'] } }
        ]
      })
        .populate('userId', 'name email profileImage role')
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error fetching alumni feed:', error);
      throw error;
    }
  }

  /**
   * Get activity feed for students (see what other students and alumni are doing)
   */
  static async getStudentActivityFeed(limit: number = 50) {
    try {
      return await Activity.find({
        $or: [
          { visibility: 'public' },
          { visibility: 'students' },
          { type: { $in: ['blog_created', 'event_created', 'challenge_created'] } }
        ]
      })
        .populate('userId', 'name email profileImage role')
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error fetching student feed:', error);
      throw error;
    }
  }

  /**
   * Get latest questions/answers (real-time updates)
   */
  static async getLatestQAndA(limit: number = 20) {
    try {
      return await Activity.find({
        type: { $in: ['question_asked', 'answer_posted'] },
        visibility: { $in: ['public', 'alumni'] }
      })
        .populate('userId', 'name email profileImage role')
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error fetching Q&A:', error);
      throw error;
    }
  }

  /**
   * Mark activity as read by a user
   */
  static async markActivityAsRead(activityId: ObjectId, userId: ObjectId) {
    try {
      return await Activity.findByIdAndUpdate(
        activityId,
        { $addToSet: { readBy: userId } },
        { new: true }
      ).populate('userId', 'name email profileImage role');
    } catch (error) {
      console.error('Error marking activity as read:', error);
      throw error;
    }
  }

  /**
   * Get unread activities count for a user
   */
  static async getUnreadCount(userId: ObjectId) {
    try {
      return await Activity.countDocuments({
        $or: [
          { visibility: 'public' },
          { visibility: 'alumni' },
        ],
        readBy: { $nin: [userId] }
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}
