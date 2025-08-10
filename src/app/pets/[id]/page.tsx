'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { usePet, useAddMicrochip } from '@/hooks/usePets';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormInput } from '@/components/ui/form-components';
import { microchipSchema, type MicrochipFormData } from '@/utils/validation';
import { 
  ArrowLeft, 
  Edit, 
  Heart,
  Activity,
  AlertCircle,
  Plus,
  Zap,
  FileText,
  Clock,
  Stethoscope
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const petTypeConfig = {
  DOG: { label: 'Köpek', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: '🐕' },
  CAT: { label: 'Kedi', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: '🐱' },
  BIRD: { label: 'Kuş', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: '🐦' },
  OTHER: { label: 'Diğer', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: '🐾' },
};

const genderConfig = {
  MALE: { label: 'Erkek', color: 'text-blue-600', icon: '♂' },
  FEMALE: { label: 'Dişi', color: 'text-pink-600', icon: '♀' },
};

const recordTypeConfig = {
  CHECKUP: { label: 'Kontrol', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Activity },
  VACCINATION: { label: 'Aşı', color: 'bg-green-50 text-green-700 border-green-200', icon: Zap },
  SURGERY: { label: 'Ameliyat', color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle },
  TREATMENT: { label: 'Tedavi', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Heart },
};

export default function PetDetailPage() {
  const params = useParams();
  const petId = params.id as string;
  const [showMicrochipForm, setShowMicrochipForm] = useState(false);
  
  const { data: petResponse, isLoading, error } = usePet(petId);
  const addMicrochip = useAddMicrochip();
  
  const pet = petResponse?.data;

  const microchipForm = useForm<MicrochipFormData>({
    resolver: zodResolver(microchipSchema),
    defaultValues: {
      chipNumber: '',
      chipDate: '',
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    if (age < 1) {
      const months = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30));
      return `${months} aylık`;
    }
    
    return `${age} yaşında`;
  };

  const onSubmitMicrochip = async (data: MicrochipFormData) => {
    try {
      await addMicrochip.mutateAsync({ petId, data });
      setShowMicrochipForm(false);
      microchipForm.reset();
    } catch (error) {
      console.error('Error adding microchip:', error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Pet Detayı" description="Yükleniyor...">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !pet) {
    return (
      <DashboardLayout title="Pet Detayı" description="Hata oluştu">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Pet detayları yüklenemedi
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Pet bulunamadı veya erişim izniniz yok.
          </p>
          <Link href="/pets">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Hayvanlarıma Dön
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const typeConfig = petTypeConfig[pet.type];
  const genderInfo = genderConfig[pet.gender];
  const medicalRecords = pet.medicalRecords || [];

  return (
    <DashboardLayout 
      title={pet.name} 
      description={`${typeConfig.label} • ${calculateAge(pet.birthDate)}`}
    >
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            href="/pets" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Hayvanlarıma Dön
          </Link>
          <Link href={`/pets/${pet.id}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Düzenle
            </Button>
          </Link>
        </div>

        {/* Pet Overview */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{typeConfig.icon}</div>
                <div>
                  <CardTitle className="text-2xl dark:text-white flex items-center space-x-3">
                    <span>{pet.name}</span>
                    <span className={`text-2xl ${genderInfo.color}`}>{genderInfo.icon}</span>
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {pet.breed} • {calculateAge(pet.birthDate)}
                  </CardDescription>
                </div>
              </div>
              <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">Doğum Tarihi</span>
                <p className="font-medium dark:text-gray-200">{formatDate(pet.birthDate)}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">Renk</span>
                <p className="font-medium dark:text-gray-200">{pet.color}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">Cinsiyet</span>
                <p className="font-medium dark:text-gray-200">{genderInfo.label}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">Kayıt Tarihi</span>
                <p className="font-medium dark:text-gray-200">{formatDate(pet.createdAt)}</p>
              </div>
            </div>

            {/* Allergies */}
            {pet.allergies && (
              <div className="mt-6 bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Alerjiler</h4>
                    <p className="text-yellow-700 dark:text-yellow-300 mt-1">{pet.allergies}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Microchip Info */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-white">
              <Zap className="w-5 h-5 text-blue-500" />
              <span>Microchip Bilgisi</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pet.microchipInfo ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-gray-200">Chip Numarası</p>
                    <p className="text-gray-600 dark:text-gray-400">{pet.microchipInfo.chipNumber}</p>
                  </div>
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    Aktif
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Takma Tarihi: {formatDate(pet.microchipInfo.chipDate)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                {!showMicrochipForm ? (
                  <>
                    <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Bu hayvana henüz microchip takılmamış
                    </p>
                    <Button onClick={() => setShowMicrochipForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Microchip Ekle
                    </Button>
                  </>
                ) : (
                  <FormProvider {...microchipForm}>
                    <form onSubmit={microchipForm.handleSubmit(onSubmitMicrochip)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          name="chipNumber"
                          type="text"
                          label="Chip Numarası"
                          placeholder="Örn: 123456789012345"
                          required
                        />
                        <FormInput
                          name="chipDate"
                          type="date"
                          label="Takma Tarihi"
                          required
                        />
                      </div>
                      <div className="flex justify-center space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowMicrochipForm(false)}
                        >
                          İptal
                        </Button>
                        <Button 
                          type="submit"
                          disabled={addMicrochip.isPending}
                        >
                          {addMicrochip.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medical Records */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-white">
              <Activity className="w-5 h-5 text-green-500" />
              <span>Tıbbi Kayıtlar ({medicalRecords.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {medicalRecords.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Henüz tıbbi kayıt bulunmuyor
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Tıbbi kayıtlar veteriner hekiminiz tarafından eklenecektir
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {medicalRecords.slice(0, 3).map((record) => {
                  const recordConfig = recordTypeConfig[record.type];
                  const IconComponent = recordConfig.icon;
                  
                  return (
                    <div 
                      key={record.id}
                      className={`border rounded-lg p-4 ${recordConfig.color}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-5 h-5" />
                          <div>
                            <h4 className="font-medium">{record.title}</h4>
                            <p className="text-sm opacity-80">{formatDateTime(record.recordDate)}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-white">
                          {recordConfig.label}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Tanı: </span>
                          {record.diagnosis}
                        </div>
                        {record.treatment && (
                          <div>
                            <span className="font-medium">Tedavi: </span>
                            {record.treatment}
                          </div>
                        )}
                        {record.medication && (
                          <div>
                            <span className="font-medium">İlaç: </span>
                            {record.medication}
                          </div>
                        )}
                      </div>

                      {record.veterinarian && (
                        <div className="mt-3 pt-3 border-t border-current border-opacity-20 flex items-center space-x-2 text-sm">
                          <Stethoscope className="w-4 h-4" />
                          <span>
                            Dr. {record.veterinarian.vetPersonalInfo?.firstName} {record.veterinarian.vetPersonalInfo?.lastName}
                          </span>
                          {record.veterinarian.vetClinicInfo?.clinicName && (
                            <>
                              <span>•</span>
                              <span>{record.veterinarian.vetClinicInfo.clinicName}</span>
                            </>
                          )}
                        </div>
                      )}

                      {record.nextVisitDate && (
                        <div className="mt-2 flex items-center space-x-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>Sonraki Kontrol: {formatDate(record.nextVisitDate)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {medicalRecords.length > 3 && (
                  <div className="text-center pt-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      +{medicalRecords.length - 3} daha fazla kayıt var
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href={`/pets/${pet.id}/edit`}>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Bilgileri Düzenle
                </Button>
              </Link>
              {!pet.microchipInfo && (
                <Button 
                  variant="outline"
                  onClick={() => setShowMicrochipForm(true)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Microchip Ekle
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
