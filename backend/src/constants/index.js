"use strict";
/**
 * Application constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESPONSE_MESSAGES = exports.SEED_DATA = exports.PAGINATION = exports.VALIDATION_RULES = exports.PASSWORDS = exports.HTTP_STATUS = exports.ERROR_MESSAGES = exports.AVAILABILITY = exports.USER_ROLES = void 0;
exports.USER_ROLES = {
    STUDENT: 'student',
    ALUMNI: 'alumni',
    ADMIN: 'admin',
};
exports.AVAILABILITY = {
    BUSY: 'Busy',
    LIMITED: 'Limited',
    OPEN: 'Open',
};
exports.ERROR_MESSAGES = {
    // Authentication
    NO_TOKEN: 'Access denied. No token provided.',
    INVALID_TOKEN: 'Invalid token',
    FAILED_AUTH: 'Failed to authenticate',
    NOT_ALLOWED: 'Not allowed',
    // User
    USER_NOT_FOUND: 'User not found',
    USER_EXISTS: 'User already exists',
    INVALID_CREDENTIALS: 'Invalid credentials',
    PROFILE_INCOMPLETE: 'Profile setup required',
    // Authorization
    ACCESS_DENIED: 'Access denied',
    ADMIN_REQUIRED: 'Admin role required',
    ADMIN_LOGIN_REQUIRED: 'Use admin login link',
    // Validation
    MISSING_REQUIRED: 'Missing/invalid required fields',
    INVALID_USER_ID: 'Invalid user ID',
    ADMIN_EMAIL_NOT_CONFIGURED: 'ADMIN_EMAIL is not configured',
    ADMIN_SIGNUP_DISABLED: 'Admin signup is disabled',
    PROFILE_NOT_VISIBLE: 'This profile is not publicly visible',
    // Database
    DB_NOT_CONNECTED: 'Database not connected',
    FAILED_TO_FETCH: 'Failed to fetch',
    FAILED_TO_UPDATE: 'Failed to update',
    FAILED_TO_CREATE: 'Failed to create',
    FAILED_TO_DELETE: 'Failed to delete',
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};
exports.PASSWORDS = {
    ITERATIONS: 120000,
    ALGORITHM: 'pbkdf2',
};
exports.VALIDATION_RULES = {
    PASSWORD_MIN_LENGTH: 6,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    URL_REGEX: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
};
exports.PAGINATION = {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    DEFAULT_PAGE: 1,
};
exports.SEED_DATA = {
    STUDENT_COUNT: 5,
    ALUMNI_COUNT: 4,
    TOTAL_USERS: 9,
};
exports.RESPONSE_MESSAGES = {
    SUCCESS: 'Success',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
    CREATED: 'Created successfully',
    SEEDED: 'Database seeding completed successfully',
};
//# sourceMappingURL=index.js.map