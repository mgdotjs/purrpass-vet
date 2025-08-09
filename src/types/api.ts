// Auth types
export type Role = 'USER' | 'VET';

export type OnboardingStep = 
  | 'EMAIL_VERIFICATION'
  | 'PERSONAL_INFO' 
  | 'COMPANY_INFO'
  | 'CLINIC_INFO'
  | 'COMPLETED';

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
