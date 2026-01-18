import type { NextFunction, Request, Response } from 'express';
export type UserRole = 'student' | 'alumni' | 'admin';
export interface AuthUser {
    id: string;
    role: UserRole;
    email: string;
}
export interface AuthRequest extends Request {
    user?: AuthUser;
}
export declare const requireAuth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const requireProfileCompleted: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const requireRole: (roles: UserRole[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authMiddleware.d.ts.map