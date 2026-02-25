import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// ─── GET /api/dashboard ───────────────────────────────────────────────────────
// Retourne les statistiques, données de graphiques et notifications récentes
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.user!.schoolId;

    // Statistiques principales (requêtes en parallèle)
    const [
      totalStudents,
      totalTeachers,
      totalCourses,
      totalClasses,
      recentNotifications,
      classes,
      courses,
    ] = await Promise.all([
      prisma.student.count({ where: { schoolId, status: 'active' } }),
      prisma.staff.count({ where: { schoolId, role: 'teacher', status: 'active' } }),
      prisma.course.count({ where: { schoolId } }),
      prisma.class.count({ where: { schoolId } }),
      prisma.notification.findMany({
        where: { schoolId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.class.findMany({
        where: { schoolId },
        orderBy: { name: 'asc' },
      }),
      prisma.course.findMany({
        where: { schoolId },
        select: { subject: true },
      }),
    ]);

    // Données graphique : étudiants par classe
    const studentsPerClass = await Promise.all(
      classes.map(async (cls) => {
        const count = await prisma.student.count({
          where: { classId: cls.id, status: 'active' },
        });
        return { name: cls.name, count };
      })
    );

    // Données graphique : cours par matière
    const subjectMap: Record<string, number> = {};
    for (const course of courses) {
      subjectMap[course.subject] = (subjectMap[course.subject] ?? 0) + 1;
    }
    const coursesPerSubject = Object.entries(subjectMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Nombre de notifications non lues
    const unreadCount = await prisma.notification.count({
      where: { schoolId, read: false },
    });

    res.json({
      stats: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalClasses,
        unreadNotifications: unreadCount,
      },
      charts: {
        studentsPerClass,
        coursesPerSubject,
      },
      recentNotifications,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
