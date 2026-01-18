/**
 * Application constants
 */
export declare const USER_ROLES: {
    readonly STUDENT: "student";
    readonly ALUMNI: "alumni";
    readonly ADMIN: "admin";
};
export declare const AVAILABILITY: {
    readonly BUSY: "Busy";
    readonly LIMITED: "Limited";
    readonly OPEN: "Open";
};
export declare const ERROR_MESSAGES: {
    readonly NO_TOKEN: "Access denied. No token provided.";
    readonly INVALID_TOKEN: "Invalid token";
    readonly FAILED_AUTH: "Failed to authenticate";
    readonly NOT_ALLOWED: "Not allowed";
    readonly USER_NOT_FOUND: "User not found";
    readonly USER_EXISTS: "User already exists";
    readonly INVALID_CREDENTIALS: "Invalid credentials";
    readonly PROFILE_INCOMPLETE: "Profile setup required";
    readonly ACCESS_DENIED: "Access denied";
    readonly ADMIN_REQUIRED: "Admin role required";
    readonly ADMIN_LOGIN_REQUIRED: "Use admin login link";
    readonly MISSING_REQUIRED: "Missing/invalid required fields";
    readonly INVALID_USER_ID: "Invalid user ID";
    readonly ADMIN_EMAIL_NOT_CONFIGURED: "ADMIN_EMAIL is not configured";
    readonly ADMIN_SIGNUP_DISABLED: "Admin signup is disabled";
    readonly PROFILE_NOT_VISIBLE: "This profile is not publicly visible";
    readonly DB_NOT_CONNECTED: "Database not connected";
    readonly FAILED_TO_FETCH: "Failed to fetch";
    readonly FAILED_TO_UPDATE: "Failed to update";
    readonly FAILED_TO_CREATE: "Failed to create";
    readonly FAILED_TO_DELETE: "Failed to delete";
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly INTERNAL_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const PASSWORDS: {
    readonly ITERATIONS: 120000;
    readonly ALGORITHM: "pbkdf2";
};
export declare const VALIDATION_RULES: {
    readonly PASSWORD_MIN_LENGTH: 6;
    readonly EMAIL_REGEX: RegExp;
    readonly URL_REGEX: RegExp;
};
export declare const PAGINATION: {
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
    readonly DEFAULT_PAGE: 1;
};
export declare const SEED_DATA: {
    readonly STUDENT_COUNT: 5;
    readonly ALUMNI_COUNT: 4;
    readonly TOTAL_USERS: 9;
};
export declare const RESPONSE_MESSAGES: {
    readonly SUCCESS: "Success";
    readonly UPDATED: "Updated successfully";
    readonly DELETED: "Deleted successfully";
    readonly CREATED: "Created successfully";
    readonly SEEDED: "Database seeding completed successfully";
};
//# sourceMappingURL=index.d.ts.map