import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    role: { type: String, enum: ['student', 'alumni', 'admin'], required: true },

    passwordHash: { type: String },
    authToken: { type: String, index: true },

    profileCompleted: { type: Boolean, default: false },

    profileImage: { type: String },
    department: { type: String },
    year: { type: String },
    graduationYear: { type: Number },
    skills: { type: [{ type: String }], default: [] },
    interests: { type: [{ type: String }], default: [] },
    projects: { type: [{ type: String }], default: [] },
    company: { type: String },
    position: { type: String },
    bio: { type: String },
    startup: { type: String },

    branch: { type: String },

    domain: { type: String },
    yearsOfExperience: { type: Number },
    availability: { type: String, enum: ['Busy', 'Limited', 'Open'] },
    capabilities: { type: [{ type: String }], default: [] },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    personalWebsite: { type: String },

    points: { type: Number, default: 0 },
    badges: { type: [{ type: String }], default: [] },

    isVerified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date },
    
    // Public profile visibility flag
    profileVisible: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Add virtual 'id' field that returns _id for consistency
userSchema.virtual('id').get(function() {
  return this._id.toString();
});

const User = (mongoose.models.User ? mongoose.models.User : mongoose.model('User', userSchema)) as mongoose.Model<any>;
export default User;
