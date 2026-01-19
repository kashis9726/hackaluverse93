/**
 * Authentication Service
 * Handles user registration, login, and token management
 */
import mongoose from 'mongoose';
import type { SignupRequest, LoginRequest, AuthResponse, UserProfile } from '../types';
import User from '../models/User';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/token';
import { sanitizeUser } from '../utils/sanitizer';
import { normalizeEmail, isValidEmail, isValidRole } from '../utils/validators';
import { ERROR_MESSAGES } from '../constants';

export class AuthService {
  /**
   * Register a new user
   */
  static async signup(req: SignupRequest): Promise<AuthResponse> {
    const { name, email: rawEmail, role, password } = req;
    const email = normalizeEmail(rawEmail);

    // Validation
    if (!email || !isValidEmail(email)) {
      throw new Error('Invalid email');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    if (!role || !isValidRole(role)) {
      throw new Error('Invalid role');
    }
    if (role === 'admin') {
      throw new Error(ERROR_MESSAGES.ADMIN_SIGNUP_DISABLED);
    }

    // Database required
    if (mongoose.connection.readyState !== 1) {
      throw new Error(ERROR_MESSAGES.DB_NOT_CONNECTED);
    }

    const exists = await User.findOne({ email });
    if (exists) throw new Error(ERROR_MESSAGES.USER_EXISTS);

    const token = generateToken();
    const user = await User.create({
      name: name || 'User',
      email,
      role,
      authToken: token,
      passwordHash: hashPassword(password),
      profileVisible: false,
    });

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  /**
   * Login user
   */
  static async login(req: LoginRequest): Promise<AuthResponse> {
    const { email: rawEmail, role, password } = req;
    const email = normalizeEmail(rawEmail);

    if (!email || !password) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Database required
    if (mongoose.connection.readyState !== 1) {
      throw new Error(ERROR_MESSAGES.DB_NOT_CONNECTED);
    }

    const user = role ?
      await User.findOne({ email, role }) :
      await User.findOne({ email });

    if (!user) {
      console.log(`[AUTH] login: User not found: ${email}`);
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.passwordHash) {
      console.log(`[AUTH] login: User has no password hash: ${email}`);
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!verifyPassword(password, user.passwordHash)) {
      console.log(`[AUTH] login: Password mismatch for user: ${email}`);
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    if (user.role === 'admin') {
      throw new Error(ERROR_MESSAGES.ADMIN_LOGIN_REQUIRED);
    }

    const token = generateToken();
    user.authToken = token;
    await user.save();

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  /**
   * Admin login
   */
  static async adminLogin(email: string): Promise<AuthResponse> {
    const normalizedEmail = normalizeEmail(email);
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();

    if (!adminEmail) throw new Error(ERROR_MESSAGES.ADMIN_EMAIL_NOT_CONFIGURED);
    if (normalizedEmail !== adminEmail) throw new Error(ERROR_MESSAGES.NOT_ALLOWED);

    // Database required
    if (mongoose.connection.readyState !== 1) {
      throw new Error(ERROR_MESSAGES.DB_NOT_CONNECTED);
    }

    const token = generateToken();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name: 'Admin',
        email: normalizedEmail,
        role: 'admin',
        profileCompleted: true,
        authToken: token,
      });
    } else {
      user.role = 'admin';
      user.profileCompleted = true;
      user.authToken = token;
      await user.save();
    }

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  /**
   * Verify token and get user
   */
  static async verifyToken(token: string): Promise<Partial<UserProfile>> {
    if (mongoose.connection.readyState !== 1) {
      throw new Error(ERROR_MESSAGES.DB_NOT_CONNECTED);
    }

    const user = await User.findOne({ authToken: token }).select('-passwordHash');
    if (!user) throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    return sanitizeUser(user);
  }
}
