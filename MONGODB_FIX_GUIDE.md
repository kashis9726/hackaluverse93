# MongoDB Data Fix & User Data Visibility Guide

## Issues Fixed ✓

### 1. **MongoDB Compass Not Showing Entries**
- **Root Cause**: The User model had a custom `id` field that wasn't being saved properly. MongoDB uses `_id` internally.
- **Solution**: Removed the custom `id` field and added a virtual field that maps to MongoDB's `_id`

### 2. **User Data Visibility**
- **Issue**: User profiles weren't visible to other users
- **Solution**: 
  - Added `profileVisible` flag to User model (default: false initially, true after profile completion)
  - Updated `/api/users` route to return only visible, profile-completed users
  - Added profile visibility toggle endpoint: `PATCH /api/users/:userId/visibility`

### 3. **Database Query Issues**
- Fixed email lookups to use `.toLowerCase()` for case-insensitive queries
- Fixed user lookups to properly use MongoDB's `_id` field
- Added proper error handling and HTTP status codes

---

## How to Populate Real User Data

### Step 1: Install Dependencies (if not already done)
```bash
cd backend
npm install
```

### Step 2: Run the Seed Script
```bash
npm run seed
```

Or if you prefer using ts-node directly:
```bash
npx ts-node src/seeds.ts
```

### Step 3: Verify in MongoDB Compass
1. Open MongoDB Compass
2. Connect to: `mongodb+srv://Kashis:Kashis%4093doli@clusterkashis.n0f4zdo.mongodb.net/aluverse`
3. Navigate to the `aluverse` database
4. Click on the `users` collection
5. You should now see **9 test users** (5 students + 4 alumni)

---

## Test User Accounts

### Students
- **Email**: kashish@ldce.ac.in | **Password**: password123
- **Email**: priya@ldce.ac.in | **Password**: password123
- **Email**: arjun@ldce.ac.in | **Password**: password123
- **Email**: neha@ldce.ac.in | **Password**: password123
- **Email**: rohan@ldce.ac.in | **Password**: password123

### Alumni (Mentors)
- **Email**: rahul@ldce.ac.in | **Password**: password123
- **Email**: anjali@ldce.ac.in | **Password**: password123
- **Email**: vikram@ldce.ac.in | **Password**: password123
- **Email**: divya@ldce.ac.in | **Password**: password123

---

## API Changes

### Get All Visible Users (Authenticated)
```
GET /api/users
Authorization: Bearer {token}
```
Returns all users with `profileCompleted: true` and `profileVisible: true`

### Get Specific User Profile
```
GET /api/users/:userId
```
Returns user profile if it's publicly visible

### Update User Profile (Sets profileVisible: true)
```
PUT /api/users/profile
Authorization: Bearer {token}
Body: {
  year: "3rd Year",
  branch: "Computer Science",
  skills: ["JavaScript", "React"],
  interests: ["Web Dev"],
  // ... other role-specific fields
}
```

### Toggle Profile Visibility
```
PATCH /api/users/:userId/visibility
Authorization: Bearer {token}
Body: {
  visible: true  // or false
}
```

---

## What's Changed in Backend Code

### Models/User.ts
✅ Removed custom `id` field  
✅ Added virtual `id` field mapping to `_id`  
✅ Added `profileVisible` field  
✅ Added `isVerified` and `isOnline` default values  
✅ Added proper schema options for virtual fields  

### Routes/users.ts
✅ Added `sanitizePublicUser()` helper to hide sensitive data  
✅ Fixed GET `/` to filter by `profileCompleted` and `profileVisible`  
✅ Added GET `/:userId` for individual profile access  
✅ Added PATCH `/:userId/visibility` for profile visibility control  
✅ Fixed all MongoDB queries to use `_id`  
✅ Added proper error handling  

### Routes/auth.ts
✅ Fixed email lookups with `.toLowerCase()`  
✅ Added `profileVisible: false` for new signups  
✅ Improved error handling with duplicate key errors  

### seeds.ts (NEW)
✅ Created comprehensive seed script with 9 realistic test users  
✅ Includes student and alumni profiles with complete data  

---

## Troubleshooting

### "Database not connected" error
- Check your `.env` file has correct `MONGODB_URI`
- Ensure your MongoDB connection string is valid
- Check internet connection

### "User already exists" after seeding
Run this to clear old data:
```bash
npx ts-node -e "
import mongoose from 'mongoose';
import User from './src/models/User';
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI!).then(() => {
  User.deleteMany({}).then(() => {
    console.log('Users cleared');
    process.exit(0);
  });
});
"
```

### MongoDB Compass still shows no data
- Refresh the browser/compass
- Click the "Reload" button in MongoDB Compass
- Check if documents actually exist: `db.users.count()`

---

## Next Steps

1. **Test the login**: Try logging in with one of the test accounts
2. **View user directory**: After profile setup, users should appear in the directory
3. **Test visibility**: Toggle profile visibility on/off
4. **View other profiles**: Click on users in the directory to see their profiles

---

## Questions or Issues?

If you encounter any problems:
1. Check the backend console logs
2. Verify MongoDB connection in `.env`
3. Run the seed script again
4. Check MongoDB Compass to see if data exists
