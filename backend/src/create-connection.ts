import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import User from './models/User';
import Connection from './models/Connection';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const createConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);

        const email1 = 'anjali@ldce.ac.in';
        const email2 = 'rahul@ldce.ac.in';

        const u1 = await User.findOne({ email: email1 });
        const u2 = await User.findOne({ email: email2 });

        if (!u1 || !u2) {
            console.log('Users not found');
            return;
        }

        console.log(`Creating connection between ${u1.name} and ${u2.name}...`);

        // Check existing
        let conn = await Connection.findOne({
            $or: [
                { followerId: u1._id, followingId: u2._id },
                { followerId: u2._id, followingId: u1._id }
            ]
        });

        if (conn) {
            console.log(`Connection already exists. Status: ${conn.status}`);
            conn.status = 'accepted';
            await conn.save();
            console.log('Updated to ACCEPTED.');
        } else {
            conn = await Connection.create({
                followerId: u1._id,
                followingId: u2._id,
                status: 'accepted'
            });
            console.log('Created NEW accepted connection.');
        }

        console.log(`Connection ID: ${conn._id}`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

createConnection();
