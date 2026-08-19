export interface RecentSignup {
  id: string;
  name: string;
  grade: number | null;
  countryCode: string;
  countryName: string;
  createdAt: string;
}

export interface CountryEnrollment {
  code: string;
  name: string;
  students: number;
}

export interface PlatformOverview {
  schools: number;
  teachers: number;
  students: number;
  classes: number;
  countriesRepresented: number;
  activeLast24h: number;
  testsThisWeek: number;
  recentSignups: RecentSignup[];
  enrollmentByCountry: CountryEnrollment[];
  schoolsList: { id: string; name: string; city: string | null; teacherCount: number; studentCount: number; classCount: number }[];
}

export interface TeacherDirectoryRow {
  id: string;
  name: string;
  email: string;
  schoolId: string | null;
  schoolName: string;
  classCount: number;
  studentCount: number;
}

export interface StudentDirectoryRow {
  id: string;
  name: string;
  email: string;
  grade: number;
  className: string | null;
  schoolName: string;
  countryName: string;
  xp: number;
  lastActiveAt: string | null;
}

export interface SchoolDetail {
  id: string;
  name: string;
  city: string | null;
  countryName: string;
  academicYear: string | null;
  teacherCode: string;
  teachers: { id: string; name: string; email: string; classCount: number }[];
  classes: { id: string; name: string; grade: number; teacherName: string; studentCount: number }[];
  students: { id: string; name: string; grade: number; className: string | null; xp: number }[];
}

export interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  message: string;
  handled: boolean;
  createdAt: string;
}
