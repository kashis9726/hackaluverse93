

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import User from '../models/User';
import Connection from '../models/Connection';
import SearchHistory from '../models/SearchHistory';
import Notification from '../models/Notification';
import * as recommendationController from '../controllers/recommendationController';
import * as notificationService from '../services/notificationService';

// Mock Express Request/Response
const mockReq = (userId: string) => ({
    user: { id: userId }
} as any);

const mockRes = () => {
    const res: any = {};
    res.status = (code: number) => {
        console.log(`Response Status: ${code}`);
        return res;
    };
    res.json = (data: any) => {
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
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // 1. Create Test Users
        const student = await User.create({
            name: 'Test Student',
            email: `student_${Date.now()}@test.com`,
            role: 'student',
            department: 'Computer Science',
            interests: ['AI', 'React']
        });

        const alumni = await User.create({
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
            _id: new mongoose.Types.ObjectId(),
            postedById: alumni._id,
            title: 'AI Researcher Intern',
            skills: ['AI'],
            type: 'AI Research'
        };

        await notificationService.createInternshipNotification(internship);

        // Check if notification exists
        const notif = await Notification.findOne({ userId: student._id });
        if (notif) {
            console.log('Notification Created Successfully:', notif.message);
        } else {
            console.error('Notification Creation Failed');
        }

        // Cleanup
        await User.deleteMany({ _id: { $in: [student._id, alumni._id] } });
        await Notification.deleteMany({ userId: student._id });

        console.log('Verification Complete');
        process.exit(0);

    } catch (error) {
        console.error('Verification Failed', error);
        process.exit(1);
    }
};

runVerification();
