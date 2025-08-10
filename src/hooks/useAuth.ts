import { useMutation, useQuery } from '@tanstack/react-query';
import { authService, vetService } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'next/navigation';
import type {
  RegisterRequest,
  VerifyEmailRequest,
  ResendOtpRequest,
  LoginRequest,
} from '@/types/api';

// Auth hooks
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  });
};

export const useVerifyEmail = () => {
  const { login } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authService.verifyEmail(data),
    onSuccess: (response) => {
      const { access_token, user } = response.data;
      login(user, access_token);
      
      // Redirect based on role and onboarding status
      if (user.role === 'VET') {
        if (user.onboardingStep === 'COMPLETED') {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } else {
        router.push('/dashboard');
      }
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: ResendOtpRequest) => authService.resendOtp(data),
  });
};

export const useLogin = () => {
  const { login, logout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      const { access_token, user } = response.data;
      login(user, access_token);
      
      // Redirect based on role and onboarding status
      if (user.role === 'VET') {
        if (user.onboardingStep === 'COMPLETED') {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } else {
        router.push('/dashboard');
      }
    },
    onError: () => {
      // Clear any stale auth state on login error
      logout();
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  return () => {
    logout();
    router.push('/auth/login');
  };
};

// VET hooks
export const useVetOnboardingStatus = () => {
  return useQuery({
    queryKey: ['vet-onboarding-status'],
    queryFn: () => vetService.getOnboardingStatus(),
  });
};

export const useVetProfile = () => {
  return useQuery({
    queryKey: ['vet-profile'],
    queryFn: () => vetService.getProfile(),
  });
};

export const useSavePersonalInfo = () => {
  const { updateOnboardingSteps } = useAuthStore();
  
  return useMutation({
    mutationFn: vetService.savePersonalInfo,
    onSuccess: () => {
      // Update onboarding steps after successful save
      updateOnboardingSteps({
        EMAIL_VERIFICATION: true,
        PERSONAL_INFO: true,
        COMPANY_INFO: false,
        CLINIC_INFO: false,
      });
    },
  });
};

export const usePersonalInfo = () => {
  return useQuery({
    queryKey: ['vet-personal-info'],
    queryFn: () => vetService.getPersonalInfo(),
  });
};

export const useSaveCompanyInfo = () => {
  const { updateOnboardingSteps } = useAuthStore();
  
  return useMutation({
    mutationFn: vetService.saveCompanyInfo,
    onSuccess: () => {
      updateOnboardingSteps({
        EMAIL_VERIFICATION: true,
        PERSONAL_INFO: true,
        COMPANY_INFO: true,
        CLINIC_INFO: false,
      });
    },
  });
};

export const useCompanyInfo = () => {
  return useQuery({
    queryKey: ['vet-company-info'],
    queryFn: () => vetService.getCompanyInfo(),
  });
};

export const useSaveClinicInfo = () => {
  const { updateOnboardingSteps, updateOnboardingStep } = useAuthStore();
  const router = useRouter();
  
  return useMutation({
    mutationFn: vetService.saveClinicInfo,
    onSuccess: () => {
      // Update onboarding steps
      updateOnboardingSteps({
        EMAIL_VERIFICATION: true,
        PERSONAL_INFO: true,
        COMPANY_INFO: true,
        CLINIC_INFO: true,
      });
      
      // Update onboarding step to completed
      updateOnboardingStep('COMPLETED');
      
      // Show success modal or redirect to dashboard
      router.push('/onboarding/success');
    },
  });
};

export const useClinicInfo = () => {
  return useQuery({
    queryKey: ['vet-clinic-info'],
    queryFn: () => vetService.getClinicInfo(),
  });
};
