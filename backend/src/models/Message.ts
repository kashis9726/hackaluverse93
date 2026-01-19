import mongoose, { Schema, model, models } from 'mongoose';

const messageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true, index: true }, // Changed from roomId to conversationId for clarity
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Added for fast offline queries

    content: { type: String, default: '' }, // Can be empty if file only
    fileUrl: { type: String },

    type: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'file'],
      required: true,
      default: 'text'
    },

    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
      index: true
    },

    metadata: { type: Map, of: String } // For file size, duration etc
  },
  { timestamps: true }
);

// Compound index for offline sync: "Give me all sent messages for this receiver"
messageSchema.index({ receiverId: 1, status: 1 });

export default models.Message || model('Message', messageSchema);
