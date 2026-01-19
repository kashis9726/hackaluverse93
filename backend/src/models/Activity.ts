import mongoose, { Schema } from 'mongoose';

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['question_asked', 'answer_posted', 'blog_created', 'challenge_created', 'event_created', 'user_signup', 'blog_liked', 'question_answered'],
      required: true
    },
    title: { type: String, required: true },
    description: { type: String },
    
    // Reference to the related content
    relatedId: { type: Schema.Types.ObjectId },
    relatedType: {
      type: String,
      enum: ['Question', 'Answer', 'Blog', 'Challenge', 'Event', 'User'],
    },
    
    // Visibility: who can see this activity
    visibility: {
      type: String,
      enum: ['public', 'alumni', 'students', 'private'],
      default: 'public'
    },
    
    // For notifications
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Index for efficient querying
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ visibility: 1, createdAt: -1 });

const Activity = (mongoose.models.Activity as mongoose.Model<any>) || mongoose.model('Activity', activitySchema);
export default Activity;
