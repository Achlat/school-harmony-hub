// School
export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
}

// Student
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  classId: string;
  className?: string;
  address: string;
  phone: string;
  email?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  status: 'active' | 'inactive';
  enrollmentDate: string;
  photo?: string;
}

// Staff
export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: 'teacher' | 'admin' | 'support';
  email: string;
  phone: string;
  address: string;
  hireDate: string;
  status: 'active' | 'inactive';
  subjects?: string[];
  assignedClasses?: string[];
  photo?: string;
}

// Class
export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  studentCount: number;
  mainTeacher?: string;
}

// Course
export interface Course {
  id: string;
  subject: string;
  classId: string;
  className?: string;
  teacherId: string;
  teacherName?: string;
  room: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  color?: string;
}

// Notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalClasses: number;
}

// Invoice
export type InvoiceStatus = 'paid' | 'partial' | 'unpaid';
export type InvoiceCategory = 'scolarite' | 'inscription' | 'cantine' | 'transport' | 'autre';

export interface Invoice {
  id: string;
  reference: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  category: InvoiceCategory;
  period: string;
  amount: number;
  paidAmount: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  description?: string;
}

// Payment
export interface Payment {
  id: string;
  invoiceId: string;
  invoiceRef: string;
  studentName: string;
  className: string;
  amount: number;
  date: string;
  method: 'cash' | 'mobile_money' | 'bank' | 'cheque';
  note?: string;
}

// Message
export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
}
