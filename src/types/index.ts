export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  result: T | null;
};

export type ServiceInfo = {
  port: number;
  address: string;
  useCount: number;
  serviceName: string;
  updatedAt: Date;
};

export enum Role {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  ADMIN = "ADMIN",
  PENDING = "PENDING",
}

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

enum APPOINTMENT_STATUS {
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
}

interface Flag {
  id: string;
  isSuspended: boolean;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  status: APPOINTMENT_STATUS;
}

interface AvailableHours {
  day: string; // e.g., "Monday", "Tuesday"
  startTime: string; // e.g., "09:00 AM"
  endTime: string; // e.g., "05:00 PM"
}
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: Role;
  admin: Admin | null;
  patient: Patient | null;
  doctor: Doctor | null;
}

export interface Admin {
  userId: string;
  user: User & {
    role: Role.ADMIN;
  };
}
export interface Patient {
  userId: string;
  user: User & {
    role: Role.PATIENT;
  };
  dateOfBirth: Date;
  gender: Gender;
  flagId: string;
  flag: Flag;
  appointments: Appointment[];

  createdAt: Date;
  updatedAt: Date;
}

// Doctor Type
export interface Doctor {
  userId: string;
  user: User & {
    role: Role.DOCTOR;
  };
  gender: Gender;
  specializations: string[]; // e.g., ["Cardiology", "Pediatrics"]
  qualifications: string[]; // e.g., ["MBBS", "MD"]
  certifications: string[];
  yearsOfExperience: number;
  profileImageUrl?: string | null;
  bio?: string | null;
  availableHours: AvailableHours[];
  flagId: string;
  flag: Flag;
  appointments: Appointment[];

  createdAt: Date;
  updatedAt: Date;
}
