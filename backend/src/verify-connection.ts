import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import User from './models/User';
import Connection from './models/Connection';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);

        const email1 = 'anjali@ldce.ac.in'; // "Student" in user terms (or Alum in DB)
        const email2 = 'rahul@ldce.ac.in';

        const u1 = await User.findOne({ email: email1 });
        const u2 = await User.findOne({ email: email2 });

        if (!u1 || !u2) {
            console.log('Users not found');
            return;
        }

        console.log(`Checking connection between ${u1.name} (${u1._id}) and ${u2.name} (${u2._id})...`);

        const conn = await Connection.findOne({
            $or: [
                { followerId: u1._id, followingId: u2._id },
                { followerId: u2._id, followingId: u1._id }
            ]
        });

        let output = '';
        if (!conn) {
            output = '❌ NO CONNECTION found.';
            console.log(output);
        } else {
            output = `✅ Connection FOUND:\nID: ${conn._id}\nStatus: ${conn.status}\nFollower: ${conn.followerId}\nFollowing: ${conn.followingId}`;
            console.log(output);
        }

        const fs = require('fs');
        fs.writeFileSync('connection-status.txt', output);


    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

verify();
