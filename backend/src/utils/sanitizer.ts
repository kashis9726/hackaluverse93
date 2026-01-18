/**
 * Data sanitization utilities
 */
import type { UserProfile } from '../types';

/**
 * Remove sensitive fields from user object for API responses
 */
export const sanitizeUser = (user: any): Partial<UserProfile> => {
  if (!user) return user;
  
  if (typeof user.toObject === 'function') {
    const obj = user.toObject();
    delete (obj as any).passwordHash;
    delete (obj as any).authToken;
    return obj;
  }
  
  const copy = { ...user };
  delete (copy as any).passwordHash;
  delete (copy as any).authToken;
  return copy;
};

/**
 * Remove sensitive fields for public profile display
 */
export const sanitizePublicUser = (user: any): Partial<UserProfile> => {
  const sanitized = sanitizeUser(user);
  // Add additional filtering for public display if needed
  return sanitized;
};

/**
 * Filter visible users only
 */
export const filterVisibleUsers = (users: any[]): Partial<UserProfile>[] => {
  return users
    .filter(u => u.profileCompleted && u.profileVisible)
    .map(u => sanitizePublicUser(u));
};
