'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useVetOnboardingStatus } from '@/hooks/useAuth';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: onboardingStatus, isLoading } = useVetOnboardingStatus();

  useEffect(() => {
    // Only VET users should access onboarding
    if (user?.role !== 'VET') {
      router.push('/dashboard');
      return;
    }

    // Redirect based on onboarding status
    if (onboardingStatus?.data) {
      const { currentStep, isComplete } = onboardingStatus.data;
      
      if (isComplete) {
        router.push('/dashboard');
      } else {
        switch (currentStep) {
          case 'PERSONAL_INFO':
            router.push('/onboarding/personal-info');
            break;
          case 'COMPANY_INFO':
            router.push('/onboarding/company-info');
            break;
          case 'CLINIC_INFO':
            router.push('/onboarding/clinic-info');
            break;
          default:
            router.push('/onboarding/personal-info');
        }
      }
    }
  }, [user, onboardingStatus, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return null;
}
