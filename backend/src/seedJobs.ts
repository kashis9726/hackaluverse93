import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aluverse';

// Blog/Post Schema (for job posts)
const postSchema = new mongoose.Schema({
    authorId: String,
    author: {
        id: String,
        name: String,
        email: String,
        role: String,
        position: String,
        company: String,
    },
    content: String,
    likes: [String],
    comments: [{
        id: String,
        authorId: String,
        author: Object,
        content: String,
        createdAt: Date,
    }],
    type: String,
    image: String,
    createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Blog', postSchema);

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    position: String,
    company: String,
    department: String,
    graduationYear: Number,
    skills: [String],
    bio: String,
    isVerified: Boolean,
    isOnline: Boolean,
    points: Number,
});

const User = mongoose.model('User', userSchema);

async function seedJobs() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get existing alumni users
        const alumni = await User.find({ role: 'alumni' }).limit(3);

        if (alumni.length === 0) {
            console.log('❌ No alumni users found. Please create alumni users first.');
            process.exit(1);
        }

        console.log(`📊 Found ${alumni.length} alumni users`);

        // Sample job opportunities
        const jobs = [
            {
                title: 'Software Engineer Intern',
                company: 'Google',
                location: 'Bangalore, India',
                type: 'Internship',
                stipend: '₹80,000/month',
                skills: 'Python, Data Structures, Algorithms',
                description: 'Join our team to work on cutting-edge cloud infrastructure. You will collaborate with senior engineers on scalable systems.',
            },
            {
                title: 'Full Stack Developer',
                company: 'Microsoft',
                location: 'Hyderabad, India',
                type: 'Job',
                stipend: '₹18-25 LPA',
                skills: 'React, Node.js, TypeScript, Azure',
                description: 'Build enterprise-grade applications using modern web technologies. Work with cross-functional teams on innovative products.',
            },
            {
                title: 'Data Science Intern',
                company: 'Amazon',
                location: 'Remote',
                type: 'Internship',
                stipend: '₹60,000/month',
                skills: 'Python, Machine Learning, SQL, Statistics',
                description: 'Analyze large datasets and build ML models to improve customer experience. Mentorship from senior data scientists.',
            },
            {
                title: 'Frontend Developer',
                company: 'Flipkart',
                location: 'Bangalore, India',
                type: 'Job',
                stipend: '₹15-20 LPA',
                skills: 'React, JavaScript, CSS, Redux',
                description: 'Create beautiful and responsive user interfaces for millions of users. Work on India\'s leading e-commerce platform.',
            },
            {
                title: 'Mobile App Developer',
                company: 'Swiggy',
                location: 'Bangalore, India',
                type: 'Freelance',
                stipend: '₹40,000-60,000/project',
                skills: 'React Native, Flutter, iOS, Android',
                description: 'Develop features for our food delivery app. Flexible work hours and project-based engagement.',
            },
        ];

        // Create job posts with different alumni as authors
        const createdJobs = [];
        for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            const author = alumni[i % alumni.length]; // Rotate through alumni

            const content = [
                `${job.title} @ ${job.company} • ${job.type}`,
                `Stipend: ${job.stipend}`,
                `Skills: ${job.skills}`,
                ``,
                job.description,
            ].join('\n');

            const jobPost = new Post({
                authorId: author._id.toString(),
                author: {
                    id: author._id.toString(),
                    name: author.name,
                    email: author.email,
                    role: author.role,
                    position: author.position || 'Senior Engineer',
                    company: author.company || job.company,
                },
                content,
                likes: [],
                comments: [],
                type: 'job',
                image: null,
                createdAt: new Date(Date.now() - i * 3600000), // Stagger creation times
            });

            await jobPost.save();
            createdJobs.push(jobPost);
            console.log(`✅ Created job: ${job.title} at ${job.company} (by ${author.name})`);
        }

        console.log(`\n🎉 Successfully created ${createdJobs.length} job opportunities!`);
        console.log('\n📋 Summary:');
        createdJobs.forEach((job, i) => {
            const lines = job.content.split('\n');
            console.log(`${i + 1}. ${lines[0]} - Posted by ${job.author.name}`);
        });

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error seeding jobs:', error);
        process.exit(1);
    }
}

seedJobs();
