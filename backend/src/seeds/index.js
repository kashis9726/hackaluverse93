"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Database seeding script
 * Usage: npm run seed
 */
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const Blog_1 = __importDefault(require("../models/Blog"));
const Question_1 = __importDefault(require("../models/Question"));
const Answer_1 = __importDefault(require("../models/Answer"));
const Event_1 = __importDefault(require("../models/Event"));
const Challenge_1 = __importDefault(require("../models/Challenge"));
const Internship_1 = __importDefault(require("../models/Internship"));
const Startup_1 = __importDefault(require("../models/Startup"));
const password_1 = require("../utils/password");
const token_1 = require("../utils/token");
const seedData_1 = require("./seedData");
const comprehensiveSeedData_1 = require("./comprehensiveSeedData");
const utils_1 = require("../utils");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
async function seedDatabase() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI not set in .env file');
        }
        await mongoose_1.default.connect(mongoUri);
        (0, utils_1.log)('[SEED]', '✓ Connected to MongoDB');
        // Clear existing users
        await User_1.default.deleteMany({});
        (0, utils_1.log)('[SEED]', '✓ Cleared existing users');
        // Create user map for reference
        const userMap = {};
        // Seed students
        for (const student of seedData_1.STUDENT_SEED_DATA) {
            const user = await User_1.default.create({
                name: student.name,
                email: student.email.toLowerCase(),
                role: student.role,
                passwordHash: (0, password_1.hashPassword)(student.password),
                authToken: (0, token_1.generateToken)(),
                profileCompleted: true,
                profileVisible: true,
                year: student.year,
                branch: student.branch,
                skills: student.skills,
                interests: student.interests,
                projects: student.projects,
                bio: student.bio,
                isVerified: true,
            });
            userMap[student.name] = user._id.toString();
            (0, utils_1.log)('[SEED]', `✓ Created student: ${student.name}`);
        }
        // Seed alumni
        for (const alumni of seedData_1.ALUMNI_SEED_DATA) {
            const user = await User_1.default.create({
                name: alumni.name,
                email: alumni.email.toLowerCase(),
                role: alumni.role,
                passwordHash: (0, password_1.hashPassword)(alumni.password),
                authToken: (0, token_1.generateToken)(),
                profileCompleted: true,
                profileVisible: true,
                company: alumni.company,
                position: alumni.position,
                domain: alumni.domain,
                yearsOfExperience: alumni.yearsOfExperience,
                availability: alumni.availability,
                capabilities: alumni.capabilities,
                bio: alumni.bio,
                linkedinUrl: alumni.linkedinUrl,
                githubUrl: alumni.githubUrl,
                personalWebsite: alumni.personalWebsite,
                isVerified: true,
            });
            userMap[alumni.name] = user._id.toString();
            (0, utils_1.log)('[SEED]', `✓ Created alumni: ${alumni.name}`);
        }
        // Seed blogs
        (0, utils_1.log)('[SEED]', '\n📝 Seeding Blogs...');
        for (const blog of comprehensiveSeedData_1.BLOGS_SEED_DATA) {
            await Blog_1.default.create({
                title: blog.title,
                slug: blog.slug,
                content: blog.content,
                excerpt: blog.excerpt,
                author: userMap['Rahul Desai'] || userMap['Divya Patel'] || userMap['Vikram Sharma'] || userMap['Anjali Gupta'],
                tags: blog.tags,
                category: blog.category,
                views: blog.views,
                likes: blog.likes,
                published_at: blog.published_at,
                createdAt: blog.published_at,
            });
            (0, utils_1.log)('[SEED]', `✓ Created blog: ${blog.title}`);
        }
        // Seed questions and answers
        (0, utils_1.log)('[SEED]', '\n❓ Seeding Questions & Answers...');
        for (let i = 0; i < comprehensiveSeedData_1.QUESTIONS_SEED_DATA.length; i++) {
            const q = comprehensiveSeedData_1.QUESTIONS_SEED_DATA[i];
            if (!q)
                continue;
            const question = await Question_1.default.create({
                title: q.title,
                description: q.description,
                content: q.content,
                author: userMap['Kashish Kumar'] || userMap['Priya Sharma'] || userMap['Arjun Patel'] || userMap['Neha Verma'] || userMap['Rohan Singh'],
                tags: q.tags,
                category: q.category,
                views: q.views,
                upvotes: q.upvotes,
                createdAt: q.created_at,
            });
            // Seed corresponding answers
            for (const answer of comprehensiveSeedData_1.ANSWERS_SEED_DATA.filter(a => a.question_id === i)) {
                await Answer_1.default.create({
                    question: question._id,
                    content: answer.content,
                    author: userMap['Rahul Desai'] || userMap['Vikram Sharma'],
                    upvotes: answer.upvotes,
                    isAccepted: answer.is_accepted,
                    createdAt: answer.created_at,
                });
            }
            (0, utils_1.log)('[SEED]', `✓ Created question: ${q.title}`);
        }
        // Seed events
        (0, utils_1.log)('[SEED]', '\n📅 Seeding Events...');
        for (const event of comprehensiveSeedData_1.EVENTS_SEED_DATA) {
            await Event_1.default.create({
                title: event.title,
                description: event.description,
                date: event.date,
                time: event.time,
                location: event.location,
                speaker: event.speaker,
                capacity: event.capacity,
                registrations: event.registrations,
                tags: event.tags,
                organizer: userMap['Rahul Desai'] || userMap['Divya Patel'] || userMap['Vikram Sharma'],
                createdAt: new Date(),
            });
            (0, utils_1.log)('[SEED]', `✓ Created event: ${event.title}`);
        }
        // Seed challenges
        (0, utils_1.log)('[SEED]', '\n🎯 Seeding Challenges...');
        for (const challenge of comprehensiveSeedData_1.CHALLENGES_SEED_DATA) {
            await Challenge_1.default.create({
                title: challenge.title,
                description: challenge.description,
                difficulty: challenge.difficulty,
                tags: challenge.tags,
                points: challenge.points,
                participants: challenge.participants,
                createdBy: userMap['Rahul Desai'] || userMap['Anjali Gupta'] || userMap['Divya Patel'],
                deadline: challenge.deadline,
                createdAt: new Date(),
            });
            (0, utils_1.log)('[SEED]', `✓ Created challenge: ${challenge.title}`);
        }
        // Seed internships
        (0, utils_1.log)('[SEED]', '\n💼 Seeding Internships...');
        for (const internship of comprehensiveSeedData_1.INTERNSHIP_SEED_DATA) {
            await Internship_1.default.create({
                title: internship.title,
                company: internship.company,
                description: internship.description,
                duration: internship.duration,
                stipend: internship.stipend,
                skillsRequired: internship.skills_required,
                postedBy: userMap['Rahul Desai'] || userMap['Divya Patel'],
                applications: internship.applications,
                postedAt: internship.posted_at,
                createdAt: internship.posted_at,
            });
            (0, utils_1.log)('[SEED]', `✓ Created internship: ${internship.title}`);
        }
        // Seed startups
        (0, utils_1.log)('[SEED]', '\n🚀 Seeding Startups...');
        for (const startup of comprehensiveSeedData_1.STARTUP_SEED_DATA) {
            await Startup_1.default.create({
                name: startup.name,
                description: startup.description,
                founder: startup.founder,
                founderEmail: startup.founder_email,
                stage: startup.stage,
                lookingFor: startup.looking_for,
                techStack: startup.tech_stack,
                pitch: startup.pitch,
                website: startup.website,
                createdAt: startup.posted_at,
            });
            (0, utils_1.log)('[SEED]', `✓ Created startup: ${startup.name}`);
        }
        (0, utils_1.log)('[SEED]', '\n✓ Database seeding completed successfully!');
        (0, utils_1.log)('[SEED]', `\n📊 Summary:`);
        (0, utils_1.log)('[SEED]', `   - Students: ${seedData_1.STUDENT_SEED_DATA.length}`);
        (0, utils_1.log)('[SEED]', `   - Alumni: ${seedData_1.ALUMNI_SEED_DATA.length}`);
        (0, utils_1.log)('[SEED]', `   - Total Users: ${seedData_1.STUDENT_SEED_DATA.length + seedData_1.ALUMNI_SEED_DATA.length}`);
        (0, utils_1.log)('[SEED]', `   - Blogs: ${comprehensiveSeedData_1.BLOGS_SEED_DATA.length}`);
        (0, utils_1.log)('[SEED]', `   - Questions: ${comprehensiveSeedData_1.QUESTIONS_SEED_DATA.length}`);
        (0, utils_1.log)('[SEED]', `   - Answers: ${comprehensiveSeedData_1.ANSWERS_SEED_DATA.length}`);
        (0, utils_1.log)('[SEED]', `   - Events: ${comprehensiveSeedData_1.EVENTS_SEED_DATA.length}`);
        (0, utils_1.log)('[SEED]', `   - Challenges: ${comprehensiveSeedData_1.CHALLENGES_SEED_DATA.length}`);
        (0, utils_1.log)('[SEED]', `   - Internships: ${comprehensiveSeedData_1.INTERNSHIP_SEED_DATA.length}`);
        (0, utils_1.log)('[SEED]', `   - Startups: ${comprehensiveSeedData_1.STARTUP_SEED_DATA.length}`);
        (0, utils_1.log)('[SEED]', '\n💡 All data is now in MongoDB Compass!');
        (0, utils_1.log)('[SEED]', '🎨 Frontend will display this data professionally!');
        await mongoose_1.default.connection.close();
        process.exit(0);
    }
    catch (error) {
        (0, utils_1.logError)('[SEED]', error);
        process.exit(1);
    }
}
void seedDatabase();
//# sourceMappingURL=index.js.map