import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import User from './models/User';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const verify = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected.');

        const email = 'anjali@ldce.ac.in';
        console.log(`Searching for user: ${email}`);

        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User NOT FOUND in database.');
        } else {
            console.log('✅ User FOUND:');
            console.log(`   ID: ${user._id}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   PasswordHash length: ${user.passwordHash?.length}`);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

verify();
