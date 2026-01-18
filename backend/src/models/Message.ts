import mongoose, { Schema, model, models } from 'mongoose';

const messageSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    content: { type: String, required: true },
    timestamp: { type: Date, default: () => new Date() },
    type: { type: String, enum: ['text', 'file'], required: true },
  },
  { timestamps: true }
);

export default models.Message || model('Message', messageSchema);
