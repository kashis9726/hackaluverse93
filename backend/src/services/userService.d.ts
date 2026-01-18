import type { UserProfile, ProfileUpdateRequest } from '../types';
export declare class UserService {
    /**
     * Get all visible user profiles
     */
    static getAllVisibleUsers(): Promise<Partial<UserProfile>[]>;
    /**
     * Get user by ID
     */
    static getUserById(userId: string): Promise<Partial<UserProfile>>;
    /**
     * Get current user profile
     */
    static getUserProfile(userId: string): Promise<Partial<UserProfile>>;
    /**
     * Update user profile
     */
    static updateProfile(userId: string, role: string, data: ProfileUpdateRequest): Promise<Partial<UserProfile>>;
    /**
     * Toggle profile visibility
     */
    static toggleProfileVisibility(userId: string, visible: boolean): Promise<Partial<UserProfile>>;
    /**
     * Create user (admin only)
     */
    static createUser(name: string, email: string, role: string): Promise<Partial<UserProfile>>;
    /**
     * Search users by name or email
     */
    static searchUsers(query: string): Promise<Partial<UserProfile>[]>;
}
//# sourceMappingURL=userService.d.ts.map