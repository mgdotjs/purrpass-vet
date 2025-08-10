export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3004/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_OTP: '/auth/resend-otp',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  
  // User endpoints
  USERS: {
    VET: {
      ONBOARDING_STATUS: '/users/vet/onboarding-status',
      PROFILE: '/users/vet/profile',
      PERSONAL_INFO: '/users/vet/personal-info',
      PERSONAL: '/users/vet/personal',
      COMPANY_INFO: '/users/vet/company-info',
      COMPANY: '/users/vet/company',
      CLINIC_INFO: '/users/vet/clinic-info',
      CLINIC: '/users/vet/clinic',
    },
  },

  // Appointment endpoints
  APPOINTMENTS: {
    BASE: '/appointments',
    BY_PET: (petId: string) => `/appointments/${petId}`,
    BY_ID: (id: string) => `/appointments/${id}`,
  },

  // Pet endpoints
  PETS: {
    BASE: '/pets',
    BY_ID: (id: string) => `/pets/${id}`,
    MICROCHIP: (petId: string) => `/pets/${petId}/microchip`,
  },
} as const;

export const ROLES = {
  USER: 'USER',
  VET: 'VET',
} as const;

export const ONBOARDING_STEPS = {
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  PERSONAL_INFO: 'PERSONAL_INFO',
  COMPANY_INFO: 'COMPANY_INFO',
  CLINIC_INFO: 'CLINIC_INFO',
  COMPLETED: 'COMPLETED',
} as const;

export const APPOINTMENT_TYPES = {
  CHECKUP: 'CHECKUP',
  VACCINATION: 'VACCINATION',
  SURGERY: 'SURGERY',
  TREATMENT: 'TREATMENT',
} as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const PET_TYPES = {
  DOG: 'DOG',
  CAT: 'CAT',
  BIRD: 'BIRD',
  OTHER: 'OTHER',
} as const;
