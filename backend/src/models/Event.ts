import mongoose, { Schema } from 'mongoose';

const eventSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true },
    organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String },
    type: { type: String, enum: ['seminar', 'webinar', 'reunion', 'workshop'], default: 'webinar' },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    maxAttendees: { type: Number },
  },
  { timestamps: true }
);

const Event = (mongoose.models.Event as mongoose.Model<any>) || mongoose.model('Event', eventSchema);
export default Event;
