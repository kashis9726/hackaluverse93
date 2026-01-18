/**
 * User Service
 * Handles user-related operations and profile management
 */
import mongoose from 'mongoose';
import type { UserProfile, ProfileUpdateRequest } from '../types';
import User from '../models/User';
import { sanitizePublicUser, filterVisibleUsers } from '../utils/sanitizer';
import {
  validateStudentProfile,
  validateAlumniProfile,
  isNonEmptyString,
  isStringArray,
  isPositiveNumber,
  isValidUrlOrEmpty,
} from '../utils/validators';
import { ERROR_MESSAGES } from '../constants';

export class UserService {
  /**
   * Get all visible user profiles
   */
  static async getAllVisibleUsers(): Promise<Partial<UserProfile>[]> {
    if (mongoose.connection.readyState !== 1) {
      throw new Error(ERROR_MESSAGES.DB_NOT_CONNECTED);
    }

    const users = await User.find({ profileCompleted: true, profileVisible: true })
      .select('-passwordHash -authToken')
      .sort({ createdAt: -1 });
    return users;
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<Partial<UserProfile>> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error(ERROR_MESSAGES.INVALID_USER_ID);
    }

    if (mongoose.connection.readyState !== 1) {
      throw new Error(ERROR_MESSAGES.DB_NOT_CONNECTED);
    }

    const user = await User.findById(userId).select('-passwordHash -authToken');
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

    if (!user.profileVisible || !user.profileCompleted) {
      throw new Error(ERROR_MESSAGES.PROFILE_NOT_VISIBLE);
    }

    return sanitizePublicUser(user);
  }

  /**
   * Get current user profile
   */
  static async getUserProfile(userId: string): Promise<Partial<UserProfile>> {
    if (mongoose.connection.readyState !== 1) {
      throw new Error(ERROR_MESSAGES.DB_NOT_CONNECTED);
    }

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    return sanitizePublicUser(user);
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    role: string,
    data: ProfileUpdateRequest
  ): Promise<Partial<UserProfile>> {
    // Validate based on role
    if (role === 'student') {
      const validation = validateStudentProfile(data);
      if (!validation.valid) {
        throw new Error(`Missing/invalid required fields: ${validation.errors.join(', ')}`);
      }
    } else if (role === 'alumni') {
      const validation = validateAlumniProfile(data);
      if (!validation.valid) {
        throw new Error(`Missing/invalid required fields: ${validation.errors.join(', ')}`);
      }
    }

    // Build updates object
    const updates: Record<string, unknown> = {
      profileCompleted: true,
      profileVisible: true,
    };

    if (role === 'student') {
      if (isNonEmptyString(data.year)) updates.year = data.year?.trim();
      if (isNonEmptyString(data.branch)) updates.branch = data.branch?.trim();
      if (isStringArray(data.skills)) updates.skills = data.skills;
      if (isStringArray(data.interests)) updates.interests = data.interests;
      if (isStringArray(data.projects)) updates.projects = data.projects;
    } else if (role === 'alumni') {
      if (isNonEmptyString(data.company)) updates.company = data.company?.trim();
      if (isNonEmptyString(data.position)) updates.position = data.position?.trim();
      if (isNonEmptyString(data.domain)) updates.domain = data.domain?.trim();
      if (isPositiveNumber(data.yearsOfExperience)) updates.yearsOfExperience = data.yearsOfExperience;
      if (isNonEmptyString(data.availability)) updates.availability = data.availability?.trim();
      if (isStringArray(data.capabilities)) updates.capabilities = data.capabilities;
      if (typeof data.linkedinUrl === 'string') updates.linkedinUrl = data.linkedinUrl.trim();
      if (typeof data.githubUrl === 'string') updates.githubUrl = data.githubUrl.trim();
      if (typeof data.personalWebsite === 'string') updates.personalWebsite = data.personalWebsite.trim();
      if (isNonEmptyString(data.bio)) updates.bio = data.bio?.trim();
    }

    if (mongoose.connection.readyState !== 1) {
      throw new Error(ERROR_MESSAGES.DB_NOT_CONNECTED);
    }

    const updated = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true }).select(
      '-passwordHash'
    );
    if (!updated) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    return sanitizePublicUser(updated);
  }

  /**
   * Toggle profile visibility
   */
  static async toggleProfileVisibility(userId: string, visible: boolean): Promise<Partial<UserProfile>> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error(ERROR_MESSAGES.INVALID_USER_ID);
    }

    if (mongoose.connection.readyState === 1) {
      const updated = await User.findByIdAndUpdate(
        userId,
        { $set: { profileVisible: visible } },
        { new: true }
      ).select('-passwordHash');

      if (!updated) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      return sanitizePublicUser(updated);
    }

    throw new Error(ERROR_MESSAGES.DB_NOT_CONNECTED);
  }

  /**
   * Create user (admin only)
   */
  static async createUser(
    name: string,
    email: string,
    role: string
  ): Promise<Partial<UserProfile>> {
    if (mongoose.connection.readyState !== 1) {
      throw new Error(ERROR_MESSAGES.DB_NOT_CONNECTED);
    }

    const exists = await User.findOne({ email });
    if (exists) throw new Error(ERROR_MESSAGES.USER_EXISTS);

    const user = await User.create({
      name: name || 'User',
      email,
      role,
    });

    return sanitizePublicUser(user);
  }

  /**
   * Search users by name or email
   */
  static async searchUsers(query: string): Promise<Partial<UserProfile>[]> {
    if (!query || query.length < 2) {
      throw new Error('Search query must be at least 2 characters');
    }

    if (mongoose.connection.readyState !== 1) {
      throw new Error(ERROR_MESSAGES.DB_NOT_CONNECTED);
    }

    const users = await User.find(
      {
        $and: [
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { email: { $regex: query, $options: 'i' } },
            ],
          },
          { profileCompleted: true, profileVisible: true },
        ],
      },
      { profileCompleted: 1, profileVisible: 1, name: 1, email: 1, role: 1, company: 1, position: 1 }
    ).limit(20);

    return users;
  }
}
