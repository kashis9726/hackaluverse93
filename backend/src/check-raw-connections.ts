import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const checkRawData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);

        const db = mongoose.connection.db;
        const connectionsCollection = db.collection('connections');

        const allConnections = await connectionsCollection.find({}).toArray();

        console.log('Raw MongoDB data:');
        console.log(JSON.stringify(allConnections, null, 2));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

checkRawData();
