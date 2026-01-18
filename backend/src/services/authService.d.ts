import type { SignupRequest, LoginRequest, AuthResponse, UserProfile } from '../types';
export declare class AuthService {
    /**
     * Register a new user
     */
    static signup(req: SignupRequest): Promise<AuthResponse>;
    /**
     * Login user
     */
    static login(req: LoginRequest): Promise<AuthResponse>;
    /**
     * Admin login
     */
    static adminLogin(email: string): Promise<AuthResponse>;
    /**
     * Verify token and get user
     */
    static verifyToken(token: string): Promise<Partial<UserProfile>>;
}
//# sourceMappingURL=authService.d.ts.map