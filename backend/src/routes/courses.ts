import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// ─── Schémas ──────────────────────────────────────────────────────────────────
const courseSchema = z.object({
  subject: z.string().min(1, 'La matière est obligatoire'),
  classId: z.string().min(1, 'La classe est obligatoire'),
  teacherId: z.string().min(1, "L'enseignant est obligatoire"),
  room: z.string().min(1, 'La salle est obligatoire'),
  dayOfWeek: z.number().int().min(0).max(4, 'Le jour doit être entre 0 (lun.) et 4 (ven.)'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format heure invalide (HH:MM)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format heure invalide (HH:MM)'),
  color: z.string().optional(),
});

// Helper : formate un cours avec les noms liés
function formatCourse(course: {
  id: string;
  subject: string;
  classId: string;
  teacherId: string;
  room: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  color: string | null;
  class?: { name: string };
  teacher?: { firstName: string; lastName: string; role: string };
}) {
  return {
    ...course,
    color: course.color ?? undefined,
    className: course.class?.name,
    teacherName: course.teacher
      ? `${course.teacher.firstName} ${course.teacher.lastName}`.trim()
      : undefined,
  };
}

// ─── GET /api/courses ─────────────────────────────────────────────────────────
// Filtres : ?classId=xxx&teacherId=xxx&dayOfWeek=0&subject=Maths
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.user!.schoolId;
    const { classId, teacherId, dayOfWeek, subject } = req.query;

    const courses = await prisma.course.findMany({
      where: {
        schoolId,
        ...(classId ? { classId: String(classId) } : {}),
        ...(teacherId ? { teacherId: String(teacherId) } : {}),
        ...(dayOfWeek !== undefined ? { dayOfWeek: parseInt(String(dayOfWeek), 10) } : {}),
        ...(subject ? { subject: { contains: String(subject) } } : {}),
      },
      include: {
        class: { select: { name: true } },
        teacher: { select: { firstName: true, lastName: true, role: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    res.json(courses.map(formatCourse));
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/courses ────────────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = courseSchema.parse(req.body);
    const schoolId = req.user!.schoolId;

    // Vérifications d'appartenance à l'école
    const [cls, teacher] = await Promise.all([
      prisma.class.findFirst({ where: { id: data.classId, schoolId } }),
      prisma.staff.findFirst({ where: { id: data.teacherId, schoolId } }),
    ]);

    if (!cls) {
      res.status(400).json({ error: 'Classe invalide ou inaccessible' });
      return;
    }
    if (!teacher) {
      res.status(400).json({ error: 'Enseignant invalide ou inaccessible' });
      return;
    }

    // Vérification de conflit horaire (même classe, même jour, chevauchement)
    const conflict = await prisma.course.findFirst({
      where: {
        schoolId,
        classId: data.classId,
        dayOfWeek: data.dayOfWeek,
        OR: [
          { startTime: { gte: data.startTime, lt: data.endTime } },
          { endTime: { gt: data.startTime, lte: data.endTime } },
          { startTime: { lte: data.startTime }, endTime: { gte: data.endTime } },
        ],
      },
    });

    if (conflict) {
      res.status(409).json({
        error: `Conflit horaire : la classe a déjà un cours de "${conflict.subject}" sur ce créneau`,
      });
      return;
    }

    const course = await prisma.course.create({
      data: { ...data, color: data.color ?? null, schoolId },
      include: {
        class: { select: { name: true } },
        teacher: { select: { firstName: true, lastName: true, role: true } },
      },
    });

    res.status(201).json(formatCourse(course));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
});

// ─── GET /api/courses/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await prisma.course.findFirst({
      where: { id: req.params.id, schoolId: req.user!.schoolId },
      include: {
        class: { select: { name: true } },
        teacher: { select: { firstName: true, lastName: true, role: true } },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Cours non trouvé' });
      return;
    }

    res.json(formatCourse(course));
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/courses/:id ─────────────────────────────────────────────────────
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = courseSchema.parse(req.body);
    const schoolId = req.user!.schoolId;

    const existing = await prisma.course.findFirst({ where: { id: req.params.id, schoolId } });
    if (!existing) {
      res.status(404).json({ error: 'Cours non trouvé' });
      return;
    }

    const [cls, teacher] = await Promise.all([
      prisma.class.findFirst({ where: { id: data.classId, schoolId } }),
      prisma.staff.findFirst({ where: { id: data.teacherId, schoolId } }),
    ]);

    if (!cls) {
      res.status(400).json({ error: 'Classe invalide ou inaccessible' });
      return;
    }
    if (!teacher) {
      res.status(400).json({ error: 'Enseignant invalide ou inaccessible' });
      return;
    }

    // Conflit horaire (exclure le cours en cours d'édition)
    const conflict = await prisma.course.findFirst({
      where: {
        schoolId,
        classId: data.classId,
        dayOfWeek: data.dayOfWeek,
        id: { not: req.params.id },
        OR: [
          { startTime: { gte: data.startTime, lt: data.endTime } },
          { endTime: { gt: data.startTime, lte: data.endTime } },
          { startTime: { lte: data.startTime }, endTime: { gte: data.endTime } },
        ],
      },
    });

    if (conflict) {
      res.status(409).json({
        error: `Conflit horaire : la classe a déjà un cours de "${conflict.subject}" sur ce créneau`,
      });
      return;
    }

    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: { ...data, color: data.color ?? null },
      include: {
        class: { select: { name: true } },
        teacher: { select: { firstName: true, lastName: true, role: true } },
      },
    });

    res.json(formatCourse(course));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
});

// ─── DELETE /api/courses/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.user!.schoolId;
    const existing = await prisma.course.findFirst({ where: { id: req.params.id, schoolId } });

    if (!existing) {
      res.status(404).json({ error: 'Cours non trouvé' });
      return;
    }

    await prisma.course.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
