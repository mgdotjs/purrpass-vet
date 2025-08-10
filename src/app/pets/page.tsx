'use client';

import Link from 'next/link';
import { usePets, useDeletePet } from '@/hooks/usePets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Heart,
  Activity,
  AlertCircle,
  Eye,
  Zap
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const petTypeConfig = {
  DOG: {
    label: 'Köpek',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: '🐕',
  },
  CAT: {
    label: 'Kedi',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    icon: '🐱',
  },
  BIRD: {
    label: 'Kuş',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: '🐦',
  },
  OTHER: {
    label: 'Diğer',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    icon: '🐾',
  },
};

const genderConfig = {
  MALE: {
    label: 'Erkek',
    color: 'text-blue-600',
    icon: '♂',
  },
  FEMALE: {
    label: 'Dişi',
    color: 'text-pink-600',
    icon: '♀',
  },
};

export default function PetsPage() {
  const { data: petsResponse, isLoading, error } = usePets();
  const deletePet = useDeletePet();

  const pets = petsResponse?.data || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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

  const handleDelete = async (petId: string) => {
    if (window.confirm('Bu hayvanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        await deletePet.mutateAsync(petId);
      } catch (error) {
        console.error('Error deleting pet:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Hayvanlarım" description="Hayvanlar yükleniyor...">
        <div className="animate-pulse">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Hayvanlarım" description="Hata oluştu">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Hayvanlar yüklenirken hata oluştu
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Hayvanlarım" 
      description={`Toplam ${pets.length} hayvan kayıtlı`}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/pets/new">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Yeni Hayvan Ekle
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(petTypeConfig).map(([type, config]) => {
            const count = pets.filter(pet => pet.type === type).length;
            if (count === 0) return null;
            
            return (
              <Card key={type} className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{config.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {config.label}
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {count}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pets Grid */}
        {pets.length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Henüz hiç hayvanınız yok
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                İlk hayvanınızı ekleyerek başlayın ve sağlık takibini yapmaya başlayın.
              </p>
              <Link href="/pets/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Hayvanınızı Ekleyin
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => {
              const typeConfig = petTypeConfig[pet.type];
              const genderInfo = genderConfig[pet.gender];
              const medicalRecordsCount = pet.medicalRecords?.length || 0;

              return (
                <Card key={pet.id} className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{typeConfig.icon}</div>
                        <div>
                          <CardTitle className="text-lg dark:text-white">
                            {pet.name}
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-2">
                            <span>{pet.breed}</span>
                            <span className={`text-lg ${genderInfo.color}`}>
                              {genderInfo.icon}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={typeConfig.color}>
                        {typeConfig.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Pet Info */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Yaş:</span>
                        <p className="font-medium dark:text-gray-200">
                          {calculateAge(pet.birthDate)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Renk:</span>
                        <p className="font-medium dark:text-gray-200">{pet.color}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 dark:text-gray-400">Doğum:</span>
                        <p className="font-medium dark:text-gray-200">
                          {formatDate(pet.birthDate)}
                        </p>
                      </div>
                    </div>

                    {/* Microchip Status */}
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {pet.microchipInfo ? 
                          `Microchip: ${pet.microchipInfo.chipNumber}` : 
                          'Microchip yok'
                        }
                      </span>
                    </div>

                    {/* Medical Records Count */}
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {medicalRecordsCount} tıbbi kayıt
                      </span>
                    </div>

                    {/* Allergies */}
                    {pet.allergies && (
                      <div className="bg-yellow-50 dark:bg-yellow-900 p-2 rounded-lg">
                        <p className="text-xs text-yellow-800 dark:text-yellow-200">
                          <AlertCircle className="w-3 h-3 inline mr-1" />
                          Alerjiler: {pet.allergies}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Link href={`/pets/${pet.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          <Eye className="w-4 h-4 mr-1" />
                          Detay
                        </Button>
                      </Link>
                      
                      <div className="flex space-x-1">
                        <Link href={`/pets/${pet.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(pet.id)}
                          disabled={deletePet.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        {pets.length > 0 && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Hızlı İşlemler</CardTitle>
              <CardDescription>
                Hayvanlarınız için yapabileceğiniz işlemler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Link href="/appointments/new">
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Randevu Al
                  </Button>
                </Link>
                <Link href="/pets/new">
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Hayvan Ekle
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
