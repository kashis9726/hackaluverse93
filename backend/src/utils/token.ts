/**
 * Token utilities - generation and parsing
 */
import crypto from 'crypto';

export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateDevToken = (id: string, role: string): string => {
  return `${id}:${role}`;
};

export const parseDevToken = (token: string): { id: string; role: string } | null => {
  const parts = token.split(':');
  if (parts.length !== 2) return null;
  
  const id = parts[0] as string | undefined;
  const role = parts[1] as string | undefined;
  
  if (!id || !role) return null;
  return { id, role };
};
