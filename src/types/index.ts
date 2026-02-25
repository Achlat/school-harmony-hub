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
  dayOfWeek: number; // 0=Mon, 1=Tue, etc.
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
