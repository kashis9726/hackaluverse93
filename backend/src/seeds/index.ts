/**
 * Database seeding script
 * Usage: npm run seed
 */
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';
import Blog from '../models/Blog';
import Question from '../models/Question';
import Answer from '../models/Answer';
import Event from '../models/Event';
import Challenge from '../models/Challenge';
import Internship from '../models/Internship';
import Startup from '../models/Startup';
import { hashPassword } from '../utils/password';
import { generateToken } from '../utils/token';
import { STUDENT_SEED_DATA, ALUMNI_SEED_DATA } from './seedData';
import { 
  BLOGS_SEED_DATA, 
  QUESTIONS_SEED_DATA, 
  ANSWERS_SEED_DATA,
  EVENTS_SEED_DATA,
  CHALLENGES_SEED_DATA,
  INTERNSHIP_SEED_DATA,
  STARTUP_SEED_DATA
} from './comprehensiveSeedData';
import { log, logError } from '../utils';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function seedDatabase(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not set in .env file');
    }

    await mongoose.connect(mongoUri);
    log('[SEED]', '✓ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    log('[SEED]', '✓ Cleared existing users');

    // Create user map for reference
    const userMap: { [key: string]: string } = {};

    // Seed students
    for (const student of STUDENT_SEED_DATA) {
      const user = await User.create({
        name: student.name,
        email: student.email.toLowerCase(),
        role: student.role,
        passwordHash: hashPassword(student.password),
        authToken: generateToken(),
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
      log('[SEED]', `✓ Created student: ${student.name}`);
    }

    // Seed alumni
    for (const alumni of ALUMNI_SEED_DATA) {
      const user = await User.create({
        name: alumni.name,
        email: alumni.email.toLowerCase(),
        role: alumni.role,
        passwordHash: hashPassword(alumni.password),
        authToken: generateToken(),
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
      log('[SEED]', `✓ Created alumni: ${alumni.name}`);
    }

    // Seed blogs
    log('[SEED]', '\n📝 Seeding Blogs...');
    for (const blog of BLOGS_SEED_DATA) {
      await Blog.create({
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
      log('[SEED]', `✓ Created blog: ${blog.title}`);
    }

    // Seed questions and answers
    log('[SEED]', '\n❓ Seeding Questions & Answers...');
    for (let i = 0; i < QUESTIONS_SEED_DATA.length; i++) {
      const q = QUESTIONS_SEED_DATA[i];
      if (!q) continue;

      const question = await Question.create({
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
      for (const answer of ANSWERS_SEED_DATA.filter(a => a.question_id === i)) {
        await Answer.create({
          question: question._id,
          content: answer.content,
          author: userMap['Rahul Desai'] || userMap['Vikram Sharma'],
          upvotes: answer.upvotes,
          isAccepted: answer.is_accepted,
          createdAt: answer.created_at,
        });
      }

      log('[SEED]', `✓ Created question: ${q.title}`);
    }

    // Seed events
    log('[SEED]', '\n📅 Seeding Events...');
    for (const event of EVENTS_SEED_DATA) {
      await Event.create({
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
      log('[SEED]', `✓ Created event: ${event.title}`);
    }

    // Seed challenges
    log('[SEED]', '\n🎯 Seeding Challenges...');
    for (const challenge of CHALLENGES_SEED_DATA) {
      await Challenge.create({
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
      log('[SEED]', `✓ Created challenge: ${challenge.title}`);
    }

    // Seed internships
    log('[SEED]', '\n💼 Seeding Internships...');
    for (const internship of INTERNSHIP_SEED_DATA) {
      await Internship.create({
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
      log('[SEED]', `✓ Created internship: ${internship.title}`);
    }

    // Seed startups
    log('[SEED]', '\n🚀 Seeding Startups...');
    for (const startup of STARTUP_SEED_DATA) {
      await Startup.create({
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
      log('[SEED]', `✓ Created startup: ${startup.name}`);
    }

    log('[SEED]', '\n✓ Database seeding completed successfully!');
    log('[SEED]', `\n📊 Summary:`);
    log('[SEED]', `   - Students: ${STUDENT_SEED_DATA.length}`);
    log('[SEED]', `   - Alumni: ${ALUMNI_SEED_DATA.length}`);
    log('[SEED]', `   - Total Users: ${STUDENT_SEED_DATA.length + ALUMNI_SEED_DATA.length}`);
    log('[SEED]', `   - Blogs: ${BLOGS_SEED_DATA.length}`);
    log('[SEED]', `   - Questions: ${QUESTIONS_SEED_DATA.length}`);
    log('[SEED]', `   - Answers: ${ANSWERS_SEED_DATA.length}`);
    log('[SEED]', `   - Events: ${EVENTS_SEED_DATA.length}`);
    log('[SEED]', `   - Challenges: ${CHALLENGES_SEED_DATA.length}`);
    log('[SEED]', `   - Internships: ${INTERNSHIP_SEED_DATA.length}`);
    log('[SEED]', `   - Startups: ${STARTUP_SEED_DATA.length}`);
    log('[SEED]', '\n💡 All data is now in MongoDB Compass!');
    log('[SEED]', '🎨 Frontend will display this data professionally!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    logError('[SEED]', error);
    process.exit(1);
  }
}

void seedDatabase();
