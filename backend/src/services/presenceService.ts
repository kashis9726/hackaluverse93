export class PresenceService {
    // Map<userId, Set<socketId>>
    private static userSockets = new Map<string, Set<string>>();

    /**
     * Add a socket to the user's presence set.
     * Return true if this is the FIRST socket (user went online).
     */
    static async addUserSocket(userId: string, socketId: string): Promise<boolean> {
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }
        const sockets = this.userSockets.get(userId)!;
        const wasOffline = sockets.size === 0;
        sockets.add(socketId);

        // In a Redis implementation, we would SET a key here.
        return wasOffline;
    }

    /**
     * Remove a socket from the user's presence set.
     * Return true if this was the LAST socket (user went offline).
     */
    static async removeUserSocket(userId: string, socketId: string): Promise<boolean> {
        if (!this.userSockets.has(userId)) return false;

        const sockets = this.userSockets.get(userId)!;
        sockets.delete(socketId);

        if (sockets.size === 0) {
            this.userSockets.delete(userId);
            return true; // Use went offline
        }
        return false;
    }

    static isUserOnline(userId: string): boolean {
        return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
    }

    static getUserSockets(userId: string): string[] {
        if (!this.userSockets.has(userId)) return [];
        return Array.from(this.userSockets.get(userId)!);
    }
}
