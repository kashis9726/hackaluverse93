/**
 * Password utilities - hashing and verification
 */
import crypto from 'crypto';
import { PASSWORDS } from '../constants';

export const hashPassword = (password: string): string => {
  const iterations = PASSWORDS.ITERATIONS;
  const salt = crypto.randomBytes(16);
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
  return `${PASSWORDS.ALGORITHM}$${iterations}$${salt.toString('base64')}$${derivedKey.toString('base64')}`;
};

export const verifyPassword = (password: string, stored: string): boolean => {
  try {
    const [algo, iterRaw, saltB64, hashB64] = stored.split('$');
    if (algo !== PASSWORDS.ALGORITHM) return false;
    
    const iterations = Number(iterRaw);
    if (!Number.isFinite(iterations) || iterations <= 0) return false;
    if (!saltB64 || !hashB64) return false;
    
    const salt = Buffer.from(saltB64, 'base64');
    const expected = Buffer.from(hashB64, 'base64');
    const actual = crypto.pbkdf2Sync(password, salt, iterations, expected.length, 'sha256');
    
    if (expected.length !== actual.length) return false;
    return crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
};
