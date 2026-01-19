/**
 * Comprehensive Seed Script - Professional Platform Data
 * Populates MongoDB with realistic interconnected data:
 * - Students & Alumni Users
 * - Blogs (by Alumni)
 * - Questions (by Students) & Answers (by Alumni)
 * - Events, Challenges, Internships, Startups
 * Run: npm run seed
 */
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import crypto from 'crypto';
import User from './models/User';
import Blog from './models/Blog';
import Question from './models/Question';
import Answer from './models/Answer';
import Event from './models/Event';
import Challenge from './models/Challenge';
import ReversePitch from './models/ReversePitch'; // Added
import Internship from './models/Internship';
import Startup from './models/Startup';
import Connection from './models/Connection';
import SearchHistory from './models/SearchHistory';
import ProfileView from './models/ProfileView';
import Notification from './models/Notification';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const hashPassword = (password: string): string => {
  const iterations = 120000;
  const salt = crypto.randomBytes(16);
  const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
  return `pbkdf2$${iterations}$${salt.toString('base64')}$${derivedKey.toString('base64')}`;
};

const newToken = () => crypto.randomBytes(32).toString('hex');

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

    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Clear all collections
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});
    await Event.deleteMany({});
    await Challenge.deleteMany({});
    await (ReversePitch as any).deleteMany({}); // Added
    await Internship.deleteMany({});
    await Startup.deleteMany({});

    // Clear new features
    await Connection.deleteMany({});
    await SearchHistory.deleteMany({});
    await ProfileView.deleteMany({});
    await Notification.deleteMany({});
    console.log('✓ Cleared all collections');

    const userMap: { [key: string]: string } = {};

    // ==================== SEED USERS ====================
    console.log('\n👨‍🎓 Seeding Students...');
    for (const student of studentUsers) {
      const user = await User.create({
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

    // Generate 15 more random Students
    for (let i = 0; i < 15; i++) {
      const name = `Student ${i + 1}`;
      const user = await User.create({
        name,
        email: `student${i + 1}@ldce.ac.in`,
        role: 'student',
        passwordHash: hashPassword('password123'),
        authToken: newToken(),
        profileCompleted: true,
        year: ['1st', '2nd', '3rd', '4th'][Math.floor(Math.random() * 4)] + ' Year',
        branch: ['Computer Science', 'IT', 'EC', 'Mechanical', 'Civil'][Math.floor(Math.random() * 5)],
        skills: ['Java', 'Python', 'C++'].sort(() => 0.5 - Math.random()).slice(0, 2),
        interests: ['Coding', 'Sports', 'Music'],
        isVerified: true
      });
      userMap[name] = user._id.toString();
      // console.log(`   ✓ ${name}`);
    }

    console.log('\n🎓 Seeding Alumni...');

    // Generate Manual Alumni
    for (const alumni of alumniUsers) {
      if (!userMap[alumni.name]) {
        try {
          const user = await User.create({
            name: alumni.name,
            email: alumni.email.toLowerCase(),
            role: alumni.role,
            passwordHash: hashPassword(alumni.password),
            authToken: newToken(),
            company: alumni.company,
            position: alumni.position,
            domain: alumni.domain,
            // ... other fields if needed, or rely on defaults/schema
            profileCompleted: true,
            isVerified: true
          });
          userMap[user.name] = user._id.toString();
          console.log(`   ✓ ${user.name} (Manual)`);
        } catch (e) { console.log(`Skipping ${alumni.name}`); }
      }
    }

    // Generate 50 realistic Alumni profiles
    const alumniNames = [
      'Vikram Malhotra', 'Sanya Gupta', 'Deepak Verma', 'Ananya Iyer', 'Rahul Nair',
      'Priya Desai', 'Arjun Kapoor', 'Meera Reddy', 'Siddharth Joshi', 'Ishita Sharma',
      'Kunal Shah', 'Neha Patel', 'Rohan Mehta', 'Divya Singh', 'Amitabh Roy',
      'Kavita Krishnan', 'Rajesh Kumar', 'Sneha Agarwal', 'Manish Tiwari', 'Pooja Hegde',
      'Varun Dhawan', 'Alia Bhatt', 'Ranbir Kapoor', 'Deepika Padukone', 'Ranveer Singh',
      'Vicky Kaushal', 'Katrina Kaif', 'Ayushmann Khurrana', 'Taapsee Pannu', 'Rajkummar Rao',
      'Nawazuddin Siddiqui', 'Pankaj Tripathi', 'Manoj Bajpayee', 'Radhika Apte', 'Tabu',
      'Irrfan Khan', 'Naseeruddin Shah', 'Om Puri', 'Amrish Puri', 'Anupam Kher',
      'Paresh Rawal', 'Boman Irani', 'Saurabh Shukla', 'Vijay Raaz', 'Sanjay Mishra',
      'Johnny Lever', 'Mehmood', 'Kishore Kumar', 'Mukesh', 'Mohammed Rafi'
    ];

    const techCompanies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Apple', 'Uber', 'Airbnb', 'Stripe', 'Coinbase', 'Flipkart', 'Swiggy', 'Zomato', 'Paytm', 'Ola', 'Razorpay', 'Cred', 'Zerodha', 'Groww', 'Nykaa'];
    const techRoles = ['Senior Software Engineer', 'Product Manager', 'Data Scientist', 'Engineering Manager', 'CTO', 'Founding Engineer', 'Staff Engineer', 'Principal Architect', 'DevOps Lead', 'Machine Learning Engineer'];
    const techDomains = ['Cloud Computing', 'Artificial Intelligence', 'Cybersecurity', 'Fintech', 'E-commerce', 'EdTech', 'HealthTech', 'Blockchain', 'IoT', 'SaaS'];

    for (let i = 0; i < 50; i++) {
      const name = alumniNames[i] || `Alumni User ${i + 1}`;
      const company = techCompanies[i % techCompanies.length];
      const role = techRoles[i % techRoles.length];
      const domain = techDomains[i % techDomains.length];

      try {
        const user = await User.create({
          name: name,
          email: `alumni${i + 100}@ldce.ac.in`,
          role: 'alumni',
          passwordHash: hashPassword('password123'),
          authToken: newToken(),
          isVerified: true,
          profileCompleted: true,
          profileVisible: true,
          // company: company,
          // position: role,
          // domain: domain,
          // yearsOfExperience: Math.floor(Math.random() * 15) + 3, 
          // availability: ['Open', 'Limited', 'Busy'][Math.floor(Math.random() * 3)],
          // department: ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Electrical'][Math.floor(Math.random() * 5)],
          // graduationYear: 2010 + Math.floor(Math.random() * 12),
          // skills: ['React', 'Node.js', 'Python', 'AWS', 'System Design', 'Leadership', 'Mentoring', 'Java', 'Kubernetes', 'Go'].sort(() => 0.5 - Math.random()).slice(0, 5),
          // interests: ['Mentoring', 'Startups', 'Open Source', 'Career Guidance', 'Tech Talks'],
          // bio: `${role} at ${company} with over ${3 + Math.floor(Math.random() * 10)} years of experience in ${domain}. Passionate about building scalable systems and mentoring junior developers. Previously worked at multiple high-growth startups.`,
          // points: Math.floor(Math.random() * 500),
          // badges: Math.random() > 0.5 ? ['Top Mentor', 'Domain Expert'] : ['Helpful'],
          // profileImage: '', 
          // linkedinUrl: `https://linkedin.com/in/${name.toLowerCase().replace(' ', '-')}`,
        });
        userMap[user.name] = user._id.toString();
      } catch (err: any) {
        console.error(`Failed to create ${name}: ${err.message}`);
      }
      // console.log(`   ✓ ${user.name} (${user.company})`); // reduce noise
    }
    console.log(`   ✓ Seeded 50+ diverse alumni profiles`);

    // ==================== SEED BLOGS (Alumni) ====================
    console.log('\n📝 Seeding Blogs by Alumni...');
    const blogs = [
      {
        authorId: userMap['Vikram Malhotra'],
        type: 'post',
        content: 'Building Scalable Systems with Node.js & MongoDB\n\nIn this comprehensive guide, I share my experience building distributed systems at Google. Learn about scaling strategies, database optimization, caching mechanisms, and best practices for production systems. We discuss how to handle millions of concurrent users.',
        image: 'https://via.placeholder.com/400x250?text=Scalable+Systems',
        tags: ['Backend', 'Node.js', 'Scalability', 'MongoDB'],
        likes: [],
        comments: [],
      },
      {
        authorId: userMap['Sanya Gupta'],
        type: 'post',
        content: 'ML Models in Production: Real-world Challenges\n\nDeploying ML models is different from training them. In this post, I discuss the challenges we face at Amazon with real-time inference, monitoring, continuous retraining, and handling model drift. Learn from production-level ML experiences.',
        image: 'https://via.placeholder.com/400x250?text=ML+Production',
        tags: ['ML', 'Production', 'DataScience', 'AWS'],
        likes: [],
        comments: [],
      },
      {
        authorId: userMap['Deepak Verma'],
        type: 'post',
        content: 'From Idea to IPO: Our Startup Journey\n\nStarting a company is exciting but challenging. Here are the lessons I learned building our SaaS product from scratch, raising funds from VCs, scaling the team from 2 to 50, navigating the market, and preparing for IPO.',
        image: 'https://via.placeholder.com/400x250?text=Startup+Journey',
        tags: ['Startup', 'Entrepreneurship', 'Fundraising', 'Growth'],
        likes: [],
        comments: [],
      },
      {
        authorId: userMap['Ananya Iyer'],
        type: 'post',
        content: 'Product Strategy: Data-Driven Decision Making\n\nAt Microsoft, we make every product decision based on data. Learn how to conduct user research, analyze metrics, run A/B tests, and make informed product choices. Discover frameworks for prioritizing features and measuring impact.',
        image: 'https://via.placeholder.com/400x250?text=Product+Strategy',
        tags: ['ProductManagement', 'Strategy', 'Analytics', 'UX'],
        likes: [],
        comments: [],
      },
    ];

    for (const blog of blogs) {
      await Blog.create(blog);
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
      await Question.create(question);
      console.log(`   ✓ "${question.title.substring(0, 50)}..."`);
    }

    // ==================== SEED ANSWERS (Alumni) ====================
    console.log('\n💬 Seeding Answers by Alumni...');
    // Get first 2 questions to add answers
    const createdQuestions = await Question.find().limit(2);

    if (createdQuestions && createdQuestions.length > 0) {
      const answers = [
        {
          questionId: createdQuestions[0]._id,
          authorId: userMap['Vikram Malhotra'],
          content: 'Use React.memo() to memoize components, useMemo() and useCallback() hooks to memoize values and functions, and code splitting for lazy loading. These techniques significantly improve rendering performance in large apps.',
          upvotes: [],
        },
        {
          questionId: createdQuestions[1]._id,
          authorId: userMap['Sanya Gupta'],
          content: 'It depends on your use case. REST is simpler and great for straightforward CRUD APIs. GraphQL excels with complex queries, multiple data sources, and when you need precise data requirements. GraphQL has more setup overhead.',
          upvotes: [],
        },
      ];

      for (const answer of answers) {
        await Answer.create(answer);
        console.log(`   ✓ Answer added by ${Object.keys(userMap).find(k => userMap[k] === answer.authorId)}`);
      }
    }

    // ==================== SEED EVENTS ====================
    console.log('\n📅 Seeding Events...');
    const events = [
      {
        organizerId: userMap['Vikram Malhotra'],
        title: 'Web Development Masterclass Workshop',
        description: 'Learn modern web development with React, Node.js, and MongoDB from industry experts at Google',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: 'LDCE Campus, Auditorium A',
        type: 'workshop',
        attendees: [],
        maxAttendees: 150,
      },
      {
        organizerId: userMap['Sanya Gupta'],
        title: 'AI & Machine Learning Bootcamp',
        description: 'Deep dive into ML, Deep Learning, NLP and Computer Vision with hands-on projects using Python',
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        location: 'LDCE Campus, Lab Block',
        type: 'seminar',
        attendees: [],
        maxAttendees: 100,
      },
      {
        organizerId: userMap['Deepak Verma'],
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
      await Event.create(event);
      console.log(`   ✓ ${event.title}`);
    }

    // ==================== SEED REVERSE PITCHES (Challenges) ====================
    console.log('\n🎯 Seeding Reverse Pitches (Challenges)...');
    const industries = ['Fintech', 'HealthTech', 'EdTech', 'AgriTech', 'CleanTech', 'E-commerce', 'SaaS', 'AI/ML'];
    const reversePitches = [
      {
        authorId: userMap['Vikram Malhotra'],
        title: 'Optimize Last-Mile Delivery Routes',
        description: 'We are looking for an algorithm or prototype to optimize delivery routes for our logistics fleet in tier-2 cities, considering traffic and road conditions.',
        industry: 'Logistics',
        budget: '₹50,000 Prize',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        submissions: [],
      },
      {
        authorId: userMap['Deepak Verma'],
        title: 'AI-Driven Customer Support Bot for Regional Languages',
        description: 'Build a chatbot that can handle customer queries in Hindi, Gujarati, and Marathi with >90% accuracy using NLP.',
        industry: 'AI/ML',
        budget: '₹1 Lakh + Internship',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        submissions: [],
      },
      // Generate 10 more random pitches
      ...Array.from({ length: 12 }).map((_, i) => ({
        authorId: Object.values(userMap)[Math.floor(Math.random() * Object.values(userMap).length)],
        title: `Innovation Challenge #${i + 1}: ${industries[i % industries.length]} Solution`,
        description: `We are seeking innovative solutions to revolutionize the ${industries[i % industries.length]} sector. Propose a scalable architecture.`,
        industry: industries[i % industries.length],
        budget: `₹${(i + 1) * 10},000 Grant`,
        deadline: new Date(Date.now() + (30 + i * 5) * 24 * 60 * 60 * 1000),
        submissions: [],
      }))
    ];

    for (const pitch of reversePitches) {
      await ReversePitch.create(pitch);
      console.log(`   ✓ ${pitch.title}`);
    }

    // ==================== SEED INTERNSHIPS (Opportunities) ====================
    console.log('\n💼 Seeding Internship Opportunities...');
    const jobRoles = ['Frontend Dev', 'Backend Dev', 'Data Analyst', 'UI Designer', 'Product Intern', 'Marketing Associate'];
    const jobTypes = ['Internship', 'Job', 'Freelance', 'Part-time', 'Remote-Friendly'];
    const companies = ['Google', 'Microsoft', 'Amazon', 'Zomato', 'Swiggy', 'Cred', 'Razorpay', 'Freshworks'];

    // Core manual internships
    const manualInternships = [
      {
        postedById: userMap['Vikram Malhotra'],
        title: 'Full Stack Developer Internship',
        company: 'Google India',
        stipend: '₹50,000/month',
        type: 'Remote-Friendly',
        location: 'Bangalore',
        skills: ['Node.js', 'React', 'MongoDB', 'JavaScript'],
        description: 'Work on real products used by millions of users worldwide at Google. Build scalable systems and learn industry best practices.',
        applicants: [],
      },
      // ... keep existing manual ones if desired, but adding generator below
    ];

    // Generate 25 Opportunities
    const generatedInternships = Array.from({ length: 25 }).map((_, i) => {
      const role = jobRoles[Math.floor(Math.random() * jobRoles.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      return {
        postedById: Object.values(userMap)[Math.floor(Math.random() * Object.values(userMap).length)],
        title: `${role} ${i % 2 === 0 ? 'Role' : 'Opening'}`,
        company: company,
        stipend: i % 3 === 0 ? '₹15-25k/month' : 'Competitive',
        type: jobTypes[Math.floor(Math.random() * jobTypes.length)],
        location: ['Bangalore', 'Remote', 'Mumbai', 'Delhi', 'Ahmedabad'][Math.floor(Math.random() * 5)],
        skills: ['React', 'Node.js', 'Python'].sort(() => 0.5 - Math.random()).slice(0, 2),
        description: `Join ${company} as a ${role}. We are looking for passionate individuals to join our fast-paced team.`,
        applicants: [],
      };
    });

    const allInternships = [...manualInternships, ...generatedInternships];

    for (const internship of allInternships) {
      await Internship.create(internship);
      // console.log(`   ✓ ${internship.title}`); // reduce noise
    }
    console.log(`   ✓ Seeded ${allInternships.length} opportunities`);

    // ==================== SEED STARTUPS ====================
    console.log('\n🚀 Seeding Startup Ideas...');
    const generatedStartups = Array.from({ length: 15 }).map((_, i) => ({
      ownerId: Object.values(userMap)[Math.floor(Math.random() * Object.values(userMap).length)],
      title: `Startup Project Alpha-${i}`,
      tagline: `Disrupting the ${industries[i % industries.length]} industry`,
      stage: ['concept', 'prototype', 'mvp'][Math.floor(Math.random() * 3)],
      problem: 'Solving a critical pain point in the market.',
      solution: 'An innovative AI-driven solution.',
      progress: 'Early traction achieved.',
      fundingNeeded: `₹${(i + 5) * 5} Lakhs`,
      attachments: [],
      likes: [],
      comments: [],
    }));

    for (const startup of generatedStartups) {
      await Startup.create(startup);
    }
    console.log(`   ✓ Seeded ${generatedStartups.length} startups`);

    // ... (Keep Connections, Search History etc.)

    // ==================== SEED CONNECTIONS (Social Graph) ====================
    console.log('\n🔗 Seeding Connections (Followers/Following)...');
    const allUserIds = Object.values(userMap);

    // Create random connections
    for (const userId of allUserIds) {
      // Connect to 2-4 random other users
      const numConnections = Math.floor(Math.random() * 3) + 2;
      const others = allUserIds.filter(id => id !== userId);
      const randomTargets = others.sort(() => 0.5 - Math.random()).slice(0, numConnections);

      for (const targetId of randomTargets) {
        await Connection.create({
          followerId: userId,
          followingId: targetId
        });
      }
    }
    console.log(`   ✓ Created random social graph`);

    // ==================== SEED SEARCH HISTORY ====================
    console.log('\n🔍 Seeding Search History...');
    const searchTerms = ['React', 'Data Science', 'Google', 'Startup', 'Internship', 'Machine Learning'];
    for (const userId of allUserIds) {
      // 3 random searches per user
      for (let i = 0; i < 3; i++) {
        await SearchHistory.create({
          userId,
          query: searchTerms[Math.floor(Math.random() * searchTerms.length)],
          searchedType: 'keyword'
        });
      }
    }
    console.log(`   ✓ Created search history`);

    // ==================== SEED NOTIFICATIONS ====================
    console.log('\n🔔 Seeding Notifications...');
    // Add notifications for Students
    const studentIds = Object.keys(userMap)
      .filter(name => studentUsers.some(s => s.name === name))
      .map(name => userMap[name]);

    for (const studentId of studentIds) {
      // 1. Internship Alert
      await Notification.create({
        userId: studentId,
        type: 'internship',
        referenceId: new mongoose.Types.ObjectId(), // dummy ref
        message: 'New Internship matching your skills: Full Stack Developer at Google',
        isRead: false
      });

      // 2. Post Alert
      await Notification.create({
        userId: studentId,
        type: 'post',
        referenceId: new mongoose.Types.ObjectId(), // dummy ref
        message: 'New post by Rahul Desai: Building Scalable Systems',
        isRead: false
      });

      // 3. Connection
      await Notification.create({
        userId: studentId,
        type: 'connection',
        referenceId: new mongoose.Types.ObjectId(), // dummy ref
        message: 'Vikram Sharma started following you',
        isRead: true // one read
      });
    }
    console.log(`   ✓ Created notifications for students`);
    console.log('\n✅ DATABASE SEEDING COMPLETED!\n');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${studentUsers.length} Students + ${alumniUsers.length} Alumni = ${studentUsers.length + alumniUsers.length} total`);
    console.log(`   📝 Blogs: ${blogs.length} (by Alumni)`);
    console.log(`   ❓ Questions: ${questions.length} (by Students)`);
    console.log(`   💬 Answers: ${2} (by Alumni)`);
    console.log(`   📅 Events: ${events.length}`);
    console.log(`   🎯 Reverse Pitches: ${reversePitches.length}`);
    console.log(`   💼 Internships: ${allInternships.length}`);
    console.log(`   🚀 Startups: ${generatedStartups.length}`);
    console.log('\n🎨 All realistic interconnected data is now in MongoDB!');
    console.log('👁️  Check MongoDB Compass to see all collections populated\n');


    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

// Execute seeding
void seedDatabase();
