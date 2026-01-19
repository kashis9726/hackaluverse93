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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const Notification_1 = __importDefault(require("../models/Notification"));
const recommendationController = __importStar(require("../controllers/recommendationController"));
const notificationService = __importStar(require("../services/notificationService"));
// Mock Express Request/Response
const mockReq = (userId) => ({
    user: { id: userId }
});
const mockRes = () => {
    const res = {};
    res.status = (code) => {
        console.log(`Response Status: ${code}`);
        return res;
    };
    res.json = (data) => {
        console.log('Response JSON:', JSON.stringify(data, null, 2));
        return res;
    };
    return res;
};
const runVerification = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI not set');
            return;
        }
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        // 1. Create Test Users
        const student = await User_1.default.create({
            name: 'Test Student',
            email: `student_${Date.now()}@test.com`,
            role: 'student',
            department: 'Computer Science',
            interests: ['AI', 'React']
        });
        const alumni = await User_1.default.create({
            name: 'Test Alumni',
            email: `alumni_${Date.now()}@test.com`,
            role: 'alumni',
            department: 'Computer Science',
            domain: 'AI Research',
            company: 'TechCorp',
            skills: ['AI', 'Python']
        });
        console.log(`Created Users: Student ${student._id}, Alumni ${alumni._id}`);
        // 2. Test Recommendation Logic (Should match based on Dept & Interest)
        console.log('\n--- Testing Recommendations ---');
        await recommendationController.getRecommendedAlumni(mockReq(student._id.toString()), mockRes());
        // 3. Test Notification Logic
        console.log('\n--- Testing Notification ---');
        const internship = {
            _id: new mongoose_1.default.Types.ObjectId(),
            postedById: alumni._id,
            title: 'AI Researcher Intern',
            skills: ['AI'],
            type: 'AI Research'
        };
        await notificationService.createInternshipNotification(internship);
        // Check if notification exists
        const notif = await Notification_1.default.findOne({ userId: student._id });
        if (notif) {
            console.log('Notification Created Successfully:', notif.message);
        }
        else {
            console.error('Notification Creation Failed');
        }
        // Cleanup
        await User_1.default.deleteMany({ _id: { $in: [student._id, alumni._id] } });
        await Notification_1.default.deleteMany({ userId: student._id });
        console.log('Verification Complete');
        process.exit(0);
    }
    catch (error) {
        console.error('Verification Failed', error);
        process.exit(1);
    }
};
runVerification();
//# sourceMappingURL=verify-features.js.map