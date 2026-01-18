import type { UserRole } from '../middleware/authMiddleware';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface DbBlog {
  id: string;
  authorId: string;
  title?: string;
  content: string;
  createdAt: string;
}

export interface DbEvent {
  id: string;
  organizerId: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  createdAt: string;
}

export interface DbInternship {
  id: string;
  postedById: string;
  title: string;
  company?: string;
  description?: string;
  createdAt: string;
  applicants: Array<{ userId: string; appliedAt: string }>;
}

export interface DbStartup {
  id: string;
  ownerId: string;
  title: string;
  tagline?: string;
  createdAt: string;
}

export interface DbChallenge {
  id: string;
  authorId: string;
  title: string;
  description?: string;
  createdAt: string;
  submissions: Array<{ id: string; studentId: string; content: string; createdAt: string }>;
}

export interface DbQuestion {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  answers: Array<{ id: string; authorId: string; content: string; createdAt: string }>;
}

export const db = {
  users: [] as DbUser[],
  blogs: [] as DbBlog[],
  events: [] as DbEvent[],
  internships: [] as DbInternship[],
  startups: [] as DbStartup[],
  challenges: [] as DbChallenge[],
  questions: [] as DbQuestion[],
};
