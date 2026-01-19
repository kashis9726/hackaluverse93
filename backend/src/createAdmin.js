"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create Admin User Script
 * Creates an admin user with the email from .env
 */
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const hashPassword = (password) => {
    const iterations = 120000;
    const salt = crypto_1.default.randomBytes(16);
    const derivedKey = crypto_1.default.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
    return `pbkdf2$${iterations}$${salt.toString('base64')}$${derivedKey.toString('base64')}`;
};
const newToken = () => crypto_1.default.randomBytes(32).toString('hex');
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
        await mongoose_1.default.connect(mongoUri);
        console.log('✓ Connected to MongoDB');
        // Check if admin already exists
        const existing = await User_1.default.findOne({ email: adminEmail.toLowerCase() });
        if (existing) {
            console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
            // Update to admin role if not already
            if (existing.role !== 'admin') {
                existing.role = 'admin';
                await existing.save();
                console.log('✓ Updated existing user to admin role');
            }
        }
        else {
            // Create new admin user
            const admin = await User_1.default.create({
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
        await mongoose_1.default.connection.close();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
void createAdmin();
//# sourceMappingURL=createAdmin.js.map