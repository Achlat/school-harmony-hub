import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// ─── Schémas ──────────────────────────────────────────────────────────────────
const createNotificationSchema = z.object({
  title: z.string().min(1, 'Le titre est obligatoire'),
  message: z.string().min(1, 'Le message est obligatoire'),
  type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
});

// ─── GET /api/notifications ───────────────────────────────────────────────────
// Filtres : ?read=false&type=warning
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.user!.schoolId;
    const { read, type } = req.query;

    const notifications = await prisma.notification.findMany({
      where: {
        schoolId,
        ...(read !== undefined ? { read: read === 'true' } : {}),
        ...(type ? { type: String(type) } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/notifications ──────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createNotificationSchema.parse(req.body);
    const schoolId = req.user!.schoolId;

    const notification = await prisma.notification.create({
      data: { ...data, schoolId },
    });

    res.status(201).json(notification);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
});

// ─── PUT /api/notifications/read-all ─────────────────────────────────────────
// Marquer toutes les notifications comme lues
router.put('/read-all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.user!.schoolId;

    await prisma.notification.updateMany({
      where: { schoolId, read: false },
      data: { read: true },
    });

    res.json({ message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/notifications/:id/read ─────────────────────────────────────────
router.put('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.user!.schoolId;

    const existing = await prisma.notification.findFirst({
      where: { id: req.params.id, schoolId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Notification non trouvée' });
      return;
    }

    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });

    res.json(notification);
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/notifications/:id ───────────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.user!.schoolId;

    const existing = await prisma.notification.findFirst({
      where: { id: req.params.id, schoolId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Notification non trouvée' });
      return;
    }

    await prisma.notification.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
