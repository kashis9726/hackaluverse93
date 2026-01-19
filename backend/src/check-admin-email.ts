import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
