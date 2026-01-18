/**
 * Type definitions for the application
 */

export type UserRole = 'student' | 'alumni' | 'admin';

export interface AuthUser {
  id: string;
  role: UserRole;
  email: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  profileCompleted: boolean;
  profileVisible: boolean;
  passwordHash?: string;
  authToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfile extends IUser {
  profileImage?: string;
  department?: string;
  year?: string;
  graduationYear?: number;
  skills?: string[];
  interests?: string[];
  projects?: string[];
  company?: string;
  position?: string;
  bio?: string;
  startup?: string;
  branch?: string;
  domain?: string;
  yearsOfExperience?: number;
  availability?: 'Busy' | 'Limited' | 'Open';
  capabilities?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  personalWebsite?: string;
  points?: number;
  badges?: string[];
  isVerified?: boolean;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface SignupRequest {
  name?: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: UserRole;
}

export interface ProfileUpdateRequest {
  // Student fields
  year?: string;
  branch?: string;
  skills?: string[];
  interests?: string[];
  projects?: string[];
  
  // Alumni fields
  company?: string;
  position?: string;
  domain?: string;
  yearsOfExperience?: number;
  availability?: string;
  capabilities?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  personalWebsite?: string;
  bio?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: Partial<UserProfile>;
  token: string;
}

export interface MemoryUser extends UserProfile {
  _id: string;
  id: string;
  passwordHash?: string;
}
