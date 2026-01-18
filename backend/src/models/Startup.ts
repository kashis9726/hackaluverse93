import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const startupSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String, required: true },
    tagline: { type: String },
    stage: { type: String, enum: ['concept', 'prototype', 'mvp'] },

    problem: { type: String },
    solution: { type: String },
    progress: { type: String },
    fundingNeeded: { type: String },

    attachments: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Startup = (mongoose.models.Startup ? mongoose.models.Startup : mongoose.model('Startup', startupSchema)) as mongoose.Model<any>;
export default Startup;
