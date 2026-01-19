import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient
        type: {
            type: String,
            enum: ['post', 'internship', 'connection', 'system'],
            required: true
        },
        referenceId: { type: String, required: true }, // ID of the Post, Internship, or User
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

const Notification = (mongoose.models.Notification as mongoose.Model<any>) || mongoose.model('Notification', notificationSchema);
export default Notification;
