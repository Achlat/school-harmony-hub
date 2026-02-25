import type { Student, Staff, SchoolClass, Course, Notification, DashboardStats } from '@/types';

export const mockClasses: SchoolClass[] = [
  { id: '1', name: '6ème A', level: '6ème', studentCount: 32, mainTeacher: 'Mme Dupont' },
  { id: '2', name: '6ème B', level: '6ème', studentCount: 30, mainTeacher: 'M. Martin' },
  { id: '3', name: '5ème A', level: '5ème', studentCount: 28, mainTeacher: 'Mme Bernard' },
  { id: '4', name: '5ème B', level: '5ème', studentCount: 31, mainTeacher: 'M. Petit' },
  { id: '5', name: '4ème A', level: '4ème', studentCount: 29, mainTeacher: 'Mme Leroy' },
  { id: '6', name: '3ème A', level: '3ème', studentCount: 27, mainTeacher: 'M. Moreau' },
];

export const mockStudents: Student[] = [
  { id: '1', firstName: 'Aya', lastName: 'Traoré', dateOfBirth: '2012-03-15', gender: 'F', classId: '1', className: '6ème A', address: '12 Rue des Lilas', phone: '+225 07 12 34 56', emergencyContactName: 'M. Traoré', emergencyContactPhone: '+225 07 99 88 77', status: 'active', enrollmentDate: '2024-09-01' },
  { id: '2', firstName: 'Moussa', lastName: 'Koné', dateOfBirth: '2012-07-22', gender: 'M', classId: '1', className: '6ème A', address: '5 Av. de la Paix', phone: '+225 05 22 33 44', emergencyContactName: 'Mme Koné', emergencyContactPhone: '+225 05 11 22 33', status: 'active', enrollmentDate: '2024-09-01' },
  { id: '3', firstName: 'Fatou', lastName: 'Diallo', dateOfBirth: '2011-11-30', gender: 'F', classId: '2', className: '6ème B', address: '8 Bd Roume', phone: '+225 01 44 55 66', emergencyContactName: 'M. Diallo', emergencyContactPhone: '+225 01 77 88 99', status: 'active', enrollmentDate: '2024-09-01' },
  { id: '4', firstName: 'Ibrahim', lastName: 'Ouédraogo', dateOfBirth: '2011-05-10', gender: 'M', classId: '3', className: '5ème A', address: '20 Rue Leclerc', phone: '+225 07 55 66 77', emergencyContactName: 'M. Ouédraogo', emergencyContactPhone: '+225 07 33 44 55', status: 'active', enrollmentDate: '2023-09-01' },
  { id: '5', firstName: 'Aminata', lastName: 'Sanogo', dateOfBirth: '2010-01-18', gender: 'F', classId: '5', className: '4ème A', address: '3 Rue du Commerce', phone: '+225 05 88 99 00', emergencyContactName: 'Mme Sanogo', emergencyContactPhone: '+225 05 66 77 88', status: 'inactive', enrollmentDate: '2022-09-01' },
  { id: '6', firstName: 'Koffi', lastName: 'Yao', dateOfBirth: '2012-09-05', gender: 'M', classId: '1', className: '6ème A', address: '15 Av. Noguès', phone: '+225 01 11 22 33', emergencyContactName: 'M. Yao', emergencyContactPhone: '+225 01 44 55 66', status: 'active', enrollmentDate: '2024-09-01' },
  { id: '7', firstName: 'Mariam', lastName: 'Bamba', dateOfBirth: '2011-04-12', gender: 'F', classId: '4', className: '5ème B', address: '7 Rue Binger', phone: '+225 07 77 88 99', emergencyContactName: 'Mme Bamba', emergencyContactPhone: '+225 07 22 33 44', status: 'active', enrollmentDate: '2023-09-01' },
  { id: '8', firstName: 'Sékou', lastName: 'Camara', dateOfBirth: '2010-12-01', gender: 'M', classId: '6', className: '3ème A', address: '22 Bd Latrille', phone: '+225 05 33 44 55', emergencyContactName: 'M. Camara', emergencyContactPhone: '+225 05 99 00 11', status: 'active', enrollmentDate: '2021-09-01' },
];

export const mockStaff: Staff[] = [
  { id: '1', firstName: 'Marie', lastName: 'Dupont', role: 'teacher', email: 'marie.dupont@ecole.ci', phone: '+225 07 10 20 30', address: '10 Av. Franchet', hireDate: '2018-09-01', status: 'active', subjects: ['Français', 'Littérature'], assignedClasses: ['6ème A', '5ème A'] },
  { id: '2', firstName: 'Jean', lastName: 'Martin', role: 'teacher', email: 'jean.martin@ecole.ci', phone: '+225 05 40 50 60', address: '4 Rue Clozel', hireDate: '2019-09-01', status: 'active', subjects: ['Mathématiques'], assignedClasses: ['6ème B', '4ème A', '3ème A'] },
  { id: '3', firstName: 'Aïcha', lastName: 'Bernard', role: 'teacher', email: 'aicha.bernard@ecole.ci', phone: '+225 01 70 80 90', address: '6 Bd Angoulvant', hireDate: '2020-01-15', status: 'active', subjects: ['Sciences', 'SVT'], assignedClasses: ['5ème A', '5ème B'] },
  { id: '4', firstName: 'Paul', lastName: 'Petit', role: 'teacher', email: 'paul.petit@ecole.ci', phone: '+225 07 11 22 33', address: '18 Rue Gourgas', hireDate: '2017-09-01', status: 'active', subjects: ['Histoire-Géo'], assignedClasses: ['5ème B', '3ème A'] },
  { id: '5', firstName: 'Sophie', lastName: 'Leroy', role: 'admin', email: 'sophie.leroy@ecole.ci', phone: '+225 05 44 55 66', address: '9 Av. Terrasson', hireDate: '2016-03-01', status: 'active' },
  { id: '6', firstName: 'Kouadio', lastName: 'Moreau', role: 'teacher', email: 'kouadio.moreau@ecole.ci', phone: '+225 01 77 88 99', address: '14 Rue Jesse Owens', hireDate: '2021-09-01', status: 'active', subjects: ['Anglais'], assignedClasses: ['6ème A', '6ème B', '4ème A'] },
  { id: '7', firstName: 'Adama', lastName: 'Touré', role: 'support', email: 'adama.toure@ecole.ci', phone: '+225 07 00 11 22', address: '2 Bd de la République', hireDate: '2022-01-10', status: 'active' },
];

