import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// ─── Schémas ──────────────────────────────────────────────────────────────────
const studentSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est obligatoire'),
  lastName: z.string().min(1, 'Le nom est obligatoire'),
  dateOfBirth: z.string().min(1, 'La date de naissance est obligatoire'),
  gender: z.enum(['M', 'F'], { message: 'Le genre doit être M ou F' }),
  classId: z.string().min(1, 'La classe est obligatoire'),
  address: z.string().min(1, 'L\'adresse est obligatoire'),
  phone: z.string().min(1, 'Le téléphone est obligatoire'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  emergencyContactName: z.string().min(1, 'Le contact d\'urgence est obligatoire'),
  emergencyContactPhone: z.string().min(1, 'Le téléphone d\'urgence est obligatoire'),
  status: z.enum(['active', 'inactive']).default('active'),
  enrollmentDate: z.string().min(1, 'La date d\'inscription est obligatoire'),
  photo: z.string().optional(),
});

// Helper : enrichit un étudiant avec le nom de sa classe
function formatStudent(student: {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  classId: string;
  address: string;
  phone: string;
  email: string | null;
  emergencyContactName: string;
  emergencyContactPhone: string;
  status: string;
  enrollmentDate: string;
  photo: string | null;
  class?: { name: string };
}) {
  return {
    ...student,
    email: student.email ?? undefined,
    photo: student.photo ?? undefined,
    className: student.class?.name,
  };
}

// ─── GET /api/students ────────────────────────────────────────────────────────
// Filtres disponibles : ?classId=xxx&status=active&search=xxx&page=1&limit=20
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.user!.schoolId;
    const { classId, status, search, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = {
      schoolId,
      ...(classId ? { classId: String(classId) } : {}),
      ...(status ? { status: String(status) } : {}),
      ...(search
        ? {
            OR: [
              { lastName: { contains: String(search) } },
              { firstName: { contains: String(search) } },
            ],
          }
        : {}),
    };

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: { class: { select: { name: true } } },
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        skip,
        take: limitNum,
      }),
      prisma.student.count({ where }),
    ]);

    res.json({
      data: students.map(formatStudent),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/students ───────────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = studentSchema.parse(req.body);
    const schoolId = req.user!.schoolId;

    // Vérifier que la classe appartient à l'école
    const cls = await prisma.class.findFirst({ where: { id: data.classId, schoolId } });
    if (!cls) {
      res.status(400).json({ error: 'Classe invalide ou inaccessible' });
      return;
    }

    const student = await prisma.student.create({
      data: {
        ...data,
        email: data.email || null,
        schoolId,
      },
      include: { class: { select: { name: true } } },
    });

    res.status(201).json(formatStudent(student));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
});

// ─── GET /api/students/:id ────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await prisma.student.findFirst({
      where: { id: req.params.id, schoolId: req.user!.schoolId },
      include: { class: { select: { name: true } } },
    });

    if (!student) {
      res.status(404).json({ error: 'Étudiant non trouvé' });
      return;
    }

    res.json(formatStudent(student));
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/students/:id ────────────────────────────────────────────────────
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = studentSchema.parse(req.body);
    const schoolId = req.user!.schoolId;

    const existing = await prisma.student.findFirst({ where: { id: req.params.id, schoolId } });
    if (!existing) {
      res.status(404).json({ error: 'Étudiant non trouvé' });
      return;
    }

    const cls = await prisma.class.findFirst({ where: { id: data.classId, schoolId } });
    if (!cls) {
      res.status(400).json({ error: 'Classe invalide ou inaccessible' });
      return;
    }

    const student = await prisma.student.update({
      where: { id: req.params.id },
      data: { ...data, email: data.email || null },
      include: { class: { select: { name: true } } },
    });

    res.json(formatStudent(student));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
});

// ─── DELETE /api/students/:id ─────────────────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.user!.schoolId;
    const existing = await prisma.student.findFirst({ where: { id: req.params.id, schoolId } });

    if (!existing) {
      res.status(404).json({ error: 'Étudiant non trouvé' });
      return;
    }

    await prisma.student.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
