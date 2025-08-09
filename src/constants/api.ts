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
