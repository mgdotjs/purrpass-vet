'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormInput, FormPassword, FormSelect } from '@/components/ui/form-components';
import { registerSchema, type RegisterFormData } from '@/utils/validation';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function RegisterPage() {
  const router = useRouter();
  
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'USER',
    },
  });
  
  const registerMutation = useRegister();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
        role: data.role,
      });
      router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  const roleOptions = [
    { value: 'USER', label: 'Pet Sahibi' },
    { value: 'VET', label: 'Veteriner Hekim' },
  ];

  return (
    <div className="min-h-screen flex dark:bg-gray-900">
      <ThemeToggle />
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-700 dark:from-slate-800 dark:via-slate-900 dark:to-black"></div>
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-16 left-16 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white max-w-lg">
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                <span className="text-2xl">✨</span>
              </div>
              <h1 className="text-3xl font-bold">PurrPass</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Veteriner Dünyasına
              <br />
              <span className="text-pink-300">Katılın</span>
            </h2>
            <p className="text-lg text-pink-100 mb-8">
              Sadece 2 dakikada hesap oluşturun ve PurrPass&apos;in 
              tüm avantajlarından faydalanmaya başlayın.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-pink-400/30 rounded-lg flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Hızlı Başlangıç</h3>
                <p className="text-pink-100/80 text-sm">30 saniyede hesap oluşturun, hemen kullanmaya başlayın</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-pink-400/30 rounded-lg flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Güvenli Altyapı</h3>
                <p className="text-pink-100/80 text-sm">Tüm verileriniz şifrelenerek güvenle saklanır</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-pink-400/30 rounded-lg flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">7/24 Destek</h3>
                <p className="text-pink-100/80 text-sm">Teknik destek ekibimiz her zaman yanınızda</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-700 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center mr-3">
              <span className="text-2xl">✨</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PurrPass</h1>
          </div>
        </div>

        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white dark:bg-slate-800 dark:border-slate-700 rounded-2xl">
            <CardHeader className="space-y-1 pb-8 pt-8 px-8">
              <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
                Hesap Oluşturun
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-300 text-base">
                PurrPass ailesine katılın
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormInput
                    name="email"
                    label="E-posta Adresi"
                    type="email"
                    placeholder="ornek@veteriner.com"
                  />

                  <FormSelect
                    name="role"
                    label="Hesap Türü"
                    placeholder="Hesap türünüzü seçin"
                    options={roleOptions}
                  />

                  <FormPassword
                    name="password"
                    label="Şifre"
                    placeholder="Güçlü bir şifre oluşturun"
                  />

                  <FormPassword
                    name="confirmPassword"
                    label="Şifre Tekrar"
                    placeholder="Şifrenizi tekrar girin"
                  />

                  <div className="flex items-start pt-2">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                        <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 font-medium">Kullanım Koşulları</a> ve{' '}
                        <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 font-medium">Gizlilik Politikası</a>&apos;nı
                        okudum ve kabul ediyorum.
                      </label>
                    </div>
                  </div>

                  {registerMutation.isError && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                      <AlertDescription className="text-red-800">
                        Kayıt olurken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    disabled={registerMutation.isPending}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {registerMutation.isPending ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Hesap oluşturuluyor...
                      </div>
                    ) : (
                      'Hesap Oluştur'
                    )}
                  </Button>
                </form>
              </FormProvider>
              
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">veya</span>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    Zaten hesabınız var mı?{' '}
                    <Link 
                      href="/auth/login" 
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-500 font-semibold transition-colors"
                    >
                      Giriş yapın
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
