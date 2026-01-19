import { Router } from 'express';
import mongoose from 'mongoose';
import Blog from '../models/Blog';
import { requireAuth, requireProfileCompleted, requireRole, type AuthRequest } from '../middleware/authMiddleware';
import { ActivityService } from '../services/activityService';

const router = Router();

const ensureDb = (res: any) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Database not connected' });
    return false;
  }
  return true;
};

// Public (read-only)
router.get('/', async (_req, res) => {
  if (!ensureDb(res)) return;
  const blogs = await Blog.find().sort({ createdAt: -1 }).populate('authorId');
  res.json(blogs);
});

// Alumni/admin can create blogs
router.post('/', requireAuth, requireProfileCompleted, requireRole(['alumni', 'admin']), async (req: AuthRequest, res) => {
  if (!ensureDb(res)) return;
  const { title, content, image, category, tags } = req.body as {
    title?: string;
    content?: string;
    image?: string;
    category?: string;
    tags?: string[];
  };
  if (!content) return res.status(400).json({ message: 'content is required' });

  const blog = await Blog.create({
    authorId: req.user!.id,
    content,
    ...(typeof image === 'string' && image.trim() ? { image: image.trim() } : {}),
    ...(typeof category === 'string' && category.trim() ? { category: category.trim() } : {}),
    ...(Array.isArray(tags) ? { tags: tags.filter((t) => typeof t === 'string' && t.trim()).map((t) => t.trim()) } : {}),
    ...(title ? { title } : {}),
    type: 'post',
  });

  // Log activity - blogs by alumni are public
  await ActivityService.logActivity({
    userId: req.user!.id as any,
    type: 'blog_created',
    title: `Published blog: "${title || 'Untitled'}"`,
    description: content.substring(0, 100),
    relatedId: blog._id,
    relatedType: 'Blog',
    visibility: 'public'
  });

  // TRIGGER NOTIFICATION
  // We don't await this so it runs in background (or we can await if critical)
  // For better reliability we could await or use a queue. Here we await to ensure it runs but don't block response too much logic inside.
  // Actually, let's catch errors so it doesn't fail request.
  import('../services/notificationService').then(service => {
    service.createPostNotification(blog).catch(err => console.error('Notification trigger failed', err));
  });

  const populated = await Blog.findById(blog._id).populate('authorId');
  return res.status(201).json(populated || blog);
});

export default router;
