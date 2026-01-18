/**
 * Comprehensive seed data for blogs, questions, and answers
 * This creates realistic content related to users
 */

export const BLOGS_SEED_DATA = [
  {
    title: 'Building Scalable Systems with Node.js and MongoDB',
    slug: 'building-scalable-systems-nodejs-mongodb',
    content: `In this comprehensive guide, I'll walk you through building a scalable backend system using Node.js and MongoDB.

## Introduction
As applications grow, the architecture needs to scale with them. I've learned this lesson the hard way while building systems at Google.

## Key Principles
1. **Horizontal Scaling** - Design your system to run on multiple servers
2. **Database Optimization** - Use proper indexing and query optimization
3. **Caching Strategy** - Implement Redis for frequently accessed data
4. **Load Balancing** - Distribute traffic across multiple instances

## Best Practices
- Use connection pooling for database connections
- Implement proper error handling and logging
- Monitor your system metrics in real-time
- Use Docker for consistent deployments

## Conclusion
With these principles in mind, you can build systems that scale to millions of users.`,
    excerpt: 'Learn how to build scalable backend systems using Node.js and MongoDB. A comprehensive guide based on real-world experience.',
    author_id: 'rahul_desai', // Alumni
    tags: ['Node.js', 'MongoDB', 'Backend', 'Scalability', 'System Design'],
    category: 'Backend Development',
    views: 1250,
    likes: 89,
    published_at: new Date('2024-12-15'),
  },
  {
    title: 'Machine Learning Models in Production: A Practical Guide',
    slug: 'ml-models-production-guide',
    content: `Deploying machine learning models to production requires more than just a trained model. Here's what I learned at Amazon.

## The Challenge
Many ML engineers struggle with the gap between notebook experiments and production systems.

## Key Considerations
1. **Model Versioning** - Keep track of all model versions and their performance
2. **Monitoring** - Set up alerts for model drift and data drift
3. **Scalability** - Ensure your serving infrastructure can handle traffic
4. **Reproducibility** - Document all dependencies and configurations

## Tools & Technologies
- MLflow for experiment tracking
- Docker for containerization
- Kubernetes for orchestration
- Prometheus for monitoring

## Real-world Example
At Amazon, we deployed recommendation models serving millions of requests daily. The key was having robust monitoring and quick rollback mechanisms.

## Takeaways
- Always test your models in staging before production
- Monitor model performance continuously
- Have a quick rollback strategy
- Document everything thoroughly`,
    excerpt: 'Practical guide to deploying ML models in production. Learn from real-world experience at Amazon.',
    author_id: 'divya_patel', // Alumni
    tags: ['Machine Learning', 'Production', 'MLOps', 'Python', 'Data Science'],
    category: 'Data Science',
    views: 2100,
    likes: 156,
    published_at: new Date('2024-12-10'),
  },
  {
    title: 'Startup Journey: From Idea to Funding',
    slug: 'startup-journey-idea-to-funding',
    content: `Building a startup is one of the most challenging yet rewarding experiences. Here's my journey as CTO of Startup XYZ.

## Phase 1: The Idea
It all started with identifying a problem we faced ourselves. We spent 3 months researching and validating the market.

## Phase 2: Building the MVP
- Assembled a small team of 3 developers
- Built MVP in 2 months using React and Node.js
- Focused on core features only
- Got feedback from early users

## Phase 3: Growth
- Added 5 more team members
- Implemented analytics and monitoring
- Improved performance and reliability
- Built partnerships with key customers

## Phase 4: Fundraising
- Prepared pitch deck and financial projections
- Pitched to 50+ VCs
- Closed seed round of $1.5M
- Now scaling to next level

## Key Learnings
1. Move fast and break things (in dev, not production!)
2. Talk to your customers constantly
3. Build a strong founding team
4. Don't hire too fast
5. Focus on unit economics early

## Advice for Aspiring Founders
- Don't wait for the perfect idea, good ideas are everywhere
- Surround yourself with people smarter than you
- Be prepared to work 24/7 initially
- Learn to say no to distractions
- Celebrate small wins along the way`,
    excerpt: 'My startup journey as CTO: from validating the idea to closing seed funding. Lessons learned along the way.',
    author_id: 'vikram_sharma', // Alumni
    tags: ['Startup', 'Entrepreneurship', 'Funding', 'Leadership', 'Business'],
    category: 'Entrepreneurship',
    views: 3500,
    likes: 245,
    published_at: new Date('2024-11-28'),
  },
  {
    title: 'Product Management 101: Building Products Users Love',
    slug: 'product-management-101',
    content: `Product Management is about creating value for users and the business. Here's what I've learned at Microsoft.

## The PM Role
A Product Manager is the "CEO of the product". You need to balance user needs, business goals, and technical constraints.

## Key Responsibilities
1. **Understanding Users** - Conduct user research and interviews
2. **Defining Strategy** - Create a clear product vision and roadmap
3. **Prioritization** - Say no to most things, yes to few
4. **Cross-functional Leadership** - Work with engineering, design, marketing

## Framework for Good PMs
- Start with why (Simon Sinek)
- Use data to validate hypotheses
- Get feedback early and often
- Iterate based on learnings

## Common Mistakes
- Not talking to enough users
- Falling in love with features, not benefits
- Not having a clear metric for success
- Changing priorities too frequently

## Success Story
We launched a new feature that increased user engagement by 40% by focusing on one core insight from user interviews rather than adding more features.`,
    excerpt: 'Learn the fundamentals of product management and how to build products that users actually love.',
    author_id: 'anjali_gupta', // Alumni
    tags: ['Product Management', 'UX', 'Strategy', 'Leadership', 'Business'],
    category: 'Product',
    views: 1800,
    likes: 132,
    published_at: new Date('2024-11-15'),
  },
];

