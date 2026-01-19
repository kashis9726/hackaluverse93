import mongoose, { Schema } from 'mongoose';

const connectionSchema = new Schema(
  {
    followerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followingId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness and fast lookups
connectionSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Connection = (mongoose.models.Connection as mongoose.Model<any>) || mongoose.model('Connection', connectionSchema);
export default Connection;
