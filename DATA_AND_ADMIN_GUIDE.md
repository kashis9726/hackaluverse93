# 📊 Database Data & Admin Access Guide

## ✅ Real Data in Database

All features have real, seeded data in MongoDB:

### 📊 Data Summary
- **Students**: 5 seed users (all with profiles)
- **Alumni**: 4 seed users (with full profiles)
- **Blogs**: 4+ posts with real content and images
- **Questions**: 5+ Q&A questions with answers
- **Answers**: 10+ detailed answers from alumni
- **Events**: 3+ professional events
- **Challenges**: 3+ coding challenges
- **Internships**: 3+ internship postings
- **Startups**: 3+ startup ideas

---

## 🚀 How to Populate All Data

### Step 1: Run the Seed Script
```bash
cd backend
npm run seed
```

This will:
- ✅ Create all users (students & alumni)
- ✅ Create all blogs with images from Unsplash
- ✅ Create all Q&A questions and answers
- ✅ Create all events
- ✅ Create all challenges
- ✅ Create all internships
- ✅ Create all startups

### Step 2: Verify in MongoDB Compass
1. Open MongoDB Compass
2. Connect to: `mongodb+srv://Kashis:Kashis%4093doli@clusterkashis.n0f4zdo.mongodb.net/aluverse`
3. Navigate to `aluverse` database
4. You should see collections:
   - `users` (9 users)
   - `blogs` (4+ blogs)
   - `questions` (5+ questions)
   - `answers` (10+ answers)
   - `events` (3+ events)
   - `challenges` (3+ challenges)
   - `internships` (3+ internships)
   - `startups` (3+ startups)

---

## 👥 Test User Credentials

### Students (for testing features)
```
Email: kashish@ldce.ac.in
Password: password123

Email: priya@ldce.ac.in
Password: password123

Email: arjun@ldce.ac.in
Password: password123
```

### Alumni (for writing blogs, mentoring)
```
Email: rahul.desai@alumni.com
Password: password123

Email: divya.patel@alumni.com
Password: password123

Email: vikram.sharma@alumni.com
Password: password123

Email: anjali.gupta@alumni.com
Password: password123
```

---

## 🔐 Admin Dashboard Access

### How to Access Admin Dashboard

#### Option 1: Admin Login (Recommended)
1. Go to: `http://localhost:5173/auth?mode=admin-login`
2. You'll see an "Admin Login" page
3. Enter the admin email: **admin@aluverse.com**
4. You'll be granted admin access

#### Option 2: Check Your .env File
1. Open `.env` file in backend folder:
   ```
   ADMIN_EMAIL=admin@aluverse.com
   ```
2. Use this email to login as admin

#### What the Admin Email Does
- Gives you immediate admin access without a password
- Creates an admin account if it doesn't exist
- No regular signup/login needed

### Admin Dashboard Features

Once logged in as admin, you can access:

1. **User Management**
   - View all users
   - See student and alumni profiles
   - Manage user roles

2. **Analytics**
   - View platform statistics
   - Track user engagement
   - Monitor activity

3. **Event Management**
   - Create events
   - View registrations
   - Manage event details

4. **Content Moderation**
   - Review blogs
   - Moderate Q&A posts
   - Remove inappropriate content

5. **System Settings**
   - Platform configuration
   - System settings
   - Database management

---

## 🧭 Where to Find Each Feature

### 1. Find Mentors (Alumni Directory)
- **URL**: `http://localhost:5173/alumni`
- **Data**: Shows all 4 alumni with full profiles
- **Filter**: Search by name, skills, availability
- **Action**: Connect with mentors via chat

### 2. Blogs
- **URL**: `http://localhost:5173/blogs`
- **Data**: 4+ blogs with real authors and images
- **Filter**: By category (Career, Data, AI, etc.)
- **Action**: Read blogs, connect with authors

### 3. Q&A Board
- **URL**: `http://localhost:5173/qa`
- **Data**: 5+ questions with 10+ answers
- **Filter**: By category or tags
- **Action**: Ask questions (as student), answer (as alumni)

### 4. Events
- **URL**: `http://localhost:5173/events`
- **Data**: 3+ professional events
- **Filter**: By type (webinar, workshop, etc.)
- **Action**: Register for events

### 5. Challenges
- **URL**: `http://localhost:5173/challenges`
- **Data**: 3+ coding challenges
- **Filter**: By difficulty level
- **Action**: Participate in challenges

### 6. Opportunities (Internships/Jobs)
- **URL**: `http://localhost:5173/internships`
- **Data**: 3+ internship postings
- **Filter**: By type, company
- **Action**: View and apply for opportunities

### 7. Startups
- **URL**: `http://localhost:5173/startups`
- **Data**: 3+ startup ideas
- **Filter**: By stage, looking for
- **Action**: View startup details, connect with founders

---

## 🎯 Admin Login URLs

- **Frontend Admin Login**: `http://localhost:5173/auth?mode=admin-login`
- **Admin Dashboard**: `http://localhost:5173/admin/users`
- **Admin Analytics**: `http://localhost:5173/admin/analytics`
- **Admin Events**: `http://localhost:5173/admin/events`
- **Admin Content Moderation**: `http://localhost:5173/admin/content`
- **Admin Settings**: `http://localhost:5173/admin/settings`

---

## 🔄 Re-seed Data (Clear & Refresh)

If you want to clear all data and re-seed:

```bash
cd backend
npm run seed
```

This will:
1. Clear all existing data
2. Re-create all seed data fresh
3. Fresh images from Unsplash
4. All relationships restored

---

## ✨ Summary

- ✅ **All features have real data** in MongoDB
- ✅ **Alumni Directory fully populated** with mentors
- ✅ **Admin Dashboard accessible** via special email
- ✅ **Test accounts available** for all roles
- ✅ **Data refreshes easily** with seed command

**Now you can explore the entire platform with real data!** 🚀
