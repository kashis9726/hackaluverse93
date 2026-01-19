import type { ObjectId } from 'mongoose';
export declare class ActivityService {
    /**
     * Log an activity (question asked, answer posted, blog created, etc.)
     */
    static logActivity(data: {
        userId: ObjectId;
        type: 'question_asked' | 'answer_posted' | 'blog_created' | 'challenge_created' | 'event_created' | 'user_signup' | 'blog_liked' | 'question_answered';
        title: string;
        description?: string;
        relatedId?: ObjectId;
        relatedType?: 'Question' | 'Answer' | 'Blog' | 'Challenge' | 'Event' | 'User';
        visibility?: 'public' | 'alumni' | 'students' | 'private';
    }): Promise<any>;
    /**
     * Get activities for a user (personalized feed)
     */
    static getUserActivities(userId: ObjectId, limit?: number): Promise<any[]>;
    /**
     * Get activity feed for alumni (see what students are doing + alumni activity)
     */
    static getAlumniActivityFeed(limit?: number): Promise<any[]>;
    /**
     * Get activity feed for students (see what other students and alumni are doing)
     */
    static getStudentActivityFeed(limit?: number): Promise<any[]>;
    /**
     * Get latest questions/answers (real-time updates)
     */
    static getLatestQAndA(limit?: number): Promise<any[]>;
    /**
     * Mark activity as read by a user
     */
    static markActivityAsRead(activityId: ObjectId, userId: ObjectId): Promise<any>;
    /**
     * Get unread activities count for a user
     */
    static getUnreadCount(userId: ObjectId): Promise<number>;
}
//# sourceMappingURL=activityService.d.ts.map