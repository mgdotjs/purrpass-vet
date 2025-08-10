'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function OnboardingSuccessPage() {
  const router = useRouter();
  const { updateOnboardingStep } = useAuthStore();

  useEffect(() => {
    // Update onboarding step to completed when success page loads
    updateOnboardingStep('COMPLETED');
    
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router, updateOnboardingStep]);

  const handleContinue = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            Kayıt Tamamlandı!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Veteriner hekim kaydınız başarıyla tamamlanmıştır. Artık PurrPass platformunu kullanmaya başlayabilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">✓ E-posta doğrulandı</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">✓ Kişisel bilgiler kaydedildi</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">✓ Şirket bilgileri kaydedildi</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">✓ Klinik bilgileri kaydedildi</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={handleContinue} className="w-full">
              Dashboard&apos;a Git
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <p className="text-xs text-gray-500">
              5 saniye içinde otomatik yönlendirileceksiniz...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
