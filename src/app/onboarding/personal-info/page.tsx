'use client';

import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { 
  useSavePersonalInfo, 
  usePersonalInfo,
  useSaveUserPersonalInfo,
  useUserPersonalInfo
} from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { FormInput, FormSelect } from '@/components/ui/form-components';
import { PhoneInputField } from '@/components/ui/phone-input';
import { User, Calendar, IdCard } from 'lucide-react';
import { 
  personalInfoSchema, 
  userPersonalInfoSchema,
  type PersonalInfoFormData,
  type UserPersonalInfoFormData 
} from '@/utils/validation';
import { CITIES } from '@/constants/cities';
import { DISTRICTS } from '@/constants/districts';

export default function PersonalInfoPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const isVet = user?.role === 'VET';
  const isUser = user?.role === 'USER';

  // VET form and hooks
  const vetForm = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: 'MALE',
      tcIdentityNo: '',
      phone: {
        countryCode: 90,
        number: '',
      },
    },
  });

  const saveVetPersonalInfoMutation = useSavePersonalInfo();
  const { data: vetPersonalInfo } = usePersonalInfo();

  // USER form and hooks  
  const userForm = useForm<UserPersonalInfoFormData>({
    resolver: zodResolver(userPersonalInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: 'MALE',
      tcIdentityNo: '',
      phone: {
        countryCode: 90,
        number: '',
      },
      cityId: '',
      districtId: '',
    },
  });

  const saveUserPersonalInfoMutation = useSaveUserPersonalInfo();
  const { data: userPersonalInfo } = useUserPersonalInfo();

  // Load existing VET data
  useEffect(() => {
    if (isVet && vetPersonalInfo?.data) {
      const info = vetPersonalInfo.data;
      vetForm.reset({
        firstName: info.firstName || '',
        lastName: info.lastName || '',
        birthDate: info.birthDate ? info.birthDate.split('T')[0] : '',
        gender: info.gender || 'MALE',
        tcIdentityNo: info.tcIdentityNo || '',
        phone: info.phone || { countryCode: 90, number: '' },
      });
    }
  }, [isVet, vetPersonalInfo, vetForm]);

  // Load existing USER data
  useEffect(() => {
    if (isUser && userPersonalInfo?.data) {
      const info = userPersonalInfo.data;
      userForm.reset({
        firstName: info.firstName || '',
        lastName: info.lastName || '',
        birthDate: info.birthDate ? info.birthDate.split('T')[0] : '',
        gender: info.gender || 'MALE',
        tcIdentityNo: info.tcIdentityNo || '',
        phone: info.phone || { countryCode: 90, number: '' },
        cityId: info.cityId?.toString() || '',
        districtId: info.districtId?.toString() || '',
      });
    }
  }, [isUser, userPersonalInfo, userForm]);

  // VET submit handler
  const onVetSubmit = async (data: PersonalInfoFormData) => {
    try {
      await saveVetPersonalInfoMutation.mutateAsync(data);
      router.push('/onboarding/company-info');
    } catch (error) {
      console.error('Save VET personal info error:', error);
    }
  };

  // USER submit handler
  const onUserSubmit = async (data: UserPersonalInfoFormData) => {
    try {
      // Convert string IDs back to numbers for API
      const submitData = {
        ...data,
        cityId: parseInt(data.cityId),
        districtId: parseInt(data.districtId),
      };
      await saveUserPersonalInfoMutation.mutateAsync(submitData);
    } catch (error) {
      console.error('Save USER personal info error:', error);
    }
  };

  const genderOptions = [
    { value: 'MALE', label: 'Erkek' },
    { value: 'FEMALE', label: 'Kadın' },
  ];
  
  const selectedCityId = isUser ? userForm.watch('cityId') : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar - only for VET */}
        {isVet && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Veteriner Kayıt</h1>
              <span className="text-sm text-gray-600 dark:text-gray-400">Adım 1 / 3</span>
            </div>
            <Progress value={33} className="h-2" />
          </div>
        )}

        {/* Title for USER */}
        {isUser && (
          <div className="max-w-2xl mx-auto mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              Hesap Bilgilerinizi Tamamlayın
            </h1>
          </div>
        )}

        <Card className="max-w-2xl mx-auto dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-6 h-6 text-blue-600" />
              <span>Kişisel Bilgiler</span>
            </CardTitle>
            <CardDescription>
              {isVet 
                ? 'Veteriner hekim olarak kayıt olmak için kişisel bilgilerinizi girin'
                : 'PurrPass hesabınızı tamamlamak için kişisel bilgilerinizi girin'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isVet ? (
              <FormProvider {...vetForm}>
                <form onSubmit={vetForm.handleSubmit(onVetSubmit)} className="space-y-6">
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

                    <FormInput
                      name="birthDate"
                      label="Doğum Tarihi *"
                      type="date"
                      icon={<Calendar className="w-4 h-4" />}
                    />

                    <FormSelect
                      name="gender"
                      label="Cinsiyet *"
                      placeholder="Cinsiyet seçin"
                      options={genderOptions}
                    />

                    <FormInput
                      name="tcIdentityNo"
                      label="TC Kimlik No *"
                      placeholder="11 haneli TC kimlik numaranız"
                      maxLength={11}
                      icon={<IdCard className="w-4 h-4" />}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        vetForm.setValue('tcIdentityNo', value, { shouldValidate: true });
                      }}
                    />

                    <PhoneInputField
                      name="phone"
                      label="Telefon Numarası *"
                    />
                  </div>

                  {/* Error Display */}
                  {saveVetPersonalInfoMutation.isError && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Bilgiler kaydedilemedi. Lütfen tekrar deneyin.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full md:w-auto"
                      disabled={saveVetPersonalInfoMutation.isPending}
                    >
                      {saveVetPersonalInfoMutation.isPending ? 'Kaydediliyor...' : 'Devam Et'}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            ) : (
              <FormProvider {...userForm}>
                <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-6">
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

                    <FormInput
                      name="birthDate"
                      label="Doğum Tarihi *"
                      type="date"
                      icon={<Calendar className="w-4 h-4" />}
                    />

                    <FormSelect
                      name="gender"
                      label="Cinsiyet *"
                      placeholder="Cinsiyet seçin"
                      options={genderOptions}
                    />

                    <FormInput
                      name="tcIdentityNo"
                      label="TC Kimlik No *"
                      placeholder="11 haneli TC kimlik numaranız"
                      maxLength={11}
                      icon={<IdCard className="w-4 h-4" />}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        userForm.setValue('tcIdentityNo', value, { shouldValidate: true });
                      }}
                    />

                    <PhoneInputField
                      name="phone"
                      label="Telefon Numarası *"
                    />

                    <FormSelect
                      name="cityId"
                      label="İl *"
                      placeholder="İl seçin"
                      options={CITIES.map(city => ({
                        value: city.id.toString(),
                        label: city.name
                      }))}
                    />
                    
                    <FormSelect
                      name="districtId"
                      label="İlçe *"
                      placeholder="İlçe seçin"
                      options={DISTRICTS
                        .filter(district => district.provinceId.toString() === selectedCityId)
                        .map(district => ({
                          value: district.id.toString(),
                          label: district.name
                        }))
                      }
                    />
                  </div>

                  {/* Error Display */}
                  {saveUserPersonalInfoMutation.isError && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Bilgiler kaydedilemedi. Lütfen tekrar deneyin.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full md:w-auto"
                      disabled={saveUserPersonalInfoMutation.isPending}
                    >
                      {saveUserPersonalInfoMutation.isPending ? 'Kaydediliyor...' : 'Hesabı Tamamla'}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
