'use client';

import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useVerifyEmail, useResendOtp } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormInput } from '@/components/ui/form-components';
import { Mail, Clock } from 'lucide-react';
import { verifyEmailSchema, type VerifyEmailFormData } from '@/utils/validation';
import { useState } from 'react';

export default function VerifyEmailPage() {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: email,
      otp: '',
    },
  });
  
  const verifyEmailMutation = useVerifyEmail();
  const resendOtpMutation = useResendOtp();

  // Update email when it changes
  useEffect(() => {
    if (email) {
      form.setValue('email', email);
    }
  }, [email, form]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const onSubmit = async (data: VerifyEmailFormData) => {
    try {
      await verifyEmailMutation.mutateAsync(data);
    } catch (error) {
      console.error('Verify email error:', error);
    }
  };

  const handleResendOtp = async () => {
    if (!email || !canResend) return;
    
    try {
      await resendOtpMutation.mutateAsync({ email });
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      console.error('Resend OTP error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            E-posta Doğrulama
          </CardTitle>
          <CardDescription>
            <strong>{email}</strong> adresine gönderilen 6 haneli doğrulama kodunu girin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                name="otp"
                label="Doğrulama Kodu"
                type="text"
                placeholder="000000"
                className="text-center text-2xl tracking-widest"
                maxLength={6}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  form.setValue('otp', value, { shouldValidate: true });
                }}
              />

              {verifyEmailMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Doğrulama kodu hatalı. Lütfen kontrol edip tekrar deneyin.
                  </AlertDescription>
                </Alert>
              )}

              {resendOtpMutation.isSuccess && (
                <Alert>
                  <AlertDescription>
                    Yeni doğrulama kodu e-posta adresinize gönderildi.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={verifyEmailMutation.isPending || form.watch('otp').length !== 6}
              >
                {verifyEmailMutation.isPending ? 'Doğrulanıyor...' : 'Doğrula'}
              </Button>
            </form>
          </FormProvider>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>
                {canResend ? 'Kod gönderebilirsiniz' : `Yeni kod: ${formatTime(countdown)}`}
              </span>
            </div>
            
            <Button
              variant="link"
              onClick={handleResendOtp}
              disabled={!canResend || resendOtpMutation.isPending}
              className="text-blue-600"
            >
              {resendOtpMutation.isPending ? 'Gönderiliyor...' : 'Yeni kod gönder'}
            </Button>
          </div>

          <div className="text-center">
            <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
              Giriş sayfasına dön
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