export const mockCourses: Course[] = [
  { id: '1', subject: 'Français', classId: '1', className: '6ème A', teacherId: '1', teacherName: 'Mme Dupont', room: 'Salle 101', dayOfWeek: 0, startTime: '08:00', endTime: '09:00', color: 'hsl(220, 65%, 38%)' },
  { id: '2', subject: 'Mathématiques', classId: '1', className: '6ème A', teacherId: '2', teacherName: 'M. Martin', room: 'Salle 102', dayOfWeek: 0, startTime: '09:00', endTime: '10:00', color: 'hsl(174, 60%, 40%)' },
  { id: '3', subject: 'Anglais', classId: '1', className: '6ème A', teacherId: '6', teacherName: 'M. Moreau', room: 'Salle 103', dayOfWeek: 1, startTime: '08:00', endTime: '09:00', color: 'hsl(38, 92%, 50%)' },
  { id: '4', subject: 'Sciences', classId: '3', className: '5ème A', teacherId: '3', teacherName: 'Mme Bernard', room: 'Labo 1', dayOfWeek: 1, startTime: '10:00', endTime: '11:30', color: 'hsl(152, 60%, 40%)' },
  { id: '5', subject: 'Histoire-Géo', classId: '6', className: '3ème A', teacherId: '4', teacherName: 'M. Petit', room: 'Salle 201', dayOfWeek: 2, startTime: '08:00', endTime: '09:30', color: 'hsl(280, 60%, 50%)' },
  { id: '6', subject: 'Français', classId: '3', className: '5ème A', teacherId: '1', teacherName: 'Mme Dupont', room: 'Salle 101', dayOfWeek: 2, startTime: '10:00', endTime: '11:00', color: 'hsl(220, 65%, 38%)' },
  { id: '7', subject: 'Mathématiques', classId: '5', className: '4ème A', teacherId: '2', teacherName: 'M. Martin', room: 'Salle 102', dayOfWeek: 3, startTime: '08:00', endTime: '09:30', color: 'hsl(174, 60%, 40%)' },
  { id: '8', subject: 'Anglais', classId: '2', className: '6ème B', teacherId: '6', teacherName: 'M. Moreau', room: 'Salle 103', dayOfWeek: 3, startTime: '10:00', endTime: '11:00', color: 'hsl(38, 92%, 50%)' },
  { id: '9', subject: 'SVT', classId: '4', className: '5ème B', teacherId: '3', teacherName: 'Mme Bernard', room: 'Labo 1', dayOfWeek: 4, startTime: '08:00', endTime: '09:30', color: 'hsl(152, 60%, 40%)' },
  { id: '10', subject: 'Mathématiques', classId: '6', className: '3ème A', teacherId: '2', teacherName: 'M. Martin', room: 'Salle 102', dayOfWeek: 4, startTime: '10:00', endTime: '11:30', color: 'hsl(174, 60%, 40%)' },
];

export const mockNotifications: Notification[] = [
  { id: '1', title: 'Nouveau cours ajouté', message: 'Français - 6ème A a été ajouté au planning', type: 'success', read: false, createdAt: '2025-02-25T09:00:00' },
  { id: '2', title: 'Absence signalée', message: 'M. Martin sera absent le 28/02', type: 'warning', read: false, createdAt: '2025-02-24T14:30:00' },
  { id: '3', title: 'Inscription validée', message: '3 nouveaux élèves inscrits en 6ème A', type: 'info', read: true, createdAt: '2025-02-23T10:15:00' },
  { id: '4', title: 'Réunion parents', message: 'Réunion programmée le 05/03 à 18h', type: 'info', read: true, createdAt: '2025-02-22T16:00:00' },
];

export const mockDashboardStats: DashboardStats = {
  totalStudents: 177,
  totalTeachers: 12,
  totalCourses: 45,
  totalClasses: 6,
};

export const studentsPerClass = [
  { name: '6ème A', count: 32 },
  { name: '6ème B', count: 30 },
  { name: '5ème A', count: 28 },
  { name: '5ème B', count: 31 },
  { name: '4ème A', count: 29 },
  { name: '3ème A', count: 27 },
];

export const coursesPerSubject = [
  { name: 'Français', count: 8 },
  { name: 'Maths', count: 10 },
  { name: 'Anglais', count: 6 },
  { name: 'Sciences', count: 7 },
  { name: 'Histoire', count: 5 },
  { name: 'SVT', count: 4 },
  { name: 'EPS', count: 5 },
];
