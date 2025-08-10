// Auth types
export type Role = 'USER' | 'VET';

export type OnboardingStep = 
  | 'EMAIL_VERIFICATION'
  | 'PERSONAL_INFO' 
  | 'COMPANY_INFO'
  | 'CLINIC_INFO'
  | 'COMPLETED';

export type AppointmentType = 'CHECKUP' | 'VACCINATION' | 'SURGERY' | 'TREATMENT';
export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type PetType = 'DOG' | 'CAT' | 'BIRD' | 'OTHER';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
}

export interface User {
  id: string;
  email: string;
  userCode?: string | null;
  role: Role;
  isVerified: boolean;
  onboardingStep?: OnboardingStep;
  steps?: OnboardingSteps;
}

export interface OnboardingSteps {
  EMAIL_VERIFICATION: boolean;
  PERSONAL_INFO: boolean;
  COMPANY_INFO: boolean;
  CLINIC_INFO: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Auth request types
export interface RegisterRequest {
  email: string;
  password: string;
  role: Role;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// VET specific types
export interface PersonalInfo {
  id?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  tcIdentityNo: string;
  phoneNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyInfo {
  id?: string;
  userId?: string;
  companyName: string;
  companyType: 'INDIVIDUAL' | 'CORPORATION';
  taxOffice: string;
  taxNumber: string;
  cityId: number;
  districtId: number;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicInfo {
  id?: string;
  userId?: string;
  clinicName: string;
  clinicPhoto?: string | null;
  clinicEmail: string;
  clinicPhone: string;
  cityId: number;
  districtId: number;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VetProfile {
  id: string;
  email: string;
  role: Role;
  onboardingStep: OnboardingStep;
  personalInfo?: PersonalInfo;
  companyInfo?: CompanyInfo;
  clinicInfo?: ClinicInfo;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingStatus {
  currentStep: OnboardingStep;
  isComplete: boolean;
  steps: OnboardingSteps;
}

// Pet types
export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  owner?: {
    id: string;
    email: string;
    userCode: string;
  };
}

// Appointment types
export interface Appointment {
  id: string;
  petId: string;
  veterinarianId: string;
  type: AppointmentType;
  title: string;
  appointmentDate: string;
  notes: string;
  status: AppointmentStatus;
  vaccineType?: string | null;
  treatmentType?: string | null;
  surgeryType?: string | null;
  createdAt: string;
  updatedAt: string;
  pet?: Pet;
  veterinarian?: {
    id: string;
    email: string;
    vetClinicInfo?: {
      clinicName: string;
      clinicPhone: string;
    };
  };
  medicalRecords?: unknown[];
}

// Appointment request types
export interface CreateAppointmentRequest {
  petId: string;
  type: AppointmentType;
  title: string;
  appointmentDate: string;
  notes?: string;
  vaccineType?: string;
  treatmentType?: string;
  surgeryType?: string;
}

export interface UpdateAppointmentRequest {
  status?: AppointmentStatus;
  notes?: string;
  vaccineType?: string;
  treatmentType?: string;
  surgeryType?: string;
}
