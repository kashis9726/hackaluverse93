/**
 * General utility functions
 */

export const getBearerToken = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  return token || null;
};

export const isObjectId = (id: any): boolean => {
  return typeof id === 'string' && id.length === 24 && /^[0-9a-f]{24}$/.test(id);
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const safeJsonParse = <T = any>(json: string, defaultValue?: T): T | undefined => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
};

export const pickFields = <T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): Partial<T> => {
  const result: Partial<T> = {};
  fields.forEach(field => {
    if (field in obj) {
      result[field] = obj[field];
    }
  });
  return result;
};

export const omitFields = <T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): Partial<T> => {
  const result = { ...obj };
  fields.forEach(field => {
    delete result[field];
  });
  return result;
};

/**
 * Convert error to response message
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
};

/**
 * Log with timestamp
 */
export const log = (label: string, message: string, data?: any): void => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] ${label}`;
  if (data) {
    // eslint-disable-next-line no-console
    console.log(prefix, message, data);
  } else {
    // eslint-disable-next-line no-console
    console.log(prefix, message);
  }
};

export const logError = (label: string, error: unknown): void => {
  const timestamp = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.error(`[${timestamp}] ${label}:`, error);
};
