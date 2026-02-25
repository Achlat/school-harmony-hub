import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// ─── Schémas ──────────────────────────────────────────────────────────────────
const updateSchoolSchema = z.object({
  name: z.string().min(1, 'Le nom est obligatoire'),
  address: z.string().min(1, "L'adresse est obligatoire"),
  phone: z.string().min(1, 'Le téléphone est obligatoire'),
  email: z.string().email('Email invalide'),
  logo: z.string().optional(),
  academicYear: z.string().optional(),
});

// ─── GET /api/settings ────────────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const school = await prisma.school.findUnique({
      where: { id: req.user!.schoolId },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        logo: true,
        plan: true,
        maxUsers: true,
        academicYear: true,
        _count: { select: { users: true } },
      },
    });

    if (!school) {
      res.status(404).json({ error: 'École non trouvée' });
      return;
    }

    res.json({
      id: school.id,
      name: school.name,
      address: school.address,
      phone: school.phone,
      email: school.email,
      logo: school.logo ?? undefined,
      plan: school.plan,
      userCount: school._count.users,
      maxUsers: school.maxUsers,
      academicYear: school.academicYear,
    });
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/settings ────────────────────────────────────────────────────────
router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateSchoolSchema.parse(req.body);
    const schoolId = req.user!.schoolId;

    const school = await prisma.school.update({
      where: { id: schoolId },
      data: {
        ...data,
        logo: data.logo ?? null,
      },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        logo: true,
        plan: true,
        maxUsers: true,
        academicYear: true,
        _count: { select: { users: true } },
      },
    });

    res.json({
      id: school.id,
      name: school.name,
      address: school.address,
      phone: school.phone,
      email: school.email,
      logo: school.logo ?? undefined,
      plan: school.plan,
      userCount: school._count.users,
      maxUsers: school.maxUsers,
      academicYear: school.academicYear,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
});

export default router;
