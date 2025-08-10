'use client';

import { useAuthStore } from '@/stores/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building, Mail, Calendar, Activity, TrendingUp, Clock } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Mock data - bu veriler API'den gelecek
  const stats = {
    todayAppointments: 8,
    weeklyAppointments: 45,
    totalPatients: 156,
    pendingAppointments: 12
  };

  return (
    <DashboardLayout 
      title="Dashboard" 
      description={`Hoş geldiniz, ${user?.role === 'VET' ? 'Dr.' : ''} ${user?.email?.split('@')[0]}`}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Bugünkü Randevular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.todayAppointments}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    aktif randevu
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Haftalık Randevular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.weeklyAppointments}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    bu hafta
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {user?.role === 'VET' && (
            <>
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Toplam Hasta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalPatients}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        kayıtlı hasta
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Bekleyen Randevular
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.pendingAppointments}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        onay bekliyor
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* User Info and Quick Actions */}
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
                <span className="text-sm dark:text-gray-300">
                  {user?.role === 'VET' ? 'Veteriner Hekim' : 'Pet Sahibi'}
                </span>
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
                      `📋 Aktif adım: ${user.onboardingStep}`}
                  </p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Klinik Bilgileri</CardTitle>
                  <CardDescription>
                    Klinik profil bilgilerinizi yönetin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Klinik ayarlarınızı güncellemek için profil bölümünü ziyaret edin.
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {user?.role === 'USER' && (
            <Card className="dark:bg-gray-800 dark:border-gray-700 md:col-span-2">
              <CardHeader>
                <CardTitle className="dark:text-white">Hayvanlarınız</CardTitle>
                <CardDescription>
                  Kayıtlı hayvanlarınızın sağlık durumu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Hayvanlarınızı eklemek ve randevu oluşturmak için menüden ilgili bölümleri kullanabilirsiniz.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