export const QUESTIONS_SEED_DATA = [
  {
    title: 'How to optimize React performance for large lists?',
    description: 'I have a React component that renders a list of 10,000 items. The performance is very slow. What are the best practices to optimize this?',
    content: `I'm working on a dashboard that displays a large list of items (10,000+). Currently, it takes 5-10 seconds to render. I've tried:
- React.memo
- useCallback for handlers
- Virtual scrolling with react-window

But it's still slow. What else can I do?

Here's my current component structure:
\`\`\`jsx
function LargeList({ items }) {
  return (
    <div>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  )
}
\`\`\`

What best practices am I missing?`,
    author_id: 'kashish_kumar', // Student
    tags: ['React', 'Performance', 'JavaScript', 'Frontend'],
    category: 'Web Development',
    views: 456,
    answers_count: 3,
    upvotes: 25,
    created_at: new Date('2024-12-18'),
  },
  {
    title: 'What are the differences between REST and GraphQL?',
    description: 'Can someone explain the key differences between REST API and GraphQL? When should I use each?',
    content: `I'm planning to build a new API for my project. I've worked with REST APIs before but I've heard GraphQL is better. 

Can someone explain:
1. What are the main differences?
2. When should I use REST vs GraphQL?
3. What are the pros and cons of each?
4. Do they have different learning curves?

Any guidance would be appreciated!`,
    author_id: 'priya_sharma', // Student
    tags: ['GraphQL', 'REST', 'API', 'Backend', 'Architecture'],
    category: 'Backend Development',
    views: 1250,
    answers_count: 5,
    upvotes: 67,
    created_at: new Date('2024-12-16'),
  },
  {
    title: 'Best practices for error handling in Node.js',
    description: 'What are the best practices for error handling in Node.js applications? How to handle errors properly?',
    content: `I'm building a production Node.js application and want to ensure proper error handling.

Questions:
- Should I use try-catch or Promise.catch()?
- How to handle unhandled promise rejections?
- What's the best way to log errors?
- How to pass errors through multiple middleware?

Currently, I'm using Express and MongoDB. Here's my current error handling:

\`\`\`js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});
\`\`\`

Is this sufficient? What am I missing?`,
    author_id: 'arjun_patel', // Student
    tags: ['Node.js', 'Error Handling', 'Backend', 'Best Practices', 'Express'],
    category: 'Backend Development',
    views: 892,
    answers_count: 4,
    upvotes: 48,
    created_at: new Date('2024-12-14'),
  },
  {
    title: 'How to learn machine learning effectively?',
    description: 'I want to learn machine learning but I don\'t know where to start. What resources and roadmap should I follow?',
    content: `I have basic Python knowledge and want to learn machine learning. I'm confused about:

1. What should be my learning path?
2. What prerequisites do I need?
3. What projects should I build?
4. What resources do you recommend?

I've tried Kaggle but I'm getting overwhelmed. Also, should I focus on deep learning or traditional ML first?

Any guidance from experienced ML professionals would be helpful!`,
    author_id: 'neha_verma', // Student
    tags: ['Machine Learning', 'Learning', 'Python', 'Data Science', 'Career'],
    category: 'Data Science',
    views: 1567,
    answers_count: 8,
    upvotes: 123,
    created_at: new Date('2024-12-12'),
  },
  {
    title: 'Is it worth building a startup right after graduation?',
    description: 'Should I join a startup or get a job at a big company after graduation? Pros and cons?',
    content: `I'm graduating soon and have two offers:
1. A position at a startup (equity + lower salary)
2. A position at a big tech company (higher salary + stability)

I'm interested in entrepreneurship but I'm also worried about:
- Financial stability
- Learning opportunities
- Growth trajectory
- Work-life balance

What would you recommend? Anyone here who made this choice?

Also, if I should work at a big company first, how long should I wait before starting a startup?`,
    author_id: 'rohan_singh', // Student
    tags: ['Startup', 'Career', 'Entrepreneurship', 'Choice', 'Advice'],
    category: 'Career',
    views: 2341,
    answers_count: 12,
    upvotes: 189,
    created_at: new Date('2024-12-10'),
  },
];

