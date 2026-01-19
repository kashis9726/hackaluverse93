import mongoose, { Schema } from 'mongoose';

const searchHistorySchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        query: { type: String },
        searchedProfileId: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional, if they clicked a specific user
        searchedType: { type: String, enum: ['keyword', 'profile'], default: 'keyword' }
    },
    { timestamps: true }
);

searchHistorySchema.index({ userId: 1, createdAt: -1 });

const SearchHistory = (mongoose.models.SearchHistory as mongoose.Model<any>) || mongoose.model('SearchHistory', searchHistorySchema);
export default SearchHistory;
