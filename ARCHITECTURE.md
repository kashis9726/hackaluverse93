# Project Structure Guide

## Overview

This project follows a **service-oriented architecture** with clear separation of concerns, making it scalable, testable, and maintainable.

## Directory Structure Explained

### `/src/config`
**Database and external service configuration**
- `db.ts` - MongoDB connection setup
- Future: Redis, cache configs, etc.

### `/src/constants`
**Application-wide constants and enums**
- Error messages for consistency
- HTTP status codes
- Validation rules
- Default values and limits
- Environment configurations

**Benefits:**
- Single source of truth for constants
- Easy to update messages globally
- Type-safe enums

### `/src/middleware`
**Express middleware functions**
- Authentication middleware
- Authorization/role checking
- Error handling middleware
- Request logging

**Pattern:**
```typescript
// Usage in routes
router.get('/protected', requireAuth, requireRole(['admin']), handler);
```

### `/src/models`
**MongoDB data schemas (Mongoose)**
- User model
- Blog, Event, Challenge models
- Database-level validations
- Indexes for performance

**Pattern:**
```typescript
const schema = new Schema({ ... });
export default mongoose.model('User', schema);
```

### `/src/routes`
**HTTP endpoint definitions**
- Route handlers
- Request validation
- Response formatting
- Error responses

**Pattern:**
```typescript
router.post('/endpoint', middleware, async (req, res) => {
  try {
    const result = await service.method(data);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
```

### `/src/services`
**Business logic and data operations** (★ Most Important)

**AuthService:**
- User registration
- Login/authentication
- Token management
- Admin login

**UserService:**
- User profile CRUD
- Profile visibility control
- User search
- Admin user creation

**Why Services?**
- Routes become thin (just HTTP handling)
- Business logic is reusable
- Easy to test
- Easy to move logic to other interfaces (CLI, GraphQL, etc.)

**Pattern:**
```typescript
// In Service
static async register(email, password) {
  // Validation
  // Database operations
  // Error handling
  return result;
}

// In Route
router.post('/signup', async (req, res) => {
  const result = await AuthService.signup(req.body);
  res.json(result);
});
```

### `/src/seeds`
**Database seeding for development**

**seedData.ts** - Raw seed data (arrays of user objects)
**index.ts** - Seed runner that imports data and populates DB

**Usage:**
```bash
npm run seed
```

### `/src/types`
**TypeScript interfaces and types**

**Convention:**
- Use `I` prefix for interfaces
- Export type definitions for entire app
- Define request/response types here

**Examples:**
```typescript
export interface IUser { ... }
export type UserRole = 'student' | 'alumni' | 'admin';
export interface AuthResponse { ... }
```

### `/src/utils`
**Reusable utility functions**

**password.ts**
- `hashPassword()` - Secure password hashing
- `verifyPassword()` - Password verification

**token.ts**
- `generateToken()` - Create auth tokens
- `parseDevToken()` - Parse development tokens

**sanitizer.ts**
- `sanitizeUser()` - Remove sensitive fields
- `filterVisibleUsers()` - Filter public profiles

**validators.ts**
- `isValidEmail()` - Email validation
- `validateStudentProfile()` - Profile field validation
- `normalizeEmail()` - Lowercase email

**index.ts**
- General utilities
- Logging functions
- Object manipulation helpers

**Pattern:**
```typescript
// Import and use
import { hashPassword, generateToken } from '../utils';

const hashed = hashPassword(password);
const token = generateToken();
```

### Root Files

**`index.ts`**
- Express app setup
- Middleware configuration
- Route mounting
- Server initialization

**`package.json`**
- Dependencies
- Scripts (dev, build, seed, start)
- Project metadata

**`tsconfig.json`**
- TypeScript compilation options
- Path aliases
- Strict mode enabled

**`.env`**
- Local environment variables
- MongoDB URI, admin email, etc.
- ⚠️ Never commit to git

**`.env.example`**
- Template for .env
- Document required variables
- ✅ Commit to git

**`README.md`**
- Project documentation
- Setup instructions
- API reference

## Data Flow

### Typical Request Flow

```
1. HTTP Request
   ↓
2. Middleware (auth, cors, json parse)
   ↓
3. Route Handler
   ↓
4. Validation (in route or service)
   ↓
5. Service Method (business logic)
   ↓
6. Model Operation (database)
   ↓
7. Response Formatting
   ↓
8. HTTP Response
```

