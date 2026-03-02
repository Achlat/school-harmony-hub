import type { Student, Staff, SchoolClass, Course, Notification, DashboardStats, Invoice, Payment, Message } from '@/types';

export const mockClasses: SchoolClass[] = [
  { id: '1', name: '6ème A', level: '6ème', studentCount: 32, mainTeacher: 'Mme Agbénou' },
  { id: '2', name: '6ème B', level: '6ème', studentCount: 30, mainTeacher: 'M. Koudjo' },
  { id: '3', name: '5ème A', level: '5ème', studentCount: 28, mainTeacher: 'Mme Amégah' },
  { id: '4', name: '5ème B', level: '5ème', studentCount: 31, mainTeacher: 'M. Djossou' },
  { id: '5', name: '4ème A', level: '4ème', studentCount: 29, mainTeacher: 'Mme Lawson' },
  { id: '6', name: '3ème A', level: '3ème', studentCount: 27, mainTeacher: 'M. Ayéva' },
];

export const mockStudents: Student[] = [
  { id: '1', firstName: 'Ama', lastName: 'Kpodo', dateOfBirth: '2012-03-15', gender: 'F', classId: '1', className: '6ème A', address: '12 Rue de la Paix, Lomé', phone: '+228 90 12 34 56', emergencyContactName: 'M. Kpodo', emergencyContactPhone: '+228 90 99 88 77', status: 'active', enrollmentDate: '2024-09-01' },
  { id: '2', firstName: 'Koffi', lastName: 'Agbénou', dateOfBirth: '2012-07-22', gender: 'M', classId: '1', className: '6ème A', address: '5 Av. de la Libération', phone: '+228 91 22 33 44', emergencyContactName: 'Mme Agbénou', emergencyContactPhone: '+228 91 11 22 33', status: 'active', enrollmentDate: '2024-09-01' },
  { id: '3', firstName: 'Akouvi', lastName: 'Mensah', dateOfBirth: '2011-11-30', gender: 'F', classId: '2', className: '6ème B', address: '8 Bd du 13 Janvier', phone: '+228 92 44 55 66', emergencyContactName: 'M. Mensah', emergencyContactPhone: '+228 92 77 88 99', status: 'active', enrollmentDate: '2024-09-01' },
  { id: '4', firstName: 'Komlan', lastName: 'Djossou', dateOfBirth: '2011-05-10', gender: 'M', classId: '3', className: '5ème A', address: '20 Rue du Commerce', phone: '+228 93 55 66 77', emergencyContactName: 'M. Djossou', emergencyContactPhone: '+228 93 33 44 55', status: 'active', enrollmentDate: '2023-09-01' },
  { id: '5', firstName: 'Afi', lastName: 'Lawson', dateOfBirth: '2010-01-18', gender: 'F', classId: '5', className: '4ème A', address: '3 Rue Tokoin', phone: '+228 94 88 99 00', emergencyContactName: 'Mme Lawson', emergencyContactPhone: '+228 94 66 77 88', status: 'inactive', enrollmentDate: '2022-09-01' },
  { id: '6', firstName: 'Kossi', lastName: 'Amégah', dateOfBirth: '2012-09-05', gender: 'M', classId: '1', className: '6ème A', address: '15 Av. de Sarakawa', phone: '+228 95 11 22 33', emergencyContactName: 'M. Amégah', emergencyContactPhone: '+228 95 44 55 66', status: 'active', enrollmentDate: '2024-09-01' },
  { id: '7', firstName: 'Enam', lastName: 'Ayéva', dateOfBirth: '2011-04-12', gender: 'F', classId: '4', className: '5ème B', address: '7 Rue Bè', phone: '+228 96 77 88 99', emergencyContactName: 'Mme Ayéva', emergencyContactPhone: '+228 96 22 33 44', status: 'active', enrollmentDate: '2023-09-01' },
  { id: '8', firstName: 'Yao', lastName: 'Koudjo', dateOfBirth: '2010-12-01', gender: 'M', classId: '6', className: '3ème A', address: '22 Bd de la Marina', phone: '+228 97 33 44 55', emergencyContactName: 'M. Koudjo', emergencyContactPhone: '+228 97 99 00 11', status: 'active', enrollmentDate: '2021-09-01' },
];

