# Backend Fixes Summary

## 🐛 Bugs Fixed

### Bug #1: MongoDB Data Not Showing in Compass
**Problem**: User entries were not appearing in MongoDB Compass even after signup

**Root Cause**: 
- The User model had a custom `id` field that was defined as a Mongoose schema field
- MongoDB internally uses `_id` for document IDs, so the custom field wasn't being used properly for queries
- This caused all lookups to fail silently

**Solution**:
- Removed the custom `id` field from the schema
- Added a virtual field `id` that returns `_id.toString()` for backward compatibility
- This ensures all queries work with MongoDB's native `_id` field

**Files Changed**: [backend/src/models/User.ts](backend/src/models/User.ts)

---

### Bug #2: User Data Not Visible to Other Users  
**Problem**: 
- No mechanism to view other users' profiles
- Users couldn't discover students or alumni
- Directory feature wasn't working properly

**Solution**:
- Added `profileVisible` boolean field (default: false on signup, true after profile completion)
- Updated `/api/users` endpoint to filter by `profileCompleted` and `profileVisible`
- Added new `GET /api/users/:userId` endpoint to view individual profiles
- Added `PATCH /api/users/:userId/visibility` endpoint to control profile visibility
- Added `sanitizePublicUser()` helper to hide sensitive data when displaying profiles

**Files Changed**: 
- [backend/src/models/User.ts](backend/src/models/User.ts)
- [backend/src/routes/users.ts](backend/src/routes/users.ts)

---

### Bug #3: Email Query Issues
**Problem**: Email queries were case-sensitive, could cause duplicates

**Solution**:
- Added `.toLowerCase()` to all email fields in queries
- Ensured consistent email storage in lowercase
- Fixed in both signup and login routes

**Files Changed**: [backend/src/routes/auth.ts](backend/src/routes/auth.ts)

---

## ✨ New Features Added

### 1. User Profile Visibility Control
- Users can toggle their profile visibility
- Incomplete profiles are always hidden
- Admin can control visibility of any profile

### 2. Seed Script for Test Data
- Created `seeds.ts` with realistic test users
- 5 Student profiles with skills, projects, interests
- 4 Alumni/Mentor profiles with company, position, experience
- Easy one-command seeding: `npm run seed`

**File**: [backend/src/seeds.ts](backend/src/seeds.ts)

---

## 📊 Model Changes

### User Schema Updates
```typescript
// REMOVED
id: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true }

// ADDED
profileVisible: { type: Boolean, default: true }
isVerified: { type: Boolean, default: false }
isOnline: { type: Boolean, default: false }

// VIRTUAL (for backward compatibility)
userSchema.virtual('id').get(function() {
  return this._id.toString();
});
```

---

## 🛠️ API Endpoint Changes

### Modified Endpoints

**GET /api/users** - Get all visible users (protected)
```
OLD: Returns all users (no filtering)
NEW: Returns users with profileCompleted=true AND profileVisible=true
```

**PUT /api/users/profile** - Update user profile
```
OLD: Sets profileCompleted=true
NEW: Sets profileCompleted=true AND profileVisible=true
```

### New Endpoints

**GET /api/users/:userId** - Get individual user profile (public)
```
Status: 200 - User profile
Status: 404 - User not found
Status: 403 - Profile not visible
```

**PATCH /api/users/:userId/visibility** - Toggle profile visibility (auth required)
```
Body: { visible: boolean }
Status: 200 - Profile updated
Status: 403 - Unauthorized
Status: 404 - User not found
```

---

## 🚀 How to Use

### Rebuild Backend (TypeScript Compilation)
```bash
cd backend
npm run build
```

### Run Seed Script
```bash
cd backend
npm run seed
```

This will:
1. Connect to MongoDB
2. Clear existing users
3. Create 9 test users (5 students + 4 alumni)
4. Show success summary

### Verify in MongoDB Compass
1. Open MongoDB Compass
2. Connect to the cluster
3. Navigate to `aluverse` database → `users` collection
4. You should see 9 documents with all user data

### Test the APIs

**Login as a student**:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "kashish@ldce.ac.in",
    "role": "student",
    "password": "password123"
  }'
```

**View user directory** (use token from login):
```bash
curl http://localhost:4000/api/users \
  -H "Authorization: Bearer {token}"
```

**View specific user profile**:
```bash
curl http://localhost:4000/api/users/{userId}
```

---

## 📝 Files Modified/Created

| File | Change | Type |
|------|--------|------|
| `backend/src/models/User.ts` | Fixed schema, added profileVisible, removed broken id field | Modified |
| `backend/src/routes/users.ts` | Complete rewrite with filtering, visibility control, new endpoints | Modified |
| `backend/src/routes/auth.ts` | Fixed email queries, added case-insensitive lookups, error handling | Modified |
| `backend/src/seeds.ts` | **NEW** - Seed script with 9 test users | Created |
| `backend/package.json` | Added `seed` script | Modified |
| `MONGODB_FIX_GUIDE.md` | **NEW** - Complete guide with test accounts and troubleshooting | Created |

---

## ✅ Testing Checklist

- [ ] Run `npm run seed` successfully
- [ ] See 9 users in MongoDB Compass
- [ ] Login with test account works
- [ ] View user directory returns visible profiles
- [ ] Click on profile in UI shows user details
- [ ] Complete profile sets profileVisible=true
- [ ] Can toggle profile visibility
- [ ] Other users can see public profiles

---

## 🔐 Security Notes

- Sensitive fields (passwordHash, authToken) are removed from API responses
- Email lookups are case-insensitive to prevent duplicates
- Profile visibility can only be toggled by profile owner or admin
- Incomplete profiles are never visible to other users

---

## 🎯 Next Steps

1. **Run the seed script**: `npm run seed`
2. **Verify data in MongoDB Compass**: Check the users collection
3. **Test login**: Try one of the test accounts
4. **Test directory**: View all visible user profiles
5. **Test profile visibility**: Toggle on/off

Your MongoDB data should now be properly stored and visible! 🎉
