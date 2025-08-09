'use client';

import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useSavePersonalInfo, usePersonalInfo } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { FormInput, FormSelect } from '@/components/ui/form-components';
import { User, Calendar, Phone, IdCard } from 'lucide-react';
import { personalInfoSchema, type PersonalInfoFormData } from '@/utils/validation';

export default function PersonalInfoPage() {
  const router = useRouter();
  
  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: 'MALE',
      tcIdentityNo: '',
      phoneNumber: '',
    },
  });

  const savePersonalInfoMutation = useSavePersonalInfo();
  const { data: personalInfo } = usePersonalInfo();

  // Load existing data if available
  useEffect(() => {
    if (personalInfo?.data) {
      const info = personalInfo.data;
      form.reset({
        firstName: info.firstName || '',
        lastName: info.lastName || '',
        birthDate: info.birthDate ? info.birthDate.split('T')[0] : '',
        gender: info.gender || 'MALE',
        tcIdentityNo: info.tcIdentityNo || '',
        phoneNumber: info.phoneNumber || '',
      });
    }
  }, [personalInfo, form]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    try {
      await savePersonalInfoMutation.mutateAsync(data);
      router.push('/onboarding/company-info');
    } catch (error) {
      console.error('Save personal info error:', error);
    }
  };

  const genderOptions = [
    { value: 'MALE', label: 'Erkek' },
    { value: 'FEMALE', label: 'Kadın' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Veteriner Kayıt</h1>
            <span className="text-sm text-gray-600">Adım 1 / 3</span>
          </div>
          <Progress value={33} className="h-2" />
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-6 h-6 text-blue-600" />
              <span>Kişisel Bilgiler</span>
            </CardTitle>
            <CardDescription>
              Veteriner hekim olarak kayıt olmak için kişisel bilgilerinizi girin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="firstName"
                    label="Ad *"
                    placeholder="Adınız"
                  />
                  
                  <FormInput
                    name="lastName"
                    label="Soyad *"
                    placeholder="Soyadınız"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="birthDate"
                    label="Doğum Tarihi *"
                    type="date"
                    icon={<Calendar />}
                  />

                  <FormSelect
                    name="gender"
                    label="Cinsiyet *"
                    placeholder="Cinsiyet seçin"
                    options={genderOptions}
                  />
                </div>

                <FormInput
                  name="tcIdentityNo"
                  label="TC Kimlik No *"
                  placeholder="12345678901"
                  icon={<IdCard />}
                  maxLength={11}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                    form.setValue('tcIdentityNo', value, { shouldValidate: true });
                  }}
                />

                <FormInput
                  name="phoneNumber"
                  label="Telefon Numarası *"
                  type="tel"
                  placeholder="+905551234567"
                  icon={<Phone />}
                />

                {savePersonalInfoMutation.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Bilgiler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/auth/login')}
                  >
                    Geri
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={savePersonalInfoMutation.isPending}
                    className="px-8"
                  >
                    {savePersonalInfoMutation.isPending ? 'Kaydediliyor...' : 'Devam Et'}
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
