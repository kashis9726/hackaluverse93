/**
 * Create Admin User Script
 * Creates an admin user with the email from .env
 */
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import crypto from 'crypto';
import User from './models/User';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const hashPassword = (password: string): string => {
    const iterations = 120000;
    const salt = crypto.randomBytes(16);
    const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
    return `pbkdf2$${iterations}$${salt.toString('base64')}$${derivedKey.toString('base64')}`;
};

const newToken = () => crypto.randomBytes(32).toString('hex');

async function createAdmin() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        const adminEmail = process.env.ADMIN_EMAIL;

        if (!mongoUri) {
            console.error('❌ MONGODB_URI not set in .env file');
            process.exit(1);
        }

        if (!adminEmail) {
            console.error('❌ ADMIN_EMAIL not set in .env file');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('✓ Connected to MongoDB');

        // Check if admin already exists
        const existing = await User.findOne({ email: adminEmail.toLowerCase() });
        if (existing) {
            console.log(`ℹ️  Admin user already exists: ${adminEmail}`);

            // Update to admin role if not already
            if (existing.role !== 'admin') {
                existing.role = 'admin';
                await existing.save();
                console.log('✓ Updated existing user to admin role');
            }
        } else {
            // Create new admin user
            const admin = await User.create({
                name: 'Admin User',
                email: adminEmail.toLowerCase(),
                role: 'admin',
                passwordHash: hashPassword('admin123'), // Default password
                authToken: newToken(),
                profileCompleted: true,
                profileVisible: true,
                bio: 'System Administrator',
                isVerified: true,
            });

            console.log(`✅ Admin user created: ${adminEmail}`);
            console.log(`   Default password: admin123`);
            console.log(`   ⚠️  Please change this password after first login!`);
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

void createAdmin();
