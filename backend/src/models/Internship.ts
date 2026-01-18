import mongoose, { Schema } from 'mongoose';

const internshipSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true },
    postedById: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String, required: true },
    company: { type: String },
    location: { type: String },
    stipend: { type: String },
    type: { type: String },

    skills: [{ type: String }],
    description: { type: String },

    applicants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Internship = (mongoose.models.Internship as mongoose.Model<any>) || mongoose.model('Internship', internshipSchema);
export default Internship;
