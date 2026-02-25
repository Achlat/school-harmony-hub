import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// ─── Schémas ──────────────────────────────────────────────────────────────────
const staffSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est obligatoire'),
  lastName: z.string().min(1, 'Le nom est obligatoire'),
  role: z.enum(['teacher', 'admin', 'support'], {
    message: 'Le rôle doit être teacher, admin ou support',
  }),
  email: z.string().email('Email invalide'),
  phone: z.string().min(1, 'Le téléphone est obligatoire'),
  address: z.string().min(1, "L'adresse est obligatoire"),
  hireDate: z.string().min(1, "La date d'embauche est obligatoire"),
  status: z.enum(['active', 'inactive']).default('active'),
  subjects: z.array(z.string()).default([]),
  assignedClasses: z.array(z.string()).default([]),
  photo: z.string().optional(),
});

// Helper : désérialise les champs JSON stockés en string
function formatStaff(member: {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  hireDate: string;
  status: string;
  subjects: string;
  assignedClasses: string;
  photo: string | null;
}) {
  return {
    ...member,
    photo: member.photo ?? undefined,
    subjects: JSON.parse(member.subjects) as string[],
    assignedClasses: JSON.parse(member.assignedClasses) as string[],
  };
}

// ─── GET /api/staff ───────────────────────────────────────────────────────────
// Filtres : ?role=teacher&status=active&search=xxx
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.user!.schoolId;
    const { role, status, search } = req.query;

    const staff = await prisma.staff.findMany({
      where: {
        schoolId,
        ...(role ? { role: String(role) } : {}),
        ...(status ? { status: String(status) } : {}),
        ...(search
          ? {
              OR: [
                { lastName: { contains: String(search) } },
                { firstName: { contains: String(search) } },
                { email: { contains: String(search) } },
              ],
            }
          : {}),
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });

    res.json(staff.map(formatStaff));
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/staff ──────────────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = staffSchema.parse(req.body);
    const schoolId = req.user!.schoolId;

    const member = await prisma.staff.create({
      data: {
        ...data,
        subjects: JSON.stringify(data.subjects),
        assignedClasses: JSON.stringify(data.assignedClasses),
        photo: data.photo ?? null,
        schoolId,
      },
    });

    res.status(201).json(formatStaff(member));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
});

// ─── GET /api/staff/:id ───────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const member = await prisma.staff.findFirst({
      where: { id: req.params.id, schoolId: req.user!.schoolId },
      include: {
        courses: {
          include: { class: { select: { name: true } } },
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        },
      },
    });

    if (!member) {
      res.status(404).json({ error: 'Membre du personnel non trouvé' });
      return;
    }

    res.json(formatStaff(member));
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/staff/:id ───────────────────────────────────────────────────────
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = staffSchema.parse(req.body);
    const schoolId = req.user!.schoolId;

    const existing = await prisma.staff.findFirst({ where: { id: req.params.id, schoolId } });
    if (!existing) {
      res.status(404).json({ error: 'Membre du personnel non trouvé' });
      return;
    }

    const member = await prisma.staff.update({
      where: { id: req.params.id },
      data: {
        ...data,
        subjects: JSON.stringify(data.subjects),
        assignedClasses: JSON.stringify(data.assignedClasses),
        photo: data.photo ?? null,
      },
    });

    res.json(formatStaff(member));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
});

// ─── DELETE /api/staff/:id ────────────────────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.user!.schoolId;
    const existing = await prisma.staff.findFirst({ where: { id: req.params.id, schoolId } });

    if (!existing) {
      res.status(404).json({ error: 'Membre du personnel non trouvé' });
      return;
    }

    const courseCount = await prisma.course.count({ where: { teacherId: req.params.id } });
    if (courseCount > 0) {
      res.status(400).json({
        error: `Impossible de supprimer : ce membre enseigne ${courseCount} cours. Réassignez-les d'abord.`,
      });
      return;
    }

    await prisma.staff.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
