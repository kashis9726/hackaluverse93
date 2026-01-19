import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import Connection from './models/Connection';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const forceUpdateAll = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);

        console.log('Force updating ALL connections to "accepted"...');

        // Get all connections first
        const allConnections = await Connection.find({});
        console.log(`Found ${allConnections.length} connections.`);

        // Update each one
        for (const conn of allConnections) {
            console.log(`Connection ${conn._id}: status = ${conn.status}`);
            conn.status = 'accepted';
            await conn.save();
            console.log(`  -> Updated to: ${conn.status}`);
        }

        console.log('Done!');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

forceUpdateAll();
