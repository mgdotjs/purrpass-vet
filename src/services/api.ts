import api from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  ApiResponse,
  RegisterRequest,
  VerifyEmailRequest,
  ResendOtpRequest,
  LoginRequest,
  AuthResponse,
  User,
  OnboardingStatus,
  VetProfile,
  PersonalInfo,
  CompanyInfo,
  ClinicInfo,
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '@/types/api';

// Auth Services
export const authService = {
  register: async (data: RegisterRequest): Promise<ApiResponse<{ email: string }>> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data);
    return response.data;
  },

  resendOtp: async (data: ResendOtpRequest): Promise<ApiResponse<null>> => {
    const response = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  me: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
};

// VET Services
export const vetService = {
  getOnboardingStatus: async (): Promise<ApiResponse<OnboardingStatus>> => {
    const response = await api.get(API_ENDPOINTS.USERS.VET.ONBOARDING_STATUS);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<VetProfile>> => {
    const response = await api.get(API_ENDPOINTS.USERS.VET.PROFILE);
    return response.data;
  },

  savePersonalInfo: async (data: Omit<PersonalInfo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<null>> => {
    const response = await api.post(API_ENDPOINTS.USERS.VET.PERSONAL_INFO, data);
    return response.data;
  },

  getPersonalInfo: async (): Promise<ApiResponse<PersonalInfo>> => {
    const response = await api.get(API_ENDPOINTS.USERS.VET.PERSONAL);
    return response.data;
  },

  saveCompanyInfo: async (data: Omit<CompanyInfo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<null>> => {
    const response = await api.post(API_ENDPOINTS.USERS.VET.COMPANY_INFO, data);
    return response.data;
  },

  getCompanyInfo: async (): Promise<ApiResponse<CompanyInfo>> => {
    const response = await api.get(API_ENDPOINTS.USERS.VET.COMPANY);
    return response.data;
  },

  saveClinicInfo: async (data: Omit<ClinicInfo, 'id' | 'userId' | 'clinicPhoto' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<null>> => {
    const response = await api.post(API_ENDPOINTS.USERS.VET.CLINIC_INFO, data);
    return response.data;
  },

  getClinicInfo: async (): Promise<ApiResponse<ClinicInfo>> => {
    const response = await api.get(API_ENDPOINTS.USERS.VET.CLINIC);
    return response.data;
  },
};

// Appointment Services
export const appointmentService = {
  // Get all appointments for the veterinarian
  getAppointments: async (): Promise<ApiResponse<Appointment[]>> => {
    const response = await api.get(API_ENDPOINTS.APPOINTMENTS.BASE);
    return response.data;
  },

  // Get appointments for a specific pet
  getAppointmentsByPet: async (petId: string): Promise<ApiResponse<Appointment[]>> => {
    const response = await api.get(API_ENDPOINTS.APPOINTMENTS.BY_PET(petId));
    return response.data;
  },

  // Create new appointment
  createAppointment: async (data: CreateAppointmentRequest): Promise<ApiResponse<Appointment>> => {
    const response = await api.post(API_ENDPOINTS.APPOINTMENTS.BASE, data);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id: string, data: UpdateAppointmentRequest): Promise<ApiResponse<Appointment>> => {
    const response = await api.put(API_ENDPOINTS.APPOINTMENTS.BY_ID(id), data);
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(API_ENDPOINTS.APPOINTMENTS.BY_ID(id));
    return response.data;
  },
};
