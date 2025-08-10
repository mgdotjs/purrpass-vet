'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSaveClinicInfo, useClinicInfo } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { FormInput, FormSearchableSelect } from '@/components/ui/form-components';
import { clinicInfoSchema, type ClinicInfoFormData } from '@/utils/validation';
import { CITIES } from '@/constants/cities';
import { DISTRICTS } from '@/constants/districts';
import { Building } from 'lucide-react';

export default function ClinicInfoPage() {
  const router = useRouter();
  const saveClinicInfoMutation = useSaveClinicInfo();
  const { data: clinicInfo } = useClinicInfo();

  const methods = useForm<ClinicInfoFormData>({
    resolver: zodResolver(clinicInfoSchema),
    defaultValues: {
      clinicName: '',
      clinicEmail: '',
      clinicPhone: '',
      cityId: '',
      districtId: '',
      address: '',
    },
  });

  // Watch city selection to update districts
  const selectedCityId = methods.watch('cityId');

  // Load existing data if available
  useEffect(() => {
    if (clinicInfo?.data) {
      const info = clinicInfo.data;
      methods.reset({
        clinicName: info.clinicName || '',
        clinicEmail: info.clinicEmail || '',
        clinicPhone: info.clinicPhone || '',
        cityId: info.cityId?.toString() || '',
        districtId: info.districtId?.toString() || '',
        address: info.address || '',
      });
    }
  }, [clinicInfo, methods]);

  // Reset district when city changes
  useEffect(() => {
    if (selectedCityId) {
      methods.setValue('districtId', '');
    }
  }, [selectedCityId, methods]);

  const onSubmit = async (data: ClinicInfoFormData) => {
    try {
      // Convert string IDs back to numbers for API
      const submitData = {
        ...data,
        cityId: parseInt(data.cityId),
        districtId: parseInt(data.districtId),
      };
      await saveClinicInfoMutation.mutateAsync(submitData);
      router.push('/onboarding/success');
    } catch (error) {
      console.error('Save clinic info error:', error);
    }
  };

  // Convert cities to options format
  const cityOptions = React.useMemo(() => 
    CITIES.map(city => ({
      value: city.id.toString(),
      label: city.name
    })), []);

  // Convert districts to options format based on selected city
  const districtOptions = React.useMemo(() => {
    if (!selectedCityId) return [];
    
    return DISTRICTS
      .filter(district => district.provinceId === parseInt(selectedCityId))
      .map(district => ({
        value: district.id.toString(),
        label: district.name
      }));
  }, [selectedCityId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Veteriner Kayıt</h1>
            <span className="text-sm text-gray-600">Adım 3 / 3</span>
          </div>
          <Progress value={100} className="h-2" />
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-6 h-6 text-blue-600" />
              <span>Klinik Bilgileri</span>
            </CardTitle>
            <CardDescription>
              Veteriner kliniğiniz için iletişim ve adres bilgilerini girin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <FormInput
                  name="clinicName"
                  label="Klinik Adı"
                  placeholder="Pati Veteriner Kliniği"
                />

                <FormInput
                  name="clinicEmail"
                  label="Klinik E-posta"
                  type="email"
                  placeholder="info@patiklinik.com"
                />

                <FormInput
                  name="clinicPhone"
                  label="Klinik Telefonu"
                  type="tel"
                  placeholder="(212) 123 45 67"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormSearchableSelect
                    name="cityId"
                    label="İl"
                    placeholder="İl seçin..."
                    searchPlaceholder="İl ara..."
                    options={cityOptions}
                    emptyMessage="İl bulunamadı."
                  />

                  <FormSearchableSelect
                    name="districtId"
                    label="İlçe"
                    placeholder="İlçe seçin..."
                    searchPlaceholder="İlçe ara..."
                    options={districtOptions}
                    emptyMessage="İlçe bulunamadı."
                  />
                </div>

                <FormInput
                  name="address"
                  label="Klinik Adresi"
                  placeholder="Test Mahallesi, Test Sokak No:1 Kadıköy/İstanbul"
                />

                {saveClinicInfoMutation.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Klinik bilgileri kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/onboarding/company-info')}
                  >
                    Geri
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={saveClinicInfoMutation.isPending}
                    className="px-8"
                  >
                    {saveClinicInfoMutation.isPending ? 'Kaydediliyor...' : 'Kayıt Tamamla'}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
