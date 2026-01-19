import mongoose, { Schema, model, models } from 'mongoose';

const embeddedMessageSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: () => new Date() },
    type: { type: String, enum: ['text', 'file'], required: true },
  },
  { _id: false }
);

const chatRoomSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    type: { type: String, default: 'direct' },
    lastMessageAt: { type: Date, default: Date.now },
    messages: [embeddedMessageSchema], // Deprecated but kept for legacy
  },
  { timestamps: true }
);

// DEPRECATED: We now use conversationId directly on Messages
export default models.ChatRoom || model('ChatRoom', chatRoomSchema);