export const mockStaff: Staff[] = [
  { id: '1', firstName: 'Adjoa', lastName: 'Agbénou', role: 'teacher', email: 'adjoa.agbenou@achscholar.tg', phone: '+228 90 10 20 30', address: '10 Av. de la Nouvelle Marche', hireDate: '2018-09-01', status: 'active', subjects: ['Français', 'Littérature'], assignedClasses: ['6ème A', '5ème A'] },
  { id: '2', firstName: 'Messan', lastName: 'Koudjo', role: 'teacher', email: 'messan.koudjo@achscholar.tg', phone: '+228 91 40 50 60', address: '4 Rue de l\'Ogou', hireDate: '2019-09-01', status: 'active', subjects: ['Mathématiques'], assignedClasses: ['6ème B', '4ème A', '3ème A'] },
  { id: '3', firstName: 'Essi', lastName: 'Amégah', role: 'teacher', email: 'essi.amegah@achscholar.tg', phone: '+228 92 70 80 90', address: '6 Bd Gnassingbé Eyadéma', hireDate: '2020-01-15', status: 'active', subjects: ['Sciences', 'SVT'], assignedClasses: ['5ème A', '5ème B'] },
  { id: '4', firstName: 'Kokou', lastName: 'Djossou', role: 'teacher', email: 'kokou.djossou@achscholar.tg', phone: '+228 93 11 22 33', address: '18 Rue d\'Aného', hireDate: '2017-09-01', status: 'active', subjects: ['Histoire-Géo'], assignedClasses: ['5ème B', '3ème A'] },
  { id: '5', firstName: 'Akpéné', lastName: 'Lawson', role: 'admin', email: 'akpene.lawson@achscholar.tg', phone: '+228 94 44 55 66', address: '9 Av. du Golfe', hireDate: '2016-03-01', status: 'active' },
  { id: '6', firstName: 'Kodzo', lastName: 'Ayéva', role: 'teacher', email: 'kodzo.ayeva@achscholar.tg', phone: '+228 95 77 88 99', address: '14 Rue d\'Atakpamé', hireDate: '2021-09-01', status: 'active', subjects: ['Anglais'], assignedClasses: ['6ème A', '6ème B', '4ème A'] },
  { id: '7', firstName: 'Mensah', lastName: 'Togbé', role: 'support', email: 'mensah.togbe@achscholar.tg', phone: '+228 96 00 11 22', address: '2 Bd de la Kara', hireDate: '2022-01-10', status: 'active' },
];

export const mockCourses: Course[] = [
  { id: '1', subject: 'Français', classId: '1', className: '6ème A', teacherId: '1', teacherName: 'Mme Agbénou', room: 'Salle 101', dayOfWeek: 0, startTime: '08:00', endTime: '09:00', color: 'hsl(220, 65%, 38%)' },
  { id: '2', subject: 'Mathématiques', classId: '1', className: '6ème A', teacherId: '2', teacherName: 'M. Koudjo', room: 'Salle 102', dayOfWeek: 0, startTime: '09:00', endTime: '10:00', color: 'hsl(174, 60%, 40%)' },
  { id: '3', subject: 'Anglais', classId: '1', className: '6ème A', teacherId: '6', teacherName: 'M. Ayéva', room: 'Salle 103', dayOfWeek: 1, startTime: '08:00', endTime: '09:00', color: 'hsl(38, 92%, 50%)' },
  { id: '4', subject: 'Sciences', classId: '3', className: '5ème A', teacherId: '3', teacherName: 'Mme Amégah', room: 'Labo 1', dayOfWeek: 1, startTime: '10:00', endTime: '11:30', color: 'hsl(152, 60%, 40%)' },
  { id: '5', subject: 'Histoire-Géo', classId: '6', className: '3ème A', teacherId: '4', teacherName: 'M. Djossou', room: 'Salle 201', dayOfWeek: 2, startTime: '08:00', endTime: '09:30', color: 'hsl(280, 60%, 50%)' },
  { id: '6', subject: 'Français', classId: '3', className: '5ème A', teacherId: '1', teacherName: 'Mme Agbénou', room: 'Salle 101', dayOfWeek: 2, startTime: '10:00', endTime: '11:00', color: 'hsl(220, 65%, 38%)' },
  { id: '7', subject: 'Mathématiques', classId: '5', className: '4ème A', teacherId: '2', teacherName: 'M. Koudjo', room: 'Salle 102', dayOfWeek: 3, startTime: '08:00', endTime: '09:30', color: 'hsl(174, 60%, 40%)' },
  { id: '8', subject: 'Anglais', classId: '2', className: '6ème B', teacherId: '6', teacherName: 'M. Ayéva', room: 'Salle 103', dayOfWeek: 3, startTime: '10:00', endTime: '11:00', color: 'hsl(38, 92%, 50%)' },
  { id: '9', subject: 'SVT', classId: '4', className: '5ème B', teacherId: '3', teacherName: 'Mme Amégah', room: 'Labo 1', dayOfWeek: 4, startTime: '08:00', endTime: '09:30', color: 'hsl(152, 60%, 40%)' },
  { id: '10', subject: 'Mathématiques', classId: '6', className: '3ème A', teacherId: '2', teacherName: 'M. Koudjo', room: 'Salle 102', dayOfWeek: 4, startTime: '10:00', endTime: '11:30', color: 'hsl(174, 60%, 40%)' },
];

