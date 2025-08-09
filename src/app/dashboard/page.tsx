'use client';

import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building, Mail, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PurrPass Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Hoş geldiniz, {user?.role === 'VET' ? 'Dr.' : ''}</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-white">
                <User className="w-5 h-5 text-blue-600" />
                <span>Kullanıcı Bilgileri</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm dark:text-gray-300">{user?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-sm dark:text-gray-300">{user?.role === 'VET' ? 'Veteriner Hekim' : 'Pet Sahibi'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm dark:text-gray-300">
                  Durum: {user?.isVerified ? '✓ Doğrulanmış' : '⚠️ Beklemede'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Role Specific Cards */}
          {user?.role === 'VET' && (
            <>
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Onboarding Durumu</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {user.onboardingStep === 'COMPLETED' ? 
                      '✅ Tüm adımlar tamamlandı' : 
                      `📋 Aktif adım: ${user.onboardingStep}`
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Veteriner İşlemleri</CardTitle>
                  <CardDescription className="dark:text-gray-400">Klinik yönetimi ve hasta takibi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>• Hasta kayıtları</p>
                    <p>• Randevu yönetimi</p>
                    <p>• Tedavi geçmişi</p>
                    <p>• Rapor oluşturma</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {user?.role === 'USER' && (
            <>
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Pet Bilgileri</CardTitle>
                  <CardDescription className="dark:text-gray-400">Evcil hayvan bilgileri ve sağlık kayıtları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>• Pet profilleri</p>
                    <p>• Sağlık kayıtları</p>
                    <p>• Aşı takvimu</p>
                    <p>• Veteriner randevuları</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Yakındaki Veterinerler</CardTitle>
                  <CardDescription className="dark:text-gray-400">Bölgenizdeki veteriner klinikler</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>• Klinik arama</p>
                    <p>• Randevu al</p>
                    <p>• Değerlendirmeler</p>
                    <p>• Konum bilgileri</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Development Info */}
        <Card className="mt-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Geliştirme Bilgileri</CardTitle>
            <CardDescription className="dark:text-gray-400">Bu bir demo sürümdür</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Kullanıcı ID:</strong> {user?.id}</p>
              <p><strong>Rol:</strong> {user?.role}</p>
              {user?.onboardingStep && (
                <p><strong>Onboarding Adımı:</strong> {user.onboardingStep}</p>
              )}
              <p><strong>E-posta Doğrulama:</strong> {user?.isVerified ? 'Tamamlandı' : 'Beklemede'}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
