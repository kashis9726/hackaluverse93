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
    messages: [embeddedMessageSchema],
  },
  { timestamps: true }
);

export default models.ChatRoom || model('ChatRoom', chatRoomSchema);
