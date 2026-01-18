/**
 * Data sanitization utilities
 */
import type { UserProfile } from '../types';
/**
 * Remove sensitive fields from user object for API responses
 */
export declare const sanitizeUser: (user: any) => Partial<UserProfile>;
/**
 * Remove sensitive fields for public profile display
 */
export declare const sanitizePublicUser: (user: any) => Partial<UserProfile>;
/**
 * Filter visible users only
 */
export declare const filterVisibleUsers: (users: any[]) => Partial<UserProfile>[];
//# sourceMappingURL=sanitizer.d.ts.map