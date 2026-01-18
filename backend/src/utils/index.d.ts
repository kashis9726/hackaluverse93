/**
 * General utility functions
 */
export declare const getBearerToken: (authHeader: string | undefined) => string | null;
export declare const isObjectId: (id: any) => boolean;
export declare const delay: (ms: number) => Promise<void>;
export declare const safeJsonParse: <T = any>(json: string, defaultValue?: T) => T | undefined;
export declare const pickFields: <T extends Record<string, any>>(obj: T, fields: (keyof T)[]) => Partial<T>;
export declare const omitFields: <T extends Record<string, any>>(obj: T, fields: (keyof T)[]) => Partial<T>;
/**
 * Convert error to response message
 */
export declare const getErrorMessage: (error: unknown) => string;
/**
 * Log with timestamp
 */
export declare const log: (label: string, message: string, data?: any) => void;
export declare const logError: (label: string, error: unknown) => void;
//# sourceMappingURL=index.d.ts.map