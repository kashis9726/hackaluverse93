/**
 * Validation utilities
 */
import type { ProfileUpdateRequest, UserRole } from '../types';
export declare const isNonEmptyString: (value: unknown) => boolean;
export declare const isStringArray: (value: unknown) => boolean;
export declare const isPositiveNumber: (value: unknown) => boolean;
export declare const isValidEmail: (email: string) => boolean;
export declare const isValidUrl: (url: string) => boolean;
export declare const isValidUrlOrEmpty: (value: unknown) => boolean;
/**
 * Validate student profile fields
 */
export declare const validateStudentProfile: (data: ProfileUpdateRequest) => {
    valid: boolean;
    errors: string[];
};
/**
 * Validate alumni profile fields
 */
export declare const validateAlumniProfile: (data: ProfileUpdateRequest) => {
    valid: boolean;
    errors: string[];
};
/**
 * Normalize email to lowercase
 */
export declare const normalizeEmail: (email: string) => string;
/**
 * Check if valid user role
 */
export declare const isValidRole: (role: unknown) => role is UserRole;
//# sourceMappingURL=validators.d.ts.map