/**
 * Seed data for students and alumni
 */
export declare const STUDENT_SEED_DATA: {
    name: string;
    email: string;
    role: string;
    password: string;
    year: string;
    branch: string;
    skills: string[];
    interests: string[];
    projects: string[];
    bio: string;
}[];
export declare const ALUMNI_SEED_DATA: ({
    name: string;
    email: string;
    role: string;
    password: string;
    company: string;
    position: string;
    domain: string;
    yearsOfExperience: number;
    availability: string;
    capabilities: string[];
    bio: string;
    linkedinUrl: string;
    githubUrl: string;
    personalWebsite?: never;
} | {
    name: string;
    email: string;
    role: string;
    password: string;
    company: string;
    position: string;
    domain: string;
    yearsOfExperience: number;
    availability: string;
    capabilities: string[];
    bio: string;
    linkedinUrl: string;
    githubUrl?: never;
    personalWebsite?: never;
} | {
    name: string;
    email: string;
    role: string;
    password: string;
    company: string;
    position: string;
    domain: string;
    yearsOfExperience: number;
    availability: string;
    capabilities: string[];
    bio: string;
    linkedinUrl: string;
    githubUrl: string;
    personalWebsite: string;
})[];
//# sourceMappingURL=seedData.d.ts.map