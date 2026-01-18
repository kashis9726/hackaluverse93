"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Comprehensive Seed Script - Professional Platform Data
 * Populates MongoDB with realistic interconnected data:
 * - Students & Alumni Users
 * - Blogs (by Alumni)
 * - Questions (by Students) & Answers (by Alumni)
 * - Events, Challenges, Internships, Startups
 * Run: npm run seed
 */
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("./models/User"));
const Blog_1 = __importDefault(require("./models/Blog"));
const Question_1 = __importDefault(require("./models/Question"));
const Answer_1 = __importDefault(require("./models/Answer"));
const Event_1 = __importDefault(require("./models/Event"));
const Challenge_1 = __importDefault(require("./models/Challenge"));
const Internship_1 = __importDefault(require("./models/Internship"));
const Startup_1 = __importDefault(require("./models/Startup"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const hashPassword = (password) => {
    const iterations = 120000;
    const salt = crypto_1.default.randomBytes(16);
    const derivedKey = crypto_1.default.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
    return `pbkdf2$${iterations}$${salt.toString('base64')}$${derivedKey.toString('base64')}`;
};
const newToken = () => crypto_1.default.randomBytes(32).toString('hex');
const studentUsers = [
    {
        name: 'Kashish Kumar',
        email: 'kashish@ldce.ac.in',
        role: 'student',
        password: 'password123',
        year: '3rd Year',
        branch: 'Computer Science',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        interests: ['Web Development', 'AI', 'Open Source'],
        projects: ['E-commerce App', 'Chat Application', 'Portfolio Website'],
        bio: 'Passionate developer interested in full-stack development',
    },
    {
        name: 'Priya Sharma',
        email: 'priya@ldce.ac.in',
        role: 'student',
        password: 'password123',
        year: '2nd Year',
        branch: 'Information Technology',
        skills: ['Python', 'Data Science', 'Machine Learning', 'SQL'],
        interests: ['Machine Learning', 'Data Analytics', 'Cloud Computing'],
        projects: ['Predictive Analytics', 'Recommendation System'],
        bio: 'Data science enthusiast with passion for solving real-world problems',
    },
    {
        name: 'Arjun Patel',
        email: 'arjun@ldce.ac.in',
        role: 'student',
        password: 'password123',
        year: '3rd Year',
        branch: 'Computer Science',
        skills: ['Java', 'Spring Boot', 'AWS', 'Docker'],
        interests: ['Backend Development', 'DevOps', 'Microservices'],
        projects: ['Distributed Payment System', 'Cloud Infrastructure'],
        bio: 'Backend engineer focused on scalable architecture',
    },
    {
        name: 'Neha Verma',
        email: 'neha@ldce.ac.in',
        role: 'student',
        password: 'password123',
        year: '1st Year',
        branch: 'Electronics & Communication',
        skills: ['C++', 'Python', 'IoT', 'Embedded Systems'],
        interests: ['IoT', 'Robotics', 'Embedded Systems'],
        projects: ['Smart Home System', 'IoT Weather Station'],
        bio: 'IoT enthusiast working on smart device solutions',
    },
    {
        name: 'Rohan Singh',
        email: 'rohan@ldce.ac.in',
        role: 'student',
        password: 'password123',
        year: '2nd Year',
        branch: 'Computer Science',
        skills: ['React', 'Vue.js', 'CSS', 'UI/UX Design'],
        interests: ['Frontend Development', 'UI/UX Design', 'Web Design'],
        projects: ['Design System', 'SaaS Dashboard', 'Mobile App UI'],
        bio: 'Frontend developer passionate about creating beautiful user interfaces',
    },
];
const alumniUsers = [
    {
        name: 'Rahul Desai',
        email: 'rahul@ldce.ac.in',
        role: 'alumni',
        password: 'password123',
        company: 'Google India',
        position: 'Senior Software Engineer',
        domain: 'Cloud & Infrastructure',
        yearsOfExperience: 5,
        availability: 'Open',
        capabilities: ['System Design', 'Cloud Architecture', 'Team Leadership'],
        bio: 'Senior engineer at Google with expertise in distributed systems',
        linkedinUrl: 'https://linkedin.com/in/rahul-desai',
        githubUrl: 'https://github.com/rahul-desai',
    },
    {
        name: 'Anjali Gupta',
        email: 'anjali@ldce.ac.in',
        role: 'alumni',
        password: 'password123',
        company: 'Microsoft',
        position: 'Product Manager',
        domain: 'Product Management',
        yearsOfExperience: 4,
        availability: 'Limited',
        capabilities: ['Product Strategy', 'User Research', 'Analytics'],
        bio: 'Product Manager at Microsoft building cloud solutions',
        linkedinUrl: 'https://linkedin.com/in/anjali-gupta',
    },
    {
        name: 'Vikram Sharma',
        email: 'vikram@ldce.ac.in',
        role: 'alumni',
        password: 'password123',
        company: 'Startup XYZ',
        position: 'CTO & Co-founder',
        domain: 'Entrepreneurship',
        yearsOfExperience: 3,
        availability: 'Busy',
        capabilities: ['Startup Building', 'Technical Leadership', 'Fundraising'],
        bio: 'Startup founder building the next generation of SaaS tools',
        linkedinUrl: 'https://linkedin.com/in/vikram-sharma',
        githubUrl: 'https://github.com/vikram-sharma',
        personalWebsite: 'https://vikram-sharma.dev',
    },
    {
        name: 'Divya Patel',
        email: 'divya@ldce.ac.in',
        role: 'alumni',
        password: 'password123',
        company: 'Amazon',
        position: 'Senior Data Scientist',
        domain: 'Machine Learning',
        yearsOfExperience: 6,
        availability: 'Limited',
        capabilities: ['Machine Learning', 'Big Data', 'Statistical Analysis'],
        bio: 'Data scientist at Amazon working on recommendation engines',
        linkedinUrl: 'https://linkedin.com/in/divya-patel',
        githubUrl: 'https://github.com/divya-patel',
    },
];
async function seedDatabase() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI not set in .env file');
            process.exit(1);
        }
        await mongoose_1.default.connect(mongoUri);
        console.log('✓ Connected to MongoDB');
        // Clear all collections
        await User_1.default.deleteMany({});
        await Blog_1.default.deleteMany({});
        await Question_1.default.deleteMany({});
        await Answer_1.default.deleteMany({});
        await Event_1.default.deleteMany({});
        await Challenge_1.default.deleteMany({});
        await Internship_1.default.deleteMany({});
        await Startup_1.default.deleteMany({});
        console.log('✓ Cleared all collections');
        const userMap = {};
        // ==================== SEED USERS ====================
        console.log('\n👨‍🎓 Seeding Students...');
        for (const student of studentUsers) {
            const user = await User_1.default.create({
                name: student.name,
                email: student.email.toLowerCase(),
                role: student.role,
                passwordHash: hashPassword(student.password),
                authToken: newToken(),
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
            console.log(`   ✓ ${student.name}`);
        }
        console.log('\n🎓 Seeding Alumni...');
        for (const alumni of alumniUsers) {
            const user = await User_1.default.create({
                name: alumni.name,
                email: alumni.email.toLowerCase(),
                role: alumni.role,
                passwordHash: hashPassword(alumni.password),
                authToken: newToken(),
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
            console.log(`   ✓ ${alumni.name}`);
        }
        // ==================== SEED BLOGS (Alumni) ====================
        console.log('\n📝 Seeding Blogs by Alumni...');
        const blogs = [
            {
                authorId: userMap['Rahul Desai'],
                type: 'post',
                content: 'Building Scalable Systems with Node.js & MongoDB\n\nIn this comprehensive guide, I share my experience building distributed systems at Google. Learn about scaling strategies, database optimization, caching mechanisms, and best practices for production systems. We discuss how to handle millions of concurrent users.',
                image: 'https://via.placeholder.com/400x250?text=Scalable+Systems',
                tags: ['Backend', 'Node.js', 'Scalability', 'MongoDB'],
                likes: [],
                comments: [],
            },
            {
                authorId: userMap['Divya Patel'],
                type: 'post',
                content: 'ML Models in Production: Real-world Challenges\n\nDeploying ML models is different from training them. In this post, I discuss the challenges we face at Amazon with real-time inference, monitoring, continuous retraining, and handling model drift. Learn from production-level ML experiences.',
                image: 'https://via.placeholder.com/400x250?text=ML+Production',
                tags: ['ML', 'Production', 'DataScience', 'AWS'],
                likes: [],
                comments: [],
            },
            {
                authorId: userMap['Vikram Sharma'],
                type: 'post',
                content: 'From Idea to IPO: Our Startup Journey\n\nStarting a company is exciting but challenging. Here are the lessons I learned building our SaaS product from scratch, raising funds from VCs, scaling the team from 2 to 50, navigating the market, and preparing for IPO.',
                image: 'https://via.placeholder.com/400x250?text=Startup+Journey',
                tags: ['Startup', 'Entrepreneurship', 'Fundraising', 'Growth'],
                likes: [],
                comments: [],
            },
            {
                authorId: userMap['Anjali Gupta'],
                type: 'post',
                content: 'Product Strategy: Data-Driven Decision Making\n\nAt Microsoft, we make every product decision based on data. Learn how to conduct user research, analyze metrics, run A/B tests, and make informed product choices. Discover frameworks for prioritizing features and measuring impact.',
                image: 'https://via.placeholder.com/400x250?text=Product+Strategy',
                tags: ['ProductManagement', 'Strategy', 'Analytics', 'UX'],
                likes: [],
                comments: [],
            },
        ];
        for (const blog of blogs) {
            await Blog_1.default.create(blog);
            const authorName = Object.keys(userMap).find(k => userMap[k] === blog.authorId);
            console.log(`   ✓ "${blog.content.split('\n')[0]}" by ${authorName}`);
        }
        // ==================== SEED QUESTIONS (Students) ====================
        console.log('\n❓ Seeding Questions by Students...');
        const questions = [
            {
                authorId: userMap['Kashish Kumar'],
                title: 'How to optimize React component rendering performance?',
                content: 'I have a large React app with many nested components and complex state. Rendering is slow. How can I prevent unnecessary re-renders and improve performance?',
                tags: ['React', 'Performance', 'Frontend', 'JavaScript'],
                answers: [],
            },
            {
                authorId: userMap['Priya Sharma'],
                title: 'REST API vs GraphQL - When should I use which?',
                content: 'I understand both REST and GraphQL but cannot decide which to use for my project. What are the tradeoffs between them?',
                tags: ['API', 'GraphQL', 'REST', 'Backend', 'Architecture'],
                answers: [],
            },
            {
                authorId: userMap['Arjun Patel'],
                title: 'Best practices for Node.js error handling in production?',
                content: 'My Node.js server crashes occasionally. How should I implement proper error handling, logging, and recovery?',
                tags: ['Node.js', 'Error Handling', 'Production', 'Backend', 'Best Practices'],
                answers: [],
            },
            {
                authorId: userMap['Neha Verma'],
                title: 'How to get started with Machine Learning?',
                content: 'I want to learn ML but don\'t know where to start. Any recommendations for beginners? What language should I use?',
                tags: ['ML', 'Learning', 'DataScience', 'Python', 'Career'],
                answers: [],
            },
            {
                authorId: userMap['Rohan Singh'],
                title: 'Docker vs Virtual Machines - Which one to use?',
                content: 'What\'s the difference between containerization and VMs? When should I use each? How to get started with Docker?',
                tags: ['Docker', 'DevOps', 'Infrastructure', 'Cloud', 'Containers'],
                answers: [],
            },
        ];
        for (const question of questions) {
            await Question_1.default.create(question);
            console.log(`   ✓ "${question.title.substring(0, 50)}..."`);
        }
        // ==================== SEED ANSWERS (Alumni) ====================
        console.log('\n💬 Seeding Answers by Alumni...');
        // Get first 2 questions to add answers
        const createdQuestions = await Question_1.default.find().limit(2);
        if (createdQuestions && createdQuestions.length > 0) {
            const answers = [
                {
                    questionId: createdQuestions[0]._id,
                    authorId: userMap['Rahul Desai'],
                    content: 'Use React.memo() to memoize components, useMemo() and useCallback() hooks to memoize values and functions, and code splitting for lazy loading. These techniques significantly improve rendering performance in large apps.',
                    upvotes: [],
                },
                {
                    questionId: createdQuestions[1]._id,
                    authorId: userMap['Divya Patel'],
                    content: 'It depends on your use case. REST is simpler and great for straightforward CRUD APIs. GraphQL excels with complex queries, multiple data sources, and when you need precise data requirements. GraphQL has more setup overhead.',
                    upvotes: [],
                },
            ];
            for (const answer of answers) {
                await Answer_1.default.create(answer);
                console.log(`   ✓ Answer added by ${Object.keys(userMap).find(k => userMap[k] === answer.authorId)}`);
            }
        }
        // ==================== SEED EVENTS ====================
        console.log('\n📅 Seeding Events...');
        const events = [
            {
                organizerId: userMap['Rahul Desai'],
                title: 'Web Development Masterclass Workshop',
                description: 'Learn modern web development with React, Node.js, and MongoDB from industry experts at Google',
                date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                location: 'LDCE Campus, Auditorium A',
                type: 'workshop',
                attendees: [],
                maxAttendees: 150,
            },
            {
                organizerId: userMap['Divya Patel'],
                title: 'AI & Machine Learning Bootcamp',
                description: 'Deep dive into ML, Deep Learning, NLP and Computer Vision with hands-on projects using Python',
                date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                location: 'LDCE Campus, Lab Block',
                type: 'seminar',
                attendees: [],
                maxAttendees: 100,
            },
            {
                organizerId: userMap['Vikram Sharma'],
                title: 'Startup Masterclass & Pitch Competition',
                description: 'Learn from successful founders how to build and scale startups. Includes live pitch competition with prizes',
                date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                location: 'LDCE Campus, Main Hall',
                type: 'seminar',
                attendees: [],
                maxAttendees: 200,
            },
        ];
        for (const event of events) {
            await Event_1.default.create(event);
            console.log(`   ✓ ${event.title}`);
        }
        // ==================== SEED CHALLENGES ====================
        console.log('\n🎯 Seeding Coding Challenges...');
        const challenges = [
            {
                authorId: userMap['Rahul Desai'],
                title: 'Build a Real-time Chat Application',
                description: 'Create a chat app using WebSockets, Node.js, and React with user authentication and message persistence',
                prize: '₹5,000 + Certificate',
                deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                submissions: [],
            },
            {
                authorId: userMap['Priya Sharma'],
                title: 'Full-Stack Task Management System',
                description: 'Build a complete task management app with filtering, sorting, and persistent storage using MongoDB',
                prize: '₹4,000 + Certificate',
                deadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
                submissions: [],
            },
            {
                authorId: userMap['Divya Patel'],
                title: 'ML Classification with Real-world Dataset',
                description: 'Build an ML classifier to predict outcomes on a real-world dataset with >95% accuracy',
                prize: '₹6,000 + Certificate',
                deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
                submissions: [],
            },
        ];
        for (const challenge of challenges) {
            await Challenge_1.default.create(challenge);
            console.log(`   ✓ ${challenge.title}`);
        }
        // ==================== SEED INTERNSHIPS ====================
        console.log('\n💼 Seeding Internship Opportunities...');
        const internships = [
            {
                postedById: userMap['Rahul Desai'],
                title: 'Full Stack Developer Internship',
                company: 'Google India',
                stipend: '₹50,000/month',
                type: 'Remote-Friendly',
                location: 'Bangalore',
                skills: ['Node.js', 'React', 'MongoDB', 'JavaScript'],
                description: 'Work on real products used by millions of users worldwide at Google. Build scalable systems and learn industry best practices.',
                applicants: [],
            },
            {
                postedById: userMap['Divya Patel'],
                title: 'Data Science Internship',
                company: 'Amazon',
                stipend: '₹60,000/month',
                type: 'Hybrid',
                location: 'Bangalore',
                skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
                description: 'Build ML models for recommendation engines and analytics. Work with massive datasets at Amazon scale.',
                applicants: [],
            },
        ];
        for (const internship of internships) {
            await Internship_1.default.create(internship);
            console.log(`   ✓ ${internship.title} at ${internship.company}`);
        }
        // ==================== SEED STARTUPS ====================
        console.log('\n🚀 Seeding Startup Ideas...');
        const startups = [
            {
                ownerId: userMap['Kashish Kumar'],
                title: 'EduTech Pro - AI Learning Platform',
                tagline: 'Personalized learning powered by AI for students',
                stage: 'mvp',
                problem: 'Traditional education doesn\'t adapt to individual learning styles',
                solution: 'AI-powered platform that personalizes content based on student performance',
                progress: 'MVP ready with 1000+ users in beta',
                fundingNeeded: '₹50 Lakhs for Series A',
                attachments: [],
                likes: [],
                comments: [],
            },
            {
                ownerId: userMap['Priya Sharma'],
                title: 'DataInsight Analytics - B2B Analytics',
                tagline: 'Real-time business intelligence for every company',
                stage: 'prototype',
                problem: 'Businesses lack real-time insights into operations',
                solution: 'SaaS platform that provides real-time analytics and dashboards',
                progress: 'Prototype built, looking for beta customers',
                fundingNeeded: '₹25 Lakhs for product development',
                attachments: [],
                likes: [],
                comments: [],
            },
            {
                ownerId: userMap['Neha Verma'],
                title: 'SmartHome IoT Hub - Open Source IoT',
                tagline: 'Open-source IoT platform for smart home automation',
                stage: 'prototype',
                problem: 'Smart home solutions are expensive and proprietary',
                solution: 'Open-source IoT platform that\'s affordable and extensible',
                progress: 'Core platform developed, 500+ GitHub stars',
                fundingNeeded: '₹30 Lakhs for hardware development',
                attachments: [],
                likes: [],
                comments: [],
            },
        ];
        for (const startup of startups) {
            await Startup_1.default.create(startup);
            console.log(`   ✓ ${startup.title}`);
        }
        // ==================== COMPLETION SUMMARY ====================
        console.log('\n✅ DATABASE SEEDING COMPLETED!\n');
        console.log('📊 Summary:');
        console.log(`   👥 Users: ${studentUsers.length} Students + ${alumniUsers.length} Alumni = ${studentUsers.length + alumniUsers.length} total`);
        console.log(`   📝 Blogs: ${blogs.length} (by Alumni)`);
        console.log(`   ❓ Questions: ${questions.length} (by Students)`);
        console.log(`   💬 Answers: ${2} (by Alumni)`);
        console.log(`   📅 Events: ${events.length}`);
        console.log(`   🎯 Challenges: ${challenges.length}`);
        console.log(`   💼 Internships: ${internships.length}`);
        console.log(`   🚀 Startups: ${startups.length}`);
        console.log('\n🎨 All realistic interconnected data is now in MongoDB!');
        console.log('👁️  Check MongoDB Compass to see all collections populated\n');
        await mongoose_1.default.connection.close();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
}
// Execute seeding
void seedDatabase();
//# sourceMappingURL=seeds.js.map