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

const blogSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    image: { type: String },

    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],

    type: { type: String, enum: ['post', 'job', 'achievement'], required: true },

    category: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Blog = (mongoose.models.Blog as mongoose.Model<any>) || mongoose.model('Blog', blogSchema);
export default Blog;
