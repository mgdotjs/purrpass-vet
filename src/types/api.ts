// Auth types
export type Role = 'USER' | 'VET';

export type OnboardingStep = 
  | 'EMAIL_VERIFICATION'
  | 'PERSONAL_INFO' 
  | 'COMPANY_INFO'
  | 'CLINIC_INFO'
  | 'COMPLETED';

// Phone number interface
export interface PhoneNumber {
  countryCode: number;
  number: string;
}

export type AppointmentType = 'CHECKUP' | 'VACCINATION' | 'SURGERY' | 'TREATMENT';
export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type PetType = 'DOG' | 'CAT' | 'BIRD' | 'OTHER';
export type PetGender = 'MALE' | 'FEMALE';
export type MedicalRecordType = 'CHECKUP' | 'VACCINATION' | 'SURGERY' | 'TREATMENT';

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

// USER specific types
export interface UserPersonalInfo {
  id?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  tcIdentityNo: string;
  phone: PhoneNumber;
  cityId: number;
  districtId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  onboardingStep: OnboardingStep;
  userPersonalInfo?: UserPersonalInfo;
  createdAt: string;
  updatedAt: string;
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
  phone: PhoneNumber;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyInfo {
  id?: string;
  userId?: string;
  companyName: string;
  companyType: 'INDIVIDUAL' | 'CORPORATE';
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
  clinicPhone: PhoneNumber;
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
export interface MicrochipInfo {
  id: string;
  petId: string;
  chipNumber: string;
  chipDate: string;
  veterinarianId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  veterinarianId: string;
  appointmentId: string;
  type: MedicalRecordType;
  title: string;
  description: string;
  diagnosis: string;
  treatment: string;
  medication: string;
  notes: string;
  recordDate: string;
  nextVisitDate: string | null;
  attachments: string | null;
  createdAt: string;
  updatedAt: string;
  veterinarian?: {
    id: string;
    email: string;
    vetPersonalInfo?: {
      firstName: string;
      lastName: string;
    };
    vetClinicInfo?: {
      clinicName: string;
    };
  };
}

export interface PetOwner {
  id: string;
  email: string;
  userCode?: string;
  vetPersonalInfo?: null;
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  birthDate: string;
  gender: PetGender;
  color: string;
  allergies: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: PetOwner;
  microchipInfo?: MicrochipInfo | null;
  medicalRecords?: MedicalRecord[];
}

// Pet request types
export interface CreatePetRequest {
  name: string;
  type: PetType;
  breed: string;
  birthDate: string;
  gender: PetGender;
  color: string;
  allergies?: string;
}

export interface UpdatePetRequest {
  name?: string;
  breed?: string;
  birthDate?: string;
  color?: string;
  allergies?: string;
}

export interface CreateMicrochipRequest {
  chipNumber: string;
  chipDate: string;
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
