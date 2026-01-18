import mongoose, { Schema } from 'mongoose';

const questionSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],

    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  },
  { timestamps: true }
);

const Question = (mongoose.models.Question ? mongoose.models.Question : mongoose.model('Question', questionSchema)) as mongoose.Model<any>;
export default Question;
