import mongoose, { Schema } from 'mongoose';

const answerSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },

    content: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Answer = (mongoose.models.Answer ? mongoose.models.Answer : mongoose.model('Answer', answerSchema)) as mongoose.Model<any>;
export default Answer;
