'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSaveCompanyInfo, useCompanyInfo } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { FormInput, FormSelect, FormSearchableSelect } from '@/components/ui/form-components';
import { companyInfoSchema, type CompanyInfoFormData } from '@/utils/validation';
import { CITIES } from '@/constants/cities';
import { DISTRICTS } from '@/constants/districts';
import { Building2 } from 'lucide-react';

export default function CompanyInfoPage() {
  const router = useRouter();
  const saveCompanyInfoMutation = useSaveCompanyInfo();
  const { data: companyInfo } = useCompanyInfo();

  const methods = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      companyName: '',
      companyType: 'INDIVIDUAL',
      taxOffice: '',
      taxNumber: '',
      cityId: '',
      districtId: '',
      address: '',
    },
  });

  // Watch city selection to update districts
  const selectedCityId = methods.watch('cityId');

  // Load existing data if available
  useEffect(() => {
    if (companyInfo?.data) {
      const info = companyInfo.data;
      methods.reset({
        companyName: info.companyName || '',
        companyType: info.companyType || 'INDIVIDUAL',
        taxOffice: info.taxOffice || '',
        taxNumber: info.taxNumber || '',
        cityId: info.cityId?.toString() || '',
        districtId: info.districtId?.toString() || '',
        address: info.address || '',
      });
    }
  }, [companyInfo, methods]);

  // Reset district when city changes
  useEffect(() => {
    if (selectedCityId) {
      methods.setValue('districtId', '');
    }
  }, [selectedCityId, methods]);

  const onSubmit = async (data: CompanyInfoFormData) => {
    try {
      // Convert string IDs back to numbers for API
      const submitData = {
        ...data,
        cityId: parseInt(data.cityId),
        districtId: parseInt(data.districtId),
      };
      await saveCompanyInfoMutation.mutateAsync(submitData);
      router.push('/onboarding/clinic-info');
    } catch (error) {
      console.error('Save company info error:', error);
    }
  };

  const companyTypeOptions = [
    { value: 'INDIVIDUAL', label: 'Şahıs Şirketi' },
    { value: 'CORPORATE', label: 'Limited/Anonim Şirket' },
  ];

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
            <span className="text-sm text-gray-600">Adım 2 / 3</span>
          </div>
          <Progress value={66} className="h-2" />
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              <span>Şirket Bilgileri</span>
            </CardTitle>
            <CardDescription>
              Veteriner hekimlik faaliyetleriniz için şirket bilgilerinizi girin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <FormInput
                  name="companyName"
                  label="Şirket Adı"
                  placeholder="Örnek Veteriner Kliniği"
                />

                <FormSelect
                  name="companyType"
                  label="Şirket Türü"
                  placeholder="Şirket türü seçin"
                  options={companyTypeOptions}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="taxOffice"
                    label="Vergi Dairesi"
                    placeholder="Kadıköy"
                  />

                  <FormInput
                    name="taxNumber"
                    label="Vergi Numarası"
                    placeholder="1234567890"
                  />
                </div>

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
                  label="Adres"
                  placeholder="Test Mahallesi, Test Sokak No:1 Kadıköy/İstanbul"
                />

                {saveCompanyInfoMutation.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Şirket bilgileri kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/onboarding/personal-info')}
                  >
                    Geri
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={saveCompanyInfoMutation.isPending}
                    className="px-8"
                  >
                    {saveCompanyInfoMutation.isPending ? 'Kaydediliyor...' : 'Devam Et'}
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
