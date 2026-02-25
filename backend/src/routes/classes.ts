import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// ─── Schémas ──────────────────────────────────────────────────────────────────
const classSchema = z.object({
  name: z.string().min(1, 'Le nom est obligatoire'),
  level: z.string().min(1, 'Le niveau est obligatoire'),
  mainTeacher: z.string().optional(),
});

// Helper : nombre d'étudiants actifs par classe
async function withStudentCount(cls: { id: string; name: string; level: string; mainTeacher: string | null }) {
  const studentCount = await prisma.student.count({
    where: { classId: cls.id, status: 'active' },
  });
  return { ...cls, studentCount };
}

// ─── GET /api/classes ─────────────────────────────────────────────────────────
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { level } = req.query;
    const schoolId = req.user!.schoolId;

    const classes = await prisma.class.findMany({
      where: {
        schoolId,
        ...(level ? { level: String(level) } : {}),
      },
      orderBy: [{ level: 'asc' }, { name: 'asc' }],
    });

    const result = await Promise.all(classes.map(withStudentCount));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/classes ────────────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = classSchema.parse(req.body);
    const schoolId = req.user!.schoolId;

    const cls = await prisma.class.create({
      data: { ...data, schoolId },
    });

    const result = await withStudentCount(cls);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
});

// ─── GET /api/classes/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cls = await prisma.class.findFirst({
      where: { id: req.params.id, schoolId: req.user!.schoolId },
      include: {
        students: { where: { status: 'active' }, orderBy: { lastName: 'asc' } },
        courses: { include: { teacher: { select: { firstName: true, lastName: true } } } },
      },
    });

    if (!cls) {
      res.status(404).json({ error: 'Classe non trouvée' });
      return;
    }

    res.json(cls);
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/classes/:id ─────────────────────────────────────────────────────
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = classSchema.parse(req.body);
    const schoolId = req.user!.schoolId;

    const existing = await prisma.class.findFirst({ where: { id: req.params.id, schoolId } });
    if (!existing) {
      res.status(404).json({ error: 'Classe non trouvée' });
      return;
    }

    const cls = await prisma.class.update({
      where: { id: req.params.id },
      data,
    });

    const result = await withStudentCount(cls);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
});

// ─── DELETE /api/classes/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.user!.schoolId;

    const existing = await prisma.class.findFirst({ where: { id: req.params.id, schoolId } });
    if (!existing) {
      res.status(404).json({ error: 'Classe non trouvée' });
      return;
    }

    const studentCount = await prisma.student.count({ where: { classId: req.params.id } });
    if (studentCount > 0) {
      res.status(400).json({
        error: `Impossible de supprimer : cette classe contient ${studentCount} étudiant(s). Réassignez-les d'abord.`,
      });
      return;
    }

    await prisma.class.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
