'use client';

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  useVetProfile, 
  usePersonalInfo, 
  useCompanyInfo, 
  useClinicInfo,
  useUserProfile,
  useUserPersonalInfo
} from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormInput, FormSelect } from '@/components/ui/form-components';
import { PhoneInputField } from '@/components/ui/phone-input';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Stethoscope,
  Calendar,
  IdCard,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { personalInfoSchema, companyInfoSchema, clinicInfoSchema } from '@/utils/validation';
import type { PersonalInfoFormData, CompanyInfoFormData, ClinicInfoFormData } from '@/utils/validation';
import { CITIES } from '@/constants/cities';
import { DISTRICTS } from '@/constants/districts';

type EditMode = 'none' | 'personal' | 'company' | 'clinic';

export default function ProfilePage() {
  const { user } = useAuthStore();
  
  const isVet = user?.role === 'VET';
  const isUser = user?.role === 'USER';
  
  const { data: vetProfile } = useVetProfile();
  const { data: personalInfo } = usePersonalInfo();
  const { data: companyInfo } = useCompanyInfo();
  const { data: clinicInfo } = useClinicInfo();
  
  const { data: userProfile } = useUserProfile();
  const { data: userPersonalInfo } = useUserPersonalInfo();
  
  const [editMode, setEditMode] = useState<EditMode>('none');

  // Form instances
  const personalForm = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
  });

  const companyForm = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema),
  });

  const clinicForm = useForm<ClinicInfoFormData>({
    resolver: zodResolver(clinicInfoSchema),
  });

  // Load data into forms
  useEffect(() => {
    if (personalInfo?.data) {
      const info = personalInfo.data;
      personalForm.reset({
        firstName: info.firstName || '',
        lastName: info.lastName || '',
        birthDate: info.birthDate ? info.birthDate.split('T')[0] : '',
        gender: info.gender || 'MALE',
        tcIdentityNo: info.tcIdentityNo || '',
        phone: info.phone || { countryCode: 90, number: '' },
      });
    }
  }, [personalInfo, personalForm]);

  useEffect(() => {
    if (companyInfo?.data) {
      const info = companyInfo.data;
      companyForm.reset({
        companyName: info.companyName || '',
        companyType: info.companyType || 'INDIVIDUAL',
        taxOffice: info.taxOffice || '',
        taxNumber: info.taxNumber || '',
        cityId: info.cityId?.toString() || '',
        districtId: info.districtId?.toString() || '',
        address: info.address || '',
      });
    }
  }, [companyInfo, companyForm]);

  useEffect(() => {
    if (clinicInfo?.data) {
      const info = clinicInfo.data;
      clinicForm.reset({
        clinicName: info.clinicName || '',
        clinicEmail: info.clinicEmail || '',
        clinicPhone: info.clinicPhone || { countryCode: 90, number: '' },
        cityId: info.cityId?.toString() || '',
        districtId: info.districtId?.toString() || '',
        address: info.address || '',
      });
    }
  }, [clinicInfo, clinicForm]);

  const handleEditCancel = () => {
    setEditMode('none');
    // Reset forms to original values
    if (editMode === 'personal' && personalInfo?.data) {
      const info = personalInfo.data;
      personalForm.reset({
        firstName: info.firstName || '',
        lastName: info.lastName || '',
        birthDate: info.birthDate ? info.birthDate.split('T')[0] : '',
        gender: info.gender || 'MALE',
        tcIdentityNo: info.tcIdentityNo || '',
        phone: info.phone || { countryCode: 90, number: '' },
      });
    }
  };

  const onPersonalSubmit = async (data: PersonalInfoFormData) => {
    try {
      // Here you would call the update API
      console.log('Personal info update:', data);
      setEditMode('none');
    } catch (error) {
      console.error('Update personal info error:', error);
    }
  };

  const onCompanySubmit = async (data: CompanyInfoFormData) => {
    try {
      // Here you would call the update API
      console.log('Company info update:', data);
      setEditMode('none');
    } catch (error) {
      console.error('Update company info error:', error);
    }
  };

  const onClinicSubmit = async (data: ClinicInfoFormData) => {
    try {
      // Here you would call the update API
      console.log('Clinic info update:', data);
      setEditMode('none');
    } catch (error) {
      console.error('Update clinic info error:', error);
    }
  };

  const genderOptions = [
    { value: 'MALE', label: 'Erkek' },
    { value: 'FEMALE', label: 'Kadın' },
  ];

  const companyTypeOptions = [
    { value: 'INDIVIDUAL', label: 'Şahıs Şirketi' },
    { value: 'CORPORATE', label: 'Kurumsal' },
  ];

  return (
    <DashboardLayout 
      title="Profil" 
      description="Kişisel ve mesleki bilgilerinizi görüntüleyin ve güncelleyin"
    >
      <div className="space-y-6">
        {/* User Overview Card */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="dark:text-white">
                    {isVet && personalInfo?.data ? 
                      `${personalInfo.data.firstName} ${personalInfo.data.lastName}` : 
                      isUser && userPersonalInfo?.data ?
                      `${userPersonalInfo.data.firstName} ${userPersonalInfo.data.lastName}` :
                      user?.email?.split('@')[0]
                    }
                  </CardTitle>
                  <CardDescription>
                    {user?.role === 'VET' ? 'Veteriner Hekim' : 'Pet Sahibi'}
                  </CardDescription>
                  <div className="flex items-center space-x-2 mt-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Badge variant={user?.isVerified ? "default" : "secondary"}>
                  {user?.isVerified ? '✓ Doğrulanmış' : '⚠️ Beklemede'}
                </Badge>
                {user?.role === 'VET' && (
                  <Badge variant={user?.onboardingStep === 'COMPLETED' ? "default" : "secondary"}>
                    {user?.onboardingStep === 'COMPLETED' ? '✅ Kayıt Tamamlandı' : '📋 Kayıt Devam Ediyor'}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Personal Information Card */}
        {user?.role === 'VET' && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-6 h-6 text-blue-600" />
                  <span>Kişisel Bilgiler</span>
                </CardTitle>
                {editMode !== 'personal' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditMode('personal')}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editMode === 'personal' ? (
                <FormProvider {...personalForm}>
                  <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-4">
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
                      />
                      <PhoneInputField
                        name="phone"
                        label="Telefon Numarası *"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        Kaydet
                      </Button>
                      <Button type="button" variant="outline" onClick={handleEditCancel}>
                        <X className="w-4 h-4 mr-2" />
                        İptal
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Ad Soyad</label>
                      <p className="text-gray-900 dark:text-white">
                        {personalInfo?.data ? 
                          `${personalInfo.data.firstName} ${personalInfo.data.lastName}` : 
                          'Henüz girilmemiş'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Cinsiyet</label>
                      <p className="text-gray-900 dark:text-white">
                        {personalInfo?.data?.gender === 'MALE' ? 'Erkek' : 
                         personalInfo?.data?.gender === 'FEMALE' ? 'Kadın' : 
                         'Henüz girilmemiş'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">TC Kimlik No</label>
                      <p className="text-gray-900 dark:text-white">
                        {personalInfo?.data?.tcIdentityNo || 'Henüz girilmemiş'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Doğum Tarihi</label>
                      <p className="text-gray-900 dark:text-white">
                        {personalInfo?.data?.birthDate ? 
                          new Date(personalInfo.data.birthDate).toLocaleDateString('tr-TR') : 
                          'Henüz girilmemiş'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Telefon</label>
                      <p className="text-gray-900 dark:text-white flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {personalInfo?.data?.phone ? 
                          `+${personalInfo.data.phone.countryCode} ${personalInfo.data.phone.number}` : 
                          'Henüz girilmemiş'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Company Information Card */}
        {user?.role === 'VET' && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  <span>Şirket Bilgileri</span>
                </CardTitle>
                {editMode !== 'company' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditMode('company')}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editMode === 'company' ? (
                <FormProvider {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        name="companyName"
                        label="Şirket Adı *"
                        placeholder="Şirket adınız"
                      />
                      <FormSelect
                        name="companyType"
                        label="Şirket Türü *"
                        placeholder="Şirket türü seçin"
                        options={companyTypeOptions}
                      />
                      <FormInput
                        name="taxOffice"
                        label="Vergi Dairesi *"
                        placeholder="Vergi daireniz"
                      />
                      <FormInput
                        name="taxNumber"
                        label="Vergi Numarası *"
                        placeholder="10 haneli vergi numaranız"
                        maxLength={10}
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
                          .filter(district => district.provinceId.toString() === companyForm.watch('cityId'))
                          .map(district => ({
                            value: district.id.toString(),
                            label: district.name
                          }))
                        }
                      />
                    </div>
                    <FormInput
                      name="address"
                      label="Adres *"
                      placeholder="Şirket adresiniz"
                    />
                    <div className="flex space-x-3">
                      <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        Kaydet
                      </Button>
                      <Button type="button" variant="outline" onClick={handleEditCancel}>
                        <X className="w-4 h-4 mr-2" />
                        İptal
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Şirket Adı</label>
                      <p className="text-gray-900 dark:text-white">
                        {companyInfo?.data?.companyName || 'Henüz girilmemiş'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Şirket Türü</label>
                      <p className="text-gray-900 dark:text-white">
                        {companyInfo?.data?.companyType === 'INDIVIDUAL' ? 'Şahıs Şirketi' :
                         companyInfo?.data?.companyType === 'CORPORATE' ? 'Kurumsal' :
                         'Henüz girilmemiş'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Vergi Bilgileri</label>
                      <p className="text-gray-900 dark:text-white">
                        {companyInfo?.data?.taxOffice && companyInfo?.data?.taxNumber ?
                          `${companyInfo.data.taxOffice} - ${companyInfo.data.taxNumber}` :
                          'Henüz girilmemiş'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Konum</label>
                      <p className="text-gray-900 dark:text-white flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                        <span>
                          {companyInfo?.data ? (
                            <>
                              {CITIES.find(c => c.id === companyInfo.data.cityId)?.name || 'Bilinmeyen İl'} / {' '}
                              {DISTRICTS.find(d => d.id === companyInfo.data.districtId)?.name || 'Bilinmeyen İlçe'}
                              <br />
                              <span className="text-sm text-gray-500">
                                {companyInfo.data.address}
                              </span>
                            </>
                          ) : (
                            'Henüz girilmemiş'
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Clinic Information Card */}
        {user?.role === 'VET' && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                  <span>Klinik Bilgileri</span>
                </CardTitle>
                {editMode !== 'clinic' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditMode('clinic')}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editMode === 'clinic' ? (
                <FormProvider {...clinicForm}>
                  <form onSubmit={clinicForm.handleSubmit(onClinicSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        name="clinicName"
                        label="Klinik Adı *"
                        placeholder="Klinik adınız"
                      />
                      <FormInput
                        name="clinicEmail"
                        label="Klinik E-postası *"
                        type="email"
                        placeholder="klinik@example.com"
                      />
                      <PhoneInputField
                        name="clinicPhone"
                        label="Klinik Telefonu *"
                      />
                      <div></div>
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
                          .filter(district => district.provinceId.toString() === clinicForm.watch('cityId'))
                          .map(district => ({
                            value: district.id.toString(),
                            label: district.name
                          }))
                        }
                      />
                    </div>
                    <FormInput
                      name="address"
                      label="Klinik Adresi *"
                      placeholder="Klinik adresiniz"
                    />
                    <div className="flex space-x-3">
                      <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        Kaydet
                      </Button>
                      <Button type="button" variant="outline" onClick={handleEditCancel}>
                        <X className="w-4 h-4 mr-2" />
                        İptal
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Klinik Adı</label>
                      <p className="text-gray-900 dark:text-white">
                        {clinicInfo?.data?.clinicName || 'Henüz girilmemiş'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Klinik E-postası</label>
                      <p className="text-gray-900 dark:text-white flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {clinicInfo?.data?.clinicEmail || 'Henüz girilmemiş'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Klinik Telefonu</label>
                      <p className="text-gray-900 dark:text-white flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {clinicInfo?.data?.clinicPhone ? 
                          `+${clinicInfo.data.clinicPhone.countryCode} ${clinicInfo.data.clinicPhone.number}` : 
                          'Henüz girilmemiş'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Klinik Konumu</label>
                      <p className="text-gray-900 dark:text-white flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                        <span>
                          {clinicInfo?.data ? (
                            <>
                              {CITIES.find(c => c.id === clinicInfo.data.cityId)?.name || 'Bilinmeyen İl'} / {' '}
                              {DISTRICTS.find(d => d.id === clinicInfo.data.districtId)?.name || 'Bilinmeyen İlçe'}
                              <br />
                              <span className="text-sm text-gray-500">
                                {clinicInfo.data.address}
                              </span>
                            </>
                          ) : (
                            'Henüz girilmemiş'
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Account Settings Card */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <IdCard className="w-6 h-6 text-blue-600" />
              <span>Hesap Bilgileri</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Kullanıcı Kodu</label>
                  <p className="text-gray-900 dark:text-white">
                    {user?.userCode || 'Henüz atanmamış'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Rol</label>
                  <p className="text-gray-900 dark:text-white">
                    {user?.role === 'VET' ? 'Veteriner Hekim' : 'Pet Sahibi'}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Kayıt Tarihi</label>
                  <p className="text-gray-900 dark:text-white flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {vetProfile?.data?.createdAt ? 
                      new Date(vetProfile.data.createdAt).toLocaleDateString('tr-TR') : 
                      userProfile?.data?.createdAt ?
                      new Date(userProfile.data.createdAt).toLocaleDateString('tr-TR') :
                      'Bilgi yok'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Son Güncelleme</label>
                  <p className="text-gray-900 dark:text-white flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {vetProfile?.data?.updatedAt ? 
                      new Date(vetProfile.data.updatedAt).toLocaleDateString('tr-TR') : 
                      userProfile?.data?.updatedAt ?
                      new Date(userProfile.data.updatedAt).toLocaleDateString('tr-TR') :
                      'Bilgi yok'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
