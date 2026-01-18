import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

export type UserRole = 'student' | 'alumni' | 'admin';

export interface AuthUser {
  id: string;
  role: UserRole;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

const getBearerToken = (req: Request): string | null => {
  const token = req.header('Authorization')?.replace('Bearer ', '').trim();
  if (!token) return null;
  return token;
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database not connected' });
  }

  try {
    const dbUser = await User.findOne({ authToken: token }).select('_id role email');
    if (!dbUser) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = { id: dbUser._id.toString(), role: dbUser.role as UserRole, email: dbUser.email };
    return next();
  } catch {
    return res.status(500).json({ message: 'Failed to authenticate' });
  }
};

export const requireProfileCompleted = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  if (req.user.role === 'admin') return next();

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database not connected' });
  }

  const dbUser = await User.findById(req.user.id).select('profileCompleted');
  if (!dbUser) {
    return res.status(401).json({ message: 'User not found' });
  }

  if (!dbUser.profileCompleted) {
    return res.status(403).json({ message: 'Profile setup required', code: 'PROFILE_INCOMPLETE' });
  }

  return next();
};

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. ${roles.join(' or ')} role required.` });
    }

    if (req.user.role === 'admin') {
      const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
      if (adminEmail && req.user.email.toLowerCase() !== adminEmail) {
        return res.status(403).json({ message: 'Access denied. Admin email not allowed.' });
      }
    }
    next();
  };
};
