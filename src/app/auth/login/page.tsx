'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormInput, FormPassword } from '@/components/ui/form-components';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function LoginPage() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const loginMutation = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-900">
      <ThemeToggle />
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-blue-700 to-indigo-800 dark:from-slate-800 dark:via-slate-900 dark:to-black"></div>
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white max-w-lg">
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                <span className="text-2xl">🐾</span>
              </div>
              <h1 className="text-3xl font-bold">PurrPass</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Veteriner Hekimliğin
              <br />
              <span className="text-emerald-300">Dijital Geleceği</span>
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Modern teknoloji ile veteriner hekimliği pratiğinizi 
              bir sonraki seviyeye taşıyın.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-emerald-400/30 rounded-lg flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Hasta Takip Sistemi</h3>
                <p className="text-blue-100/80 text-sm">Hasta kayıtlarını dijital ortamda güvenle saklayın ve yönetin</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-emerald-400/30 rounded-lg flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Akıllı Randevu Sistemi</h3>
                <p className="text-blue-100/80 text-sm">Randevuları otomatik yönetin ve hasta trafiğini optimize edin</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-emerald-400/30 rounded-lg flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Finansal Analiz</h3>
                <p className="text-blue-100/80 text-sm">Gelir-gider takibi ve detaylı mali raporlama</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-blue-700 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center mr-3">
              <span className="text-2xl">🐾</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PurrPass</h1>
          </div>
        </div>

        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white dark:bg-slate-800 dark:border-slate-700 rounded-2xl">
            <CardHeader className="space-y-1 pb-8 pt-8 px-8">
              <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
                Hoş Geldiniz
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-300 text-base">
                Hesabınıza giriş yaparak devam edin
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormInput
                      name="email"
                      label="E-posta Adresi"
                      type="email"
                      placeholder="ornek@veteriner.com"
                    />

                    <FormPassword
                      name="password"
                      label="Şifre"
                      placeholder="Şifrenizi girin"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-emerald-600 bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Beni hatırla</span>
                    </label>
                    <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-medium transition-colors">
                      Şifremi unuttum
                    </a>
                  </div>

                  {loginMutation.isError && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                      <AlertDescription className="text-red-800">
                        E-posta veya şifre hatalı. Lütfen tekrar deneyin.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loginMutation.isPending}
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-700 hover:from-emerald-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loginMutation.isPending ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Giriş yapılıyor...
                      </div>
                    ) : (
                      'Giriş Yap'
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
                    Henüz hesabınız yok mu?{' '}
                    <Link 
                      href="/auth/register" 
                      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-semibold transition-colors"
                    >
                      Hemen kayıt olun
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
