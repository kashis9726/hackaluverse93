# Backend - Professional Architecture

Modern, scalable Node.js + Express backend with MongoDB, TypeScript, and clean architecture principles.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts                 # Database configuration
│   ├── constants/
│   │   └── index.ts              # App-wide constants, messages, enums
│   ├── middleware/
│   │   └── authMiddleware.ts     # Authentication & authorization
│   ├── models/
│   │   └── User.ts               # MongoDB User schema
│   │   └── *.ts                  # Other data models
│   ├── routes/
│   │   ├── auth.ts               # Authentication endpoints
│   │   ├── users.ts              # User management endpoints
│   │   └── *.ts                  # Other API routes
│   ├── services/
│   │   ├── authService.ts        # Authentication business logic
│   │   ├── userService.ts        # User management business logic
│   │   └── index.ts              # Service exports
│   ├── seeds/
│   │   ├── index.ts              # Seed runner script
│   │   └── seedData.ts           # Seed data definitions
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces & types
│   ├── utils/
│   │   ├── index.ts              # General utilities
│   │   ├── password.ts           # Password hashing/verification
│   │   ├── token.ts              # Token generation
│   │   ├── sanitizer.ts          # Data sanitization
│   │   └── validators.ts         # Input validation
│   └── index.ts                  # Application entry point
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🏗️ Architecture Patterns

### Service Layer Pattern
- **Routes** handle HTTP requests/responses
- **Services** contain business logic
- **Models** define data schemas
- **Utils** provide reusable functions

### Clean Code Principles
- ✅ Single Responsibility Principle
- ✅ Dependency Injection
- ✅ Type Safety with TypeScript
- ✅ Centralized Error Handling
- ✅ Environment-based Configuration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Configuration

1. Copy environment template:
```bash
cp .env.example .env
```

2. Update `.env` with your values:
```dotenv
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
PORT=4000
ADMIN_EMAIL=admin@example.com
JWT_SECRET=your_secret_key
```

### Run Development Server

```bash
npm run dev
```

Server starts at `http://localhost:4000`

### Seed Database

```bash
npm run seed
```

Populates MongoDB with 9 test users (5 students + 4 alumni)

### Build for Production

```bash
npm run build
npm start
```

## 📚 API Documentation

### Authentication Endpoints

**POST `/api/auth/signup`**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "password": "password123"
}
```

**POST `/api/auth/login`**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**POST `/api/auth/admin-login`**
```json
{
  "email": "admin@example.com"
}
```

**GET `/api/auth/me`** *(requires auth)*

### User Endpoints

**GET `/api/users`** *(requires auth & complete profile)*
- Returns all visible user profiles

**GET `/api/users/:userId`**
- Get specific user profile

**GET `/api/users/me`** *(requires auth)*
- Get current user profile

**PUT `/api/users/profile`** *(requires auth)*
```json
{
  "year": "3rd Year",
  "branch": "CS",
  "skills": ["JavaScript", "React"],
  "interests": ["Web Dev"]
}
```

**PATCH `/api/users/:userId/visibility`** *(requires auth)*
```json
{
  "visible": true
}
```

**GET `/api/users/search/:query`**
- Search users by name or email

**POST `/api/users`** *(admin only)*
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "student"
}
```

## 🔐 Authentication

- Token-based authentication
- Passwords hashed with PBKDF2
- Bearer token in `Authorization` header
- Admin login via email verification

**Example Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5...
```

## 📝 Error Handling

Standard error responses:

```json
{
  "message": "Error description",
  "fields": ["field1", "field2"]  // For validation errors
}
```

**HTTP Status Codes:**
- `200` OK
- `201` Created
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict
- `500` Server Error
- `503` Service Unavailable

## 🧪 Testing

### Health Check
```bash
curl http://localhost:4000/health
```

### Login Test
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "kashish@ldce.ac.in",
    "password": "password123"
  }'
```

### View Users
```bash
curl http://localhost:4000/api/users \
  -H "Authorization: Bearer {your_token}"
```

## 📦 Dependencies

### Core
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin requests
- `dotenv` - Environment configuration

### Development
- `typescript` - Type safety
- `ts-node-dev` - Dev server with live reload
- `tsx` - TypeScript executor

## 🔧 Configuration

### Environment Variables

```dotenv
# Database
MONGODB_URI              # MongoDB connection string

# Server
PORT                     # Server port (default: 4000)
NODE_ENV                 # Environment mode (development/production)

# Auth
ADMIN_EMAIL             # Admin email for special access
JWT_SECRET              # JWT signing secret

# CORS
CORS_ORIGIN             # Allowed origin for CORS
```

## 📊 Data Models

### User Schema
```typescript
{
  _id: ObjectId
  name: string
  email: string
  role: 'student' | 'alumni' | 'admin'
  passwordHash: string
  authToken: string
  profileCompleted: boolean
  profileVisible: boolean
  
  // Profile fields (role-dependent)
  year?: string
  branch?: string
  company?: string
  position?: string
  skills?: string[]
  interests?: string[]
  capabilities?: string[]
  
  // Additional
  isVerified: boolean
  isOnline: boolean
  createdAt: Date
  updatedAt: Date
}
```

## 🐛 Debugging

Enable verbose logging:
```bash
DEBUG=* npm run dev
```

Check MongoDB:
1. Open MongoDB Compass
2. Connect to your cluster
3. Browse `aluverse` database
4. View `users` collection

## 📈 Performance

- ✅ Indexed database fields
- ✅ Efficient queries
- ✅ Password hashing with salt
- ✅ Token-based auth (no sessions)
- ✅ CORS configured
- ✅ Compressed responses

## 🔒 Security

- ✅ Password hashing (PBKDF2)
- ✅ Token validation
- ✅ Input sanitization
- ✅ SQL injection prevention (via Mongoose)
- ✅ CORS protection
- ✅ Admin email verification

## 📚 Test Accounts

| Email | Role | Password | Company/Year |
|-------|------|----------|--------------|
| kashish@ldce.ac.in | Student | password123 | 3rd Year CS |
| priya@ldce.ac.in | Student | password123 | 2nd Year IT |
| arjun@ldce.ac.in | Student | password123 | 3rd Year CS |
| neha@ldce.ac.in | Student | password123 | 1st Year ECE |
| rohan@ldce.ac.in | Student | password123 | 2nd Year CS |
| rahul@ldce.ac.in | Alumni | password123 | Google |
| anjali@ldce.ac.in | Alumni | password123 | Microsoft |
| vikram@ldce.ac.in | Alumni | password123 | Startup XYZ |
| divya@ldce.ac.in | Alumni | password123 | Amazon |

## 🚢 Deployment

### Using Vercel
```bash
npm run build
vercel deploy
```

### Using Heroku
```bash
heroku login
git push heroku main
```

### Using Docker
```bash
docker build -t aluverse-backend .
docker run -p 4000:4000 aluverse-backend
```

## 📞 Support

For issues or questions:
1. Check the error message
2. Review the API documentation
3. Check `.env` configuration
4. Check MongoDB connection
5. Review logs in console

## 📄 License

MIT
