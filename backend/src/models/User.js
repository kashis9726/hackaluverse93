"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
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
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
// Add virtual 'id' field that returns _id for consistency
userSchema.virtual('id').get(function () {
    return this._id.toString();
});
const User = (mongoose_1.default.models.User ? mongoose_1.default.models.User : mongoose_1.default.model('User', userSchema));
exports.default = User;
//# sourceMappingURL=User.js.map