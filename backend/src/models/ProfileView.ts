import mongoose, { Schema } from 'mongoose';

const profileViewSchema = new Schema(
    {
        viewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        profileId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

profileViewSchema.index({ viewerId: 1, profileId: 1, createdAt: -1 }); // To check if viewed recently
profileViewSchema.index({ profileId: 1 }); // To count total views

const ProfileView = (mongoose.models.ProfileView as mongoose.Model<any>) || mongoose.model('ProfileView', profileViewSchema);
export default ProfileView;