### Example: User Login

```
POST /api/auth/login
  ↓
authMiddleware checks CORS/JSON
  ↓
auth.ts route handler
  ↓
AuthService.login()
  ↓
validate email/password
  ↓
User.findOne() in MongoDB
  ↓
verifyPassword() util
  ↓
generateToken() util
  ↓
sanitizeUser() util
  ↓
return { user, token }
```

## Naming Conventions

### Files
- `camelCase.ts` - Functions and utilities
- `PascalCase.ts` - Classes and models
- `index.ts` - Entry point for folders

### Functions
- `verb + noun` - `getUserById`, `validateEmail`
- `is + adjective` - `isValidEmail`, `isNonEmptyString`
- `get/set/create/update/delete` - CRUD operations

### Variables
- `camelCase` - All variables and constants
- `UPPER_CASE` - Global constants in constants folder
- `Private_` - Private class members (convention)

### Types
- `Interface` - Always `I` prefix
- `Type` - Descriptive names
- `Enum` - `PascalCase` keys

## Best Practices

### 1. Error Handling
```typescript
try {
  const result = await operation();
  res.json(result);
} catch (error) {
  const message = error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC;
  res.status(HTTP_STATUS.BAD_REQUEST).json({ message });
}
```

### 2. Validation
```typescript
// In service, before operations
if (!isValidEmail(email)) throw new Error('Invalid email');
if (!password || password.length < 6) throw new Error('Password too short');
```

### 3. Database Operations
```typescript
// Always check connection
if (mongoose.connection.readyState === 1) {
  // Use database
} else {
  // Fallback to memory or error
}
```

### 4. Sanitization
```typescript
// Never return passwords or tokens
const safe = sanitizeUser(user);
res.json(safe);
```

### 5. Logging
```typescript
import { log, logError } from '../utils';

log('[MODULE]', 'Operation successful');
logError('[MODULE]', error);
```

## Adding New Features

### Step 1: Create Type
```typescript
// types/index.ts
export interface INewModel { ... }
```

### Step 2: Create Model
```typescript
// models/NewModel.ts
const schema = new Schema({ ... });
export default mongoose.model('NewModel', schema);
```

### Step 3: Create Service
```typescript
// services/newService.ts
export class NewService {
  static async operation(data) { ... }
}
```

### Step 4: Create Routes
```typescript
// routes/new.ts
router.get('/', async (req, res) => {
  const result = await NewService.getAll();
  res.json(result);
});
```

### Step 5: Mount Routes
```typescript
// index.ts
app.use('/api/new', newRoutes);
```

## Testing Workflow

1. **Unit Test** - Test individual utilities
2. **Service Test** - Test business logic
3. **Integration Test** - Test routes with services
4. **E2E Test** - Test complete user workflows

## Maintenance

### Code Review Checklist
- [ ] Is the code in the right file?
- [ ] Are types properly defined?
- [ ] Is error handling complete?
- [ ] Are sensitive fields sanitized?
- [ ] Is input validated?
- [ ] Are HTTP statuses correct?
- [ ] Is the code DRY (Don't Repeat Yourself)?

### Common Issues

**"Module not found"**
- Check imports use correct path
- Verify file exists in correct folder

**"Cannot find type"**
- Add type to `types/index.ts`
- Import type at top of file

**"Database error"**
- Check MongoDB URI in .env
- Check connection status

**"Validation error"**
- Check field names match schema
- Check field types
- Review validation rules

## Performance Tips

1. **Index frequently queried fields**
   ```typescript
   email: { type: String, unique: true, index: true }
   ```

2. **Use `.select()` to limit fields**
   ```typescript
   User.findById(id).select('-passwordHash');
   ```

3. **Batch operations**
   ```typescript
   User.insertMany(users); // Not one by one
   ```

4. **Cache static data**
   ```typescript
   const ROLES = ['student', 'alumni', 'admin'];
   ```

5. **Use async/await properly**
   ```typescript
   // Good
   const user = await User.findById(id);
   
   // Bad - unnecessary async
   await Promise.resolve(value);
   ```

---

**This structure ensures your project remains organized, scalable, and maintainable as it grows!** 🚀
