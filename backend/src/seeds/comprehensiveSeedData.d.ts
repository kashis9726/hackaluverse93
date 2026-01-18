/**
 * Comprehensive seed data for blogs, questions, and answers
 * This creates realistic content related to users
 */
export declare const BLOGS_SEED_DATA: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author_id: string;
    tags: string[];
    category: string;
    views: number;
    likes: number;
    published_at: Date;
}[];
export declare const QUESTIONS_SEED_DATA: {
    title: string;
    description: string;
    content: string;
    author_id: string;
    tags: string[];
    category: string;
    views: number;
    answers_count: number;
    upvotes: number;
    created_at: Date;
}[];
export declare const ANSWERS_SEED_DATA: {
    question_id: number;
    content: string;
    author_id: string;
    upvotes: number;
    is_accepted: boolean;
    created_at: Date;
}[];
export declare const CHALLENGES_SEED_DATA: {
    title: string;
    description: string;
    difficulty: string;
    tags: string[];
    points: number;
    participants: number;
    created_by: string;
    deadline: Date;
}[];
export declare const INTERNSHIP_SEED_DATA: {
    title: string;
    company: string;
    description: string;
    duration: string;
    stipend: string;
    skills_required: string[];
    posted_by: string;
    applications: number;
    posted_at: Date;
}[];
export declare const EVENTS_SEED_DATA: {
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
    speaker: string;
    capacity: number;
    registrations: number;
    tags: string[];
    organized_by: string;
}[];
export declare const STARTUP_SEED_DATA: ({
    name: string;
    description: string;
    founder: string;
    founder_email: string;
    stage: string;
    looking_for: string;
    tech_stack: string[];
    pitch: string;
    website: string;
    posted_at: Date;
} | {
    name: string;
    description: string;
    founder: string;
    founder_email: string;
    stage: string;
    looking_for: string;
    tech_stack: string[];
    pitch: string;
    posted_at: Date;
    website?: never;
})[];
//# sourceMappingURL=comprehensiveSeedData.d.ts.map