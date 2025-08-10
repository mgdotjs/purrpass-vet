'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { usePet, useUpdatePet, useDeletePet } from '@/hooks/usePets';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/form-components';
import { petSchema, type PetFormData } from '@/utils/validation';
import { ArrowLeft, Save, Trash2, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

const petTypeOptions = [
  { value: 'DOG', label: 'Köpek' },
  { value: 'CAT', label: 'Kedi' },
  { value: 'BIRD', label: 'Kuş' },
  { value: 'OTHER', label: 'Diğer' },
];

const genderOptions = [
  { value: 'MALE', label: 'Erkek' },
  { value: 'FEMALE', label: 'Dişi' },
];

const petTypeConfig = {
  DOG: { label: 'Köpek', icon: '🐕' },
  CAT: { label: 'Kedi', icon: '🐱' },
  BIRD: { label: 'Kuş', icon: '🐦' },
  OTHER: { label: 'Diğer', icon: '🐾' },
};

export default function EditPetPage() {
  const params = useParams();
  const router = useRouter();
  const petId = params.id as string;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { data: petResponse, isLoading, error } = usePet(petId);
  const updatePet = useUpdatePet();
  const deletePet = useDeletePet();
  
  const pet = petResponse?.data;

  const form = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: '',
      type: 'DOG',
      breed: '',
      birthDate: '',
      gender: 'MALE',
      color: '',
      allergies: '',
    },
  });

  // Update form when pet data loads
  useEffect(() => {
    if (pet) {
      form.reset({
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        birthDate: pet.birthDate.split('T')[0], // Format for date input
        gender: pet.gender,
        color: pet.color,
        allergies: pet.allergies || '',
      });
    }
  }, [pet, form]);

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

  const onSubmit = async (data: PetFormData) => {
    console.log('data', data);
    try {
      await updatePet.mutateAsync({ id: petId, data });
      router.push(`/pets/${petId}`);
    } catch (error) {
      console.error('Error updating pet:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePet.mutateAsync(petId);
      setShowDeleteDialog(false);
      router.push('/pets');
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Pet Düzenle" description="Yükleniyor...">
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
      <DashboardLayout title="Pet Düzenle" description="Hata oluştu">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Pet düzenlenemedi
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

  return (
    <DashboardLayout 
      title={`${pet.name} - Düzenle`} 
      description={`${typeConfig.label} • ${calculateAge(pet.birthDate)}`}
    >
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            href={`/pets/${petId}`} 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Detaya Dön
          </Link>
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Sil
          </Button>
        </div>

        {/* Current Pet Info */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{typeConfig.icon}</div>
              <div>
                <CardTitle className="dark:text-white">{pet.name}</CardTitle>
                <CardDescription>
                  {pet.breed} • {calculateAge(pet.birthDate)}
                </CardDescription>
              </div>
              <Badge className="ml-auto">
                {typeConfig.label}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Edit Form */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Pet Bilgilerini Düzenle</CardTitle>
            <CardDescription>
              Hayvanınızın bilgilerini güncelleyebilirsiniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    name="name"
                    type="text"
                    label="Hayvan Adı"
                    placeholder="Örn: Pamuk"
                    required
                  />
                  
                  <FormSelect
                    name="type"
                    label="Hayvan Türü"
                    options={petTypeOptions}
                    required
                  />

                  <FormInput
                    name="breed"
                    type="text"
                    label="Cinsi"
                    placeholder="Örn: Golden Retriever"
                    required
                  />

                  <FormInput
                    name="birthDate"
                    type="date"
                    label="Doğum Tarihi"
                    required
                  />

                  <FormSelect
                    name="gender"
                    label="Cinsiyet"
                    options={genderOptions}
                    required
                  />

                  <FormInput
                    name="color"
                    type="text"
                    label="Renk"
                    placeholder="Örn: Kahverengi"
                    required
                  />
                </div>

                {/* Allergies */}
                <FormTextarea
                  name="allergies"
                  label="Alerjiler"
                  placeholder="Varsa alerjileri belirtiniz (isteğe bağlı)"
                  rows={3}
                />

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <Link href={`/pets/${petId}`}>
                    <Button type="button" variant="outline">
                      İptal
                    </Button>
                  </Link>
                  <Button 
                    type="submit"
                    disabled={updatePet.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updatePet.isPending ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>Pet Sil</span>
              </DialogTitle>
              <DialogDescription className="py-4">
                <strong>{pet.name}</strong> adlı hayvanı silmek istediğinizden emin misiniz?
                <br />
                <br />
                Bu işlem geri alınamaz ve hayvanın tüm tıbbi kayıtları da silinecektir.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                İptal
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deletePet.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deletePet.isPending ? 'Siliniyor...' : 'Evet, Sil'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
