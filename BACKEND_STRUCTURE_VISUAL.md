# Backend Structure Visualization

## Complete Folder Tree

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts                          # Database configuration
│   │
│   ├── constants/
│   │   └── index.ts                       # 📌 All app constants
│   │       ├── USER_ROLES
│   │       ├── AVAILABILITY
│   │       ├── ERROR_MESSAGES
│   │       ├── HTTP_STATUS
│   │       ├── VALIDATION_RULES
│   │       └── ... more constants
│   │
│   ├── middleware/
│   │   └── authMiddleware.ts              # Auth & role validation
│   │       ├── requireAuth
│   │       ├── requireProfileCompleted
│   │       ├── requireRole
│   │       └── memoryUserStore
│   │
│   ├── models/
│   │   ├── User.ts                        # User schema
│   │   ├── Blog.ts                        # Blog schema
│   │   ├── Event.ts                       # Event schema
│   │   ├── Challenge.ts                   # Challenge schema
│   │   ├── Question.ts                    # Q&A schema
│   │   ├── Internship.ts                  # Internship schema
│   │   ├── Message.ts                     # Chat message schema
│   │   ├── ChatRoom.ts                    # Chat room schema
│   │   ├── Startup.ts                     # Startup schema
│   │   ├── ReversePitch.ts                # Reverse pitch schema
│   │   └── Answer.ts                      # Answer schema
│   │
│   ├── routes/
│   │   ├── auth.ts.new                    # 🆕 Auth endpoints (refactored)
│   │   ├── auth.ts                        # Auth endpoints (original)
│   │   ├── users.ts.new                   # 🆕 User endpoints (refactored)
│   │   ├── users.ts                       # User endpoints (original)
│   │   ├── blogs.ts                       # Blog endpoints
│   │   ├── events.ts                      # Event endpoints
│   │   ├── challenges.ts                  # Challenge endpoints
│   │   ├── qa.ts                          # Q&A endpoints
│   │   ├── internships.ts                 # Internship endpoints
│   │   ├── startups.ts                    # Startup endpoints
│   │   └── users.d.ts                     # Type definitions
│   │
│   ├── services/
│   │   ├── authService.ts                 # ✨ Auth business logic
│   │   │   ├── signup()
│   │   │   ├── login()
│   │   │   ├── adminLogin()
│   │   │   └── verifyToken()
│   │   │
│   │   ├── userService.ts                 # ✨ User business logic
│   │   │   ├── getAllVisibleUsers()
│   │   │   ├── getUserById()
│   │   │   ├── getUserProfile()
│   │   │   ├── updateProfile()
│   │   │   ├── toggleProfileVisibility()
│   │   │   ├── createUser()
│   │   │   └── searchUsers()
│   │   │
│   │   └── index.ts                       # Service exports
│   │
│   ├── seeds/
│   │   ├── seedData.ts                    # ✨ Raw seed data
│   │   │   ├── STUDENT_SEED_DATA[]
│   │   │   └── ALUMNI_SEED_DATA[]
│   │   │
│   │   └── index.ts                       # ✨ Seed runner
│   │       └── seedDatabase()
│   │
│   ├── types/
│   │   └── index.ts                       # ✨ TypeScript interfaces
│   │       ├── UserRole
│   │       ├── AuthUser
│   │       ├── IUser
│   │       ├── UserProfile
│   │       ├── SignupRequest
│   │       ├── LoginRequest
│   │       ├── ProfileUpdateRequest
│   │       ├── ApiResponse
│   │       ├── AuthResponse
│   │       └── MemoryUser
│   │
│   ├── utils/
│   │   ├── index.ts                       # ✨ General utilities
│   │   │   ├── getBearerToken()
│   │   │   ├── isObjectId()
│   │   │   ├── delay()
│   │   │   ├── log()
│   │   │   └── ... more
│   │   │
│   │   ├── password.ts                    # ✨ Password utilities
│   │   │   ├── hashPassword()
│   │   │   └── verifyPassword()
│   │   │
│   │   ├── token.ts                       # ✨ Token utilities
│   │   │   ├── generateToken()
│   │   │   ├── generateDevToken()
│   │   │   └── parseDevToken()
│   │   │
│   │   ├── sanitizer.ts                   # ✨ Data sanitization
│   │   │   ├── sanitizeUser()
│   │   │   ├── sanitizePublicUser()
│   │   │   └── filterVisibleUsers()
│   │   │
│   │   └── validators.ts                  # ✨ Input validation
│   │       ├── isNonEmptyString()
│   │       ├── isStringArray()
│   │       ├── isValidEmail()
│   │       ├── isValidUrl()
│   │       ├── validateStudentProfile()
│   │       ├── validateAlumniProfile()
│   │       ├── normalizeEmail()
│   │       └── ... more
│   │
│   └── index.ts                           # 🚀 App entry point
│       ├── Express setup
│       ├── Middleware config
│       ├── Route mounting
│       ├── MongoDB connection
│       └── Server initialization
│
├── .env                                   # Environment variables (not in git)
├── .env.example                           # 🆕 Environment template
├── package.json                           # Dependencies & scripts
│   ├── "dev": "ts-node-dev ..."
│   ├── "build": "tsc -p tsconfig.json"
│   ├── "start": "node dist/index.js"
│   └── "seed": "ts-node src/seeds/index.ts"
│
├── tsconfig.json                          # TypeScript config
├── README.md                              # 🆕 Complete documentation
└── node_modules/                          # Dependencies
```

## Services Layer Dependency Map

```
┌─────────────────────────────────────────────────────┐
│                    ROUTES                          │
│  /api/auth/*        /api/users/*                    │
└──────┬──────────────────────┬──────────────────────┘
       │                      │
       ▼                      ▼
┌──────────────────┐  ┌──────────────────┐
│  AuthService     │  │  UserService     │
├──────────────────┤  ├──────────────────┤
│ + signup()       │  │ + getAllUsers()  │
│ + login()        │  │ + getUserById()  │
│ + adminLogin()   │  │ + updateProfile()│
│ + verifyToken()  │  │ + search()       │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         ├─────────────┬────────┘
         │             │
         ▼             ▼
    ┌────────────────────────┐
    │      UTILS             │
    ├────────────────────────┤
    │ password.ts            │
    │ token.ts               │
    │ validators.ts          │
    │ sanitizer.ts           │
    │ index.ts               │
    └────────┬───────────────┘
             │
    ┌────────▼──────────────┐
    │   MODELS/DATABASE     │
    ├───────────────────────┤
    │ User.ts → MongoDB     │
    │ Blog.ts → MongoDB     │
    │ Event.ts → MongoDB    │
    │ ... etc               │
    └───────────────────────┘
```

## Request Handling Flow

```
HTTP Request
    │
    ├─ POST /api/auth/login
    │   ├─ Middleware (cors, body-parser)
    │   ├─ Route Handler (routes/auth.ts)
    │   ├─ Service Method (AuthService.login)
    │   │   ├─ Validation (utils/validators)
    │   │   ├─ Database Query (models/User)
    │   │   ├─ Password Verify (utils/password)
    │   │   ├─ Token Generation (utils/token)
    │   │   └─ Data Sanitization (utils/sanitizer)
    │   └─ HTTP Response
    │       └─ { user, token }
    │
    ├─ GET /api/users/:userId
    │   ├─ Route Handler (routes/users.ts)
    │   ├─ Service Method (UserService.getUserById)
    │   │   ├─ Validation (utils/validators)
    │   │   ├─ Database Query (models/User)
    │   │   └─ Visibility Check
    │   └─ HTTP Response
    │       └─ { userData }
    │
    └─ PUT /api/users/profile
        ├─ Auth Middleware (middleware/authMiddleware)
        ├─ Route Handler (routes/users.ts)
        ├─ Service Method (UserService.updateProfile)
        │   ├─ Role-based Validation
        │   ├─ Field Validation (utils/validators)
        │   ├─ Database Update (models/User)
        │   └─ Response Formatting
        └─ HTTP Response
            └─ { updatedUser }
```

## Constants Organization

```
src/constants/index.ts
├── USER_ROLES
│   ├── STUDENT: 'student'
│   ├── ALUMNI: 'alumni'
│   └── ADMIN: 'admin'
│
├── ERROR_MESSAGES
│   ├── NO_TOKEN
│   ├── INVALID_TOKEN
│   ├── USER_NOT_FOUND
│   ├── USER_EXISTS
│   ├── INVALID_CREDENTIALS
│   ├── PROFILE_INCOMPLETE
│   └── ... 20+ more
│
├── HTTP_STATUS
│   ├── OK: 200
│   ├── CREATED: 201
│   ├── BAD_REQUEST: 400
│   ├── UNAUTHORIZED: 401
│   ├── FORBIDDEN: 403
│   ├── NOT_FOUND: 404
│   ├── CONFLICT: 409
│   ├── INTERNAL_ERROR: 500
│   └── SERVICE_UNAVAILABLE: 503
│
├── VALIDATION_RULES
│   ├── PASSWORD_MIN_LENGTH: 6
│   ├── EMAIL_REGEX: /^[^\s@]+@...$/
│   └── URL_REGEX: /^(https?:\/\/)...$/
│
└── RESPONSE_MESSAGES
    ├── SUCCESS
    ├── UPDATED
    ├── DELETED
    └── CREATED
```

## Types Organization

```
src/types/index.ts
├── Enums & Unions
│   └── UserRole = 'student' | 'alumni' | 'admin'
│
├── Interfaces
│   ├── AuthUser
│   │   ├── id: string
│   │   ├── role: UserRole
│   │   └── email: string
│   │
│   ├── IUser
│   │   ├── _id?: string
│   │   ├── name: string
│   │   ├── email: string
│   │   ├── role: UserRole
│   │   └── ... more fields
│   │
│   ├── UserProfile extends IUser
│   │   ├── profileImage?: string
│   │   ├── skills?: string[]
│   │   ├── company?: string
│   │   └── ... more optional fields
│   │
│   ├── Request Types
│   │   ├── SignupRequest
│   │   ├── LoginRequest
│   │   └── ProfileUpdateRequest
│   │
│   └── Response Types
│       ├── ApiResponse<T>
│       ├── AuthResponse
│       └── MemoryUser
```

## Import Paths

```javascript
// Utilities
import { generateToken } from '../utils/token';
import { hashPassword } from '../utils/password';
import { sanitizeUser } from '../utils/sanitizer';
import { isValidEmail } from '../utils/validators';

// Services
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';

// Types
import type { UserRole, AuthUser, IUser } from '../types';

// Constants
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';

// Models
import User from '../models/User';

// Middleware
import { requireAuth, requireRole } from '../middleware/authMiddleware';
```

## Folder Size Estimates

```
src/
├── utils/          ~500 lines (5 files)
├── services/       ~400 lines (2 files)
├── routes/         ~200 lines (existing)
├── types/          ~150 lines (1 file)
├── constants/      ~100 lines (1 file)
├── seeds/          ~300 lines (2 files)
├── models/         ~500 lines (existing)
├── middleware/     ~200 lines (existing)
├── config/         ~50 lines (existing)
└── index.ts        ~70 lines

TOTAL:              ~2,500 lines (well-organized!)
```

## Module Responsibilities

| Module | Responsibility | Lines |
|--------|---------------|----|
| `routes/` | HTTP handling only | 50-100 per file |
| `services/` | Business logic | 100-200 per file |
| `models/` | Data schema | 50-100 per file |
| `utils/` | Reusable functions | 30-100 per file |
| `middleware/` | Request processing | 100-150 per file |
| `types/` | Type definitions | 100-150 per file |
| `constants/` | App configuration | 100-150 per file |

---

**This professional structure makes your backend:**
- 📦 Easy to understand
- 🔧 Easy to maintain
- 📈 Easy to scale
- 🧪 Easy to test
- 👥 Easy for teams to collaborate
