/**
 * Validation utilities
 */
import type { ProfileUpdateRequest, UserRole } from '../types';
import { VALIDATION_RULES } from '../constants';

export const isNonEmptyString = (value: unknown): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isStringArray = (value: unknown): boolean => {
  return Array.isArray(value) && value.every((x) => typeof x === 'string');
};

export const isPositiveNumber = (value: unknown): boolean => {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
};

export const isValidEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
};

export const isValidUrl = (url: string): boolean => {
  if (url.trim() === '') return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidUrlOrEmpty = (value: unknown): boolean => {
  if (value === undefined || value === null) return true;
  if (typeof value !== 'string') return false;
  if (value.trim() === '') return true;
  return isValidUrl(value);
};

/**
 * Validate student profile fields
 */
export const validateStudentProfile = (
  data: ProfileUpdateRequest
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!isNonEmptyString(data.year)) errors.push('year');
  if (!isNonEmptyString(data.branch)) errors.push('branch');
  if (!isStringArray(data.skills) || (data.skills as string[]).length === 0) errors.push('skills');
  if (!isStringArray(data.interests) || (data.interests as string[]).length === 0) errors.push('interests');

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate alumni profile fields
 */
export const validateAlumniProfile = (
  data: ProfileUpdateRequest
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!isNonEmptyString(data.company)) errors.push('company');
  if (!isNonEmptyString(data.position)) errors.push('position');
  if (!isNonEmptyString(data.domain)) errors.push('domain');
  if (!isPositiveNumber(data.yearsOfExperience)) errors.push('yearsOfExperience');
  if (!isNonEmptyString(data.availability)) errors.push('availability');
  if (!isStringArray(data.capabilities) || (data.capabilities as string[]).length === 0)
    errors.push('capabilities');
  if (!isValidUrlOrEmpty(data.linkedinUrl)) errors.push('linkedinUrl');
  if (!isValidUrlOrEmpty(data.githubUrl)) errors.push('githubUrl');
  if (!isValidUrlOrEmpty(data.personalWebsite)) errors.push('personalWebsite');
  if (!isNonEmptyString(data.bio)) errors.push('bio');

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Normalize email to lowercase
 */
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/**
 * Check if valid user role
 */
export const isValidRole = (role: unknown): role is UserRole => {
  return role === 'student' || role === 'alumni' || role === 'admin';
};
