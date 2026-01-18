export declare const generateToken: () => string;
export declare const generateDevToken: (id: string, role: string) => string;
export declare const parseDevToken: (token: string) => {
    id: string;
    role: string;
} | null;
//# sourceMappingURL=token.d.ts.map