export const ANSWERS_SEED_DATA = [
  {
    question_id: 0, // First question
    content: `Great question! Here are the key optimization techniques:

1. **Virtual Scrolling** - Only render visible items
\`\`\`jsx
import { FixedSizeList } from 'react-window';

function Row({ index, style }) {
  return <div style={style}>{items[index].name}</div>;
}

<FixedSizeList height={600} itemCount={10000} itemSize={35} width="100%">
  {Row}
</FixedSizeList>
\`\`\`

2. **Memoization**
\`\`\`jsx
const ListItem = React.memo(({ item }) => {
  return <div>{item.name}</div>;
}, (prev, next) => prev.item.id === next.item.id);
\`\`\`

3. **Pagination** - Load items in chunks

4. **Lazy Loading** - Load items as user scrolls

The combination of virtual scrolling + memoization usually gives 100x performance improvement!`,
    author_id: 'rahul_desai', // Alumni answering
    upvotes: 15,
    is_accepted: true,
    created_at: new Date('2024-12-18'),
  },
  {
    question_id: 1, // Second question
    content: `Key differences between REST and GraphQL:

**REST:**
- Fixed endpoints that return fixed data structures
- Multiple requests for related data
- Simple to understand and implement
- Great caching with HTTP

**GraphQL:**
- Single endpoint, flexible data queries
- Get exactly what you need in one request
- Steeper learning curve
- Better for complex data relationships

**When to use REST:**
- Simple CRUD operations
- Public APIs with simple queries
- When you need simple caching

**When to use GraphQL:**
- Complex data relationships
- Multiple client types with different needs
- Real-time applications
- Internal APIs with complex queries

My recommendation: Start with REST for simple projects, move to GraphQL as complexity increases.`,
    author_id: 'vikram_sharma', // Alumni answering
    upvotes: 22,
    is_accepted: true,
    created_at: new Date('2024-12-16'),
  },
];

export const CHALLENGES_SEED_DATA = [
  {
    title: 'Build a Real-time Chat Application',
    description: 'Create a chat application with real-time messaging using WebSockets',
    difficulty: 'Intermediate',
    tags: ['WebSocket', 'React', 'Node.js', 'Real-time'],
    points: 500,
    participants: 45,
    created_by: 'rahul_desai',
    deadline: new Date('2025-01-31'),
  },
  {
    title: 'Implement a Task Management System',
    description: 'Build a full-stack task management app with drag-and-drop functionality',
    difficulty: 'Beginner',
    tags: ['React', 'MongoDB', 'Express', 'Drag-and-drop'],
    points: 300,
    participants: 78,
    created_by: 'anjali_gupta',
    deadline: new Date('2025-02-14'),
  },
  {
    title: 'Machine Learning Image Classification',
    description: 'Train and deploy an ML model to classify images',
    difficulty: 'Advanced',
    tags: ['Python', 'TensorFlow', 'Machine Learning', 'CNN'],
    points: 800,
    participants: 23,
    created_by: 'divya_patel',
    deadline: new Date('2025-03-01'),
  },
];

