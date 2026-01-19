import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import Connection from './models/Connection';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const fixConnections = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);

        console.log('Updating all connections without status to "accepted"...');

        const result = await Connection.updateMany(
            { status: { $exists: false } },
            { $set: { status: 'accepted' } }
        );

        console.log(`Updated ${result.modifiedCount} connections.`);

        // Also update any with undefined/null
        const result2 = await Connection.updateMany(
            { $or: [{ status: null }, { status: undefined }] },
            { $set: { status: 'accepted' } }
        );

        console.log(`Updated ${result2.modifiedCount} more connections with null/undefined.`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

fixConnections();
