import { Router } from 'express';
import authRouter from './auth';
import classesRouter from './classes';
import studentsRouter from './students';
import staffRouter from './staff';
import coursesRouter from './courses';
import notificationsRouter from './notifications';
import dashboardRouter from './dashboard';
import settingsRouter from './settings';

export const router = Router();

router.use('/auth', authRouter);
router.use('/classes', classesRouter);
router.use('/students', studentsRouter);
router.use('/staff', staffRouter);
router.use('/courses', coursesRouter);
router.use('/notifications', notificationsRouter);
router.use('/dashboard', dashboardRouter);
router.use('/settings', settingsRouter);
