import mongoose, { Schema } from 'mongoose';

const submissionSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    attachments: [{ type: String }],
    createdAt: { type: Date, default: () => new Date() },
    status: { type: String },
  },
  { _id: false }
);

const challengeSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String, required: true },
    description: { type: String },
    prize: { type: String },
    deadline: { type: Date },

    submissions: [submissionSchema],
  },
  { timestamps: true }
);

const Challenge = (mongoose.models.Challenge ? mongoose.models.Challenge : mongoose.model('Challenge', challengeSchema)) as mongoose.Model<any>;
export default Challenge;