export const mockNotifications: Notification[] = [
  { id: '1', title: 'Nouvelle facture créée', message: 'Facture #F-2026-001 créée pour Ama Kpodo', type: 'info', read: false, createdAt: '2026-02-28T09:00:00' },
  { id: '2', title: 'Paiement enregistré', message: 'Paiement de 75 000 FCFA reçu pour Koffi Agbénou', type: 'success', read: false, createdAt: '2026-02-27T14:30:00' },
  { id: '3', title: 'Nouveau cours ajouté', message: 'Français - 6ème A a été ajouté au planning', type: 'success', read: true, createdAt: '2026-02-26T10:15:00' },
  { id: '4', title: 'Facture impayée', message: 'La facture #F-2026-003 de Akouvi Mensah est en retard', type: 'warning', read: false, createdAt: '2026-02-25T16:00:00' },
  { id: '5', title: 'Absence signalée', message: 'M. Koudjo sera absent le 05/03', type: 'warning', read: true, createdAt: '2026-02-24T11:00:00' },
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

export const mockInvoices: Invoice[] = [
  { id: '1', reference: 'F-2026-001', studentId: '1', studentName: 'Ama Kpodo', classId: '1', className: '6ème A', category: 'scolarite', period: 'Trimestre 1 - 2025/2026', amount: 150000, paidAmount: 150000, status: 'paid', issuedDate: '2025-09-15', dueDate: '2025-10-15', description: 'Frais de scolarité T1' },
  { id: '2', reference: 'F-2026-002', studentId: '2', studentName: 'Koffi Agbénou', classId: '1', className: '6ème A', category: 'scolarite', period: 'Trimestre 1 - 2025/2026', amount: 150000, paidAmount: 75000, status: 'partial', issuedDate: '2025-09-15', dueDate: '2025-10-15', description: 'Frais de scolarité T1' },
  { id: '3', reference: 'F-2026-003', studentId: '3', studentName: 'Akouvi Mensah', classId: '2', className: '6ème B', category: 'scolarite', period: 'Trimestre 1 - 2025/2026', amount: 150000, paidAmount: 0, status: 'unpaid', issuedDate: '2025-09-15', dueDate: '2025-10-15', description: 'Frais de scolarité T1' },
  { id: '4', reference: 'F-2026-004', studentId: '1', studentName: 'Ama Kpodo', classId: '1', className: '6ème A', category: 'inscription', period: 'Année 2025/2026', amount: 50000, paidAmount: 50000, status: 'paid', issuedDate: '2025-09-01', dueDate: '2025-09-10', description: 'Frais d\'inscription' },
  { id: '5', reference: 'F-2026-005', studentId: '4', studentName: 'Komlan Djossou', classId: '3', className: '5ème A', category: 'cantine', period: 'Octobre 2025', amount: 25000, paidAmount: 25000, status: 'paid', issuedDate: '2025-10-01', dueDate: '2025-10-10', description: 'Cantine mois d\'octobre' },
  { id: '6', reference: 'F-2026-006', studentId: '6', studentName: 'Kossi Amégah', classId: '1', className: '6ème A', category: 'transport', period: 'Trimestre 1 - 2025/2026', amount: 45000, paidAmount: 0, status: 'unpaid', issuedDate: '2025-09-15', dueDate: '2025-10-01', description: 'Transport scolaire T1' },
  { id: '7', reference: 'F-2026-007', studentId: '7', studentName: 'Enam Ayéva', classId: '4', className: '5ème B', category: 'scolarite', period: 'Trimestre 2 - 2025/2026', amount: 150000, paidAmount: 100000, status: 'partial', issuedDate: '2026-01-10', dueDate: '2026-02-10', description: 'Frais de scolarité T2' },
  { id: '8', reference: 'F-2026-008', studentId: '8', studentName: 'Yao Koudjo', classId: '6', className: '3ème A', category: 'scolarite', period: 'Trimestre 2 - 2025/2026', amount: 175000, paidAmount: 175000, status: 'paid', issuedDate: '2026-01-10', dueDate: '2026-02-10', description: 'Frais de scolarité T2' },
];

export const mockPayments: Payment[] = [
  { id: '1', invoiceId: '1', invoiceRef: 'F-2026-001', studentName: 'Ama Kpodo', className: '6ème A', amount: 150000, date: '2025-09-20', method: 'mobile_money', note: 'Paiement intégral' },
  { id: '2', invoiceId: '2', invoiceRef: 'F-2026-002', studentName: 'Koffi Agbénou', className: '6ème A', amount: 75000, date: '2025-09-25', method: 'cash', note: 'Acompte 1' },
  { id: '3', invoiceId: '4', invoiceRef: 'F-2026-004', studentName: 'Ama Kpodo', className: '6ème A', amount: 50000, date: '2025-09-02', method: 'bank' },
  { id: '4', invoiceId: '5', invoiceRef: 'F-2026-005', studentName: 'Komlan Djossou', className: '5ème A', amount: 25000, date: '2025-10-03', method: 'mobile_money' },
  { id: '5', invoiceId: '7', invoiceRef: 'F-2026-007', studentName: 'Enam Ayéva', className: '5ème B', amount: 100000, date: '2026-01-15', method: 'cash', note: 'Acompte 1' },
  { id: '6', invoiceId: '8', invoiceRef: 'F-2026-008', studentName: 'Yao Koudjo', className: '3ème A', amount: 175000, date: '2026-01-12', method: 'bank', note: 'Paiement intégral' },
];

export const mockMessages: Message[] = [
  { id: '1', from: 'Admin', to: 'Mme Agbénou', subject: 'Réunion pédagogique', body: 'Bonjour, une réunion est prévue le vendredi 07/03 à 15h. Merci de confirmer votre présence.', read: true, createdAt: '2026-02-28T09:00:00' },
  { id: '2', from: 'Admin', to: 'Tout le personnel', subject: 'Emploi du temps modifié', body: 'Suite aux ajustements, le nouvel emploi du temps entre en vigueur lundi prochain.', read: false, createdAt: '2026-02-27T14:30:00' },
  { id: '3', from: 'M. Koudjo', to: 'Admin', subject: 'Demande de matériel', body: 'Nous avons besoin de 30 calculatrices pour la classe de 3ème A. Merci.', read: true, createdAt: '2026-02-26T10:15:00' },
  { id: '4', from: 'Admin', to: 'M. Djossou', subject: 'Absence d\'un élève', body: 'L\'élève Komlan Djossou sera absent pendant 3 jours pour raisons de santé.', read: false, createdAt: '2026-02-25T16:00:00' },
];

export const monthlyFinance = [
  { month: 'Sep', invoiced: 1200000, collected: 950000 },
  { month: 'Oct', invoiced: 350000, collected: 300000 },
  { month: 'Nov', invoiced: 200000, collected: 180000 },
  { month: 'Dec', invoiced: 100000, collected: 75000 },
  { month: 'Jan', invoiced: 1500000, collected: 1100000 },
  { month: 'Fev', invoiced: 400000, collected: 250000 },
];
