# Quick Start - MongoDB Fixes & User Data

## 🚀 Get Started in 2 Steps

### Step 1: Seed the Database
```bash
cd backend
npm run seed
```

### Step 2: Verify in MongoDB Compass
1. Open MongoDB Compass
2. You should now see **9 users** in the `users` collection
3. Each user has complete profile data (name, email, skills, company, etc.)

---

## 📋 Test User Accounts

| Email | Role | Password | Company/Year |
|-------|------|----------|--------------|
| kashish@ldce.ac.in | Student | password123 | 3rd Year CS |
| priya@ldce.ac.in | Student | password123 | 2nd Year IT |
| arjun@ldce.ac.in | Student | password123 | 3rd Year CS |
| neha@ldce.ac.in | Student | password123 | 1st Year ECE |
| rohan@ldce.ac.in | Student | password123 | 2nd Year CS |
| rahul@ldce.ac.in | Alumni | password123 | Google Senior Eng |
| anjali@ldce.ac.in | Alumni | password123 | Microsoft PM |
| vikram@ldce.ac.in | Alumni | password123 | Startup CTO |
| divya@ldce.ac.in | Alumni | password123 | Amazon Data Sci |

---

## 🎯 What Was Fixed

| Issue | Solution |
|-------|----------|
| ❌ MongoDB Compass shows no entries | ✅ Fixed `_id` vs `id` field mapping |
| ❌ User data not visible to others | ✅ Added profile visibility + filtering |
| ❌ Email case-sensitivity bugs | ✅ Normalized email to lowercase |
| ❌ No test data | ✅ Created realistic seed data |

---

## 🔍 Verify Everything Works

### Check MongoDB
```
Database: aluverse
Collection: users
Expected: 9 documents with all fields visible
```

### Test API - Get All Users
```bash
# 1. Login first
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kashish@ldce.ac.in","role":"student","password":"password123"}'

# 2. Copy the token from response

# 3. Get all visible users
curl http://localhost:4000/api/users \
  -H "Authorization: Bearer {your_token_here}"

# Should return array of 9 users
```

---

## 📁 Files Changed

- ✅ `backend/src/models/User.ts` - Fixed schema
- ✅ `backend/src/routes/users.ts` - Added filtering & new endpoints
- ✅ `backend/src/routes/auth.ts` - Fixed email queries
- ✅ `backend/src/seeds.ts` - NEW seed script
- ✅ `backend/package.json` - Added seed script

---

## 🆘 Troubleshooting

**Q: Still no data in MongoDB Compass?**
- Refresh MongoDB Compass
- Check if seed script ran without errors
- Verify `.env` has correct `MONGODB_URI`

**Q: Login fails?**
- Use exact email from test accounts table above
- Make sure backend is running (`npm run dev`)

**Q: Other users not showing in directory?**
- Profile must be completed (run seed script for completed profiles)
- User must have `profileVisible: true` (seed script sets this)

---

## 💡 How It Works Now

```
User Signs Up
    ↓
Profile Incomplete (profileVisible: false)
    ↓
User Fills Profile (PUT /api/users/profile)
    ↓
Profile Marked Complete (profileVisible: true)
    ↓
User Appears in Directory (GET /api/users)
    ↓
Other Users Can View Profile (GET /api/users/{id})
```

---

**All fixes are complete! Run `npm run seed` to populate test data.** ✨
