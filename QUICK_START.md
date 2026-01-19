# 🚀 Quick Start - Data & Admin Access

## Step 1: Populate All Database Data (ONE COMMAND)
```bash
cd backend
npm run seed
```

✅ Creates: 9 users, 4 blogs, 5 questions, 10 answers, 3 events, 3 challenges, 3 internships, 3 startups

---

## Step 2: Use Test Accounts

### Login as Student
- Email: `kashish@ldce.ac.in`
- Password: `password123`
- Features: Ask questions, apply for opportunities, register for events

### Login as Alumni  
- Email: `rahul.desai@alumni.com`
- Password: `password123`
- Features: Write blogs, answer questions, mentor students

---

## Step 3: Access Admin Dashboard

### 🔐 Admin Login (No Password!)
1. Go to: `http://localhost:5173/auth?mode=admin-login`
2. Enter email: `admin@aluverse.com`
3. Press "Admin Login"
4. ✅ You're now admin!

### 📊 Admin Dashboard URLs
- Users: `http://localhost:5173/admin/users`
- Analytics: `http://localhost:5173/admin/analytics`
- Events: `http://localhost:5173/admin/events`
- Content: `http://localhost:5173/admin/content`
- Settings: `http://localhost:5173/admin/settings`

---

## 📍 All Features with Real Data

| Feature | URL | Data |
|---------|-----|------|
| **Find Mentors (Alumni)** | `/alumni` | 4 alumni with profiles |
| **Blogs** | `/blogs` | 4 blogs with images |
| **Q&A** | `/qa` | 5 questions + 10 answers |
| **Events** | `/events` | 3 professional events |
| **Challenges** | `/challenges` | 3 coding challenges |
| **Opportunities** | `/internships` | 3 internships/jobs |
| **Startups** | `/startups` | 3 startup ideas |

---

## 🎯 What's in the Database?

**When you run `npm run seed`:**

### Users
- 5 Students (can ask Q&A, apply for internships)
- 4 Alumni (can write blogs, mentor, answer questions, post jobs)
- Admin account created on first login

### Content
- 4 Blogs (with Unsplash images, from alumni)
- 5 Questions (from students)
- 10 Answers (from alumni)
- 3 Events (seminars, webinars)
- 3 Challenges (coding challenges)
- 3 Internships (job opportunities)
- 3 Startups (startup ideas)

---

## 💡 Tips

1. **See data in MongoDB Compass**:
   - URL: `mongodb+srv://Kashis:Kashis%4093doli@clusterkashis.n0f4zdo.mongodb.net/aluverse`
   - Collections: `users`, `blogs`, `questions`, `events`, etc.

2. **Clear and Re-seed**:
   - Run `npm run seed` again to clear all and start fresh

3. **Admin Email**:
   - Can be changed in `.env` file: `ADMIN_EMAIL=your-email@example.com`

---

## ✨ That's It!

Your platform now has:
✅ Real data for ALL features
✅ Multiple user types (student, alumni, admin)  
✅ Professional admin dashboard
✅ Everything ready to explore!
