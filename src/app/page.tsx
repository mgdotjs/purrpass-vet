'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">🐾</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            PurrPass
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Veteriner hekimler için özel tasarlanmış dijital platform. 
            Hasta kayıtlarından randevu yönetimine kadar tüm ihtiyaçlarınız için tek çözüm.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-3">👨‍⚕️</span>
                Veteriner Hekim
              </CardTitle>
              <CardDescription>
                Kliniğinizi dijitalleştirin ve iş süreçlerinizi optimize edin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-gray-600">
                <li>✓ Hasta kayıt ve takip sistemi</li>
                <li>✓ Randevu yönetimi</li>
                <li>✓ Finansal raporlama</li>
                <li>✓ Stok yönetimi</li>
              </ul>
              <div className="pt-4 space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth/register">Veteriner Olarak Kayıt Ol</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/login">Giriş Yap</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-3">🏠</span>
                Pet Sahibi
              </CardTitle>
              <CardDescription>
                Evcil dostunuzun sağlığını takip edin ve veterinerinizle iletişimde kalın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-gray-600">
                <li>✓ Online randevu alma</li>
                <li>✓ Sağlık geçmişi takibi</li>
                <li>✓ Aşı hatırlatmaları</li>
                <li>✓ Veteriner iletişimi</li>
              </ul>
              <div className="pt-4 space-y-2">
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/auth/register">Pet Sahibi Olarak Kayıt Ol</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/login">Giriş Yap</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            © 2024 PurrPass. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
}