export const INTERNSHIP_SEED_DATA = [
  {
    title: 'Summer Internship - Full Stack Development',
    company: 'Google India',
    description: 'Work on backend services serving millions of users. You\'ll work on distributed systems, APIs, and databases.',
    duration: '2 months',
    stipend: '₹50,000/month',
    skills_required: ['Node.js', 'React', 'MongoDB', 'System Design'],
    posted_by: 'rahul_desai',
    applications: 125,
    posted_at: new Date('2024-12-01'),
  },
  {
    title: 'Winter Internship - Data Science',
    company: 'Amazon',
    description: 'Build recommendation systems and work on ML pipelines. Exposure to big data and analytics.',
    duration: '3 months',
    stipend: '₹60,000/month',
    skills_required: ['Python', 'Machine Learning', 'SQL', 'Big Data'],
    posted_by: 'divya_patel',
    applications: 89,
    posted_at: new Date('2024-11-15'),
  },
];

export const EVENTS_SEED_DATA = [
  {
    title: 'Web Development Workshop - React & Node.js',
    description: 'Learn modern web development with hands-on workshop. We\'ll build a complete full-stack application from scratch.',
    date: new Date('2025-01-25'),
    time: '10:00 AM - 5:00 PM',
    location: 'Online',
    speaker: 'Rahul Desai (Google)',
    capacity: 100,
    registrations: 67,
    tags: ['React', 'Node.js', 'Web Development', 'Workshop'],
    organized_by: 'rahul_desai',
  },
  {
    title: 'AI/ML Bootcamp - Getting Started with Machine Learning',
    description: 'Comprehensive bootcamp on machine learning fundamentals. Perfect for beginners.',
    date: new Date('2025-02-01'),
    time: '2:00 PM - 6:00 PM',
    location: 'Classroom A',
    speaker: 'Divya Patel (Amazon)',
    capacity: 80,
    registrations: 54,
    tags: ['Machine Learning', 'AI', 'Python', 'Bootcamp'],
    organized_by: 'divya_patel',
  },
  {
    title: 'Startup Masterclass - From Idea to IPO',
    description: 'Learn the complete journey of building a startup. Hear from a founder who went from idea to seed funding.',
    date: new Date('2025-02-08'),
    time: '6:00 PM - 8:00 PM',
    location: 'Auditorium',
    speaker: 'Vikram Sharma (Startup XYZ CTO)',
    capacity: 200,
    registrations: 142,
    tags: ['Startup', 'Entrepreneurship', 'Business', 'Masterclass'],
    organized_by: 'vikram_sharma',
  },
];

export const STARTUP_SEED_DATA = [
  {
    name: 'EduTech Platform',
    description: 'An AI-powered learning platform that personalizes education for each student.',
    founder: 'Kashish Kumar',
    founder_email: 'kashish@ldce.ac.in',
    stage: 'Idea',
    looking_for: 'Co-founders, Mentorship, Beta Users',
    tech_stack: ['React', 'Node.js', 'MongoDB', 'TensorFlow'],
    pitch: 'We\'re building the future of education with AI',
    website: 'https://edutech-startup.dev',
    posted_at: new Date('2024-12-15'),
  },
  {
    name: 'Data Analytics SaaS',
    description: 'Simple analytics tool for small businesses to understand their data without technical knowledge.',
    founder: 'Priya Sharma',
    founder_email: 'priya@ldce.ac.in',
    stage: 'MVP',
    looking_for: 'Investors, Sales Partners',
    tech_stack: ['React', 'Python', 'PostgreSQL', 'Tableau'],
    pitch: 'Making data analytics accessible to everyone',
    website: 'https://analytics-saas.io',
    posted_at: new Date('2024-12-10'),
  },
  {
    name: 'IoT Health Monitoring',
    description: 'Wearable IoT device for continuous health monitoring and early disease detection.',
    founder: 'Neha Verma',
    founder_email: 'neha@ldce.ac.in',
    stage: 'Prototype',
    looking_for: 'Hardware Engineers, Investors, Clinical Partners',
    tech_stack: ['C++', 'IoT', 'Machine Learning', 'Mobile App'],
    pitch: 'Democratizing healthcare with IoT technology',
    posted_at: new Date('2024-12-05'),
  },
];
