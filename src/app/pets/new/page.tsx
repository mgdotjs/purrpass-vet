'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePet } from '@/hooks/usePets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/form-components';
import { petSchema, type PetFormData } from '@/utils/validation';
import { ArrowLeft, Heart, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

const petTypes = [
  { value: 'DOG', label: '🐕 Köpek' },
  { value: 'CAT', label: '🐱 Kedi' },
  { value: 'BIRD', label: '🐦 Kuş' },
  { value: 'OTHER', label: '🐾 Diğer' },
];

const genderOptions = [
  { value: 'MALE', label: '♂ Erkek' },
  { value: 'FEMALE', label: '♀ Dişi' },
];

export default function NewPetPage() {
  const router = useRouter();
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

  const createPet = useCreatePet();

  const onSubmit = async (data: PetFormData) => {
    console.log('data', data);
    try {
      await createPet.mutateAsync(data);
      router.push('/pets');
    } catch (error) {
      console.error('Error creating pet:', error);
    }
  };

  return (
    <DashboardLayout 
      title="Yeni Hayvan Ekle" 
      description="Hayvanınızın bilgilerini girin"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/pets" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Hayvanlarıma Dön
          </Link>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-white">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Hayvan Bilgileri</span>
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Lütfen hayvanınızın bilgilerini eksiksiz doldurun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Pet Name */}
                <FormInput
                  name="name"
                  type="text"
                  label="Hayvan Adı"
                  placeholder="Örn: Buddy, Minnoş, Coco"
                  required
                />

                {/* Pet Type and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormSelect
                    name="type"
                    label="Hayvan Türü"
                    options={petTypes}
                    required
                  />
                  
                  <FormSelect
                    name="gender"
                    label="Cinsiyet"
                    options={genderOptions}
                    required
                  />
                </div>

                {/* Breed and Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    name="breed"
                    type="text"
                    label="Cins"
                    placeholder="Örn: Golden Retriever, Tekir, Kanarya"
                    required
                  />
                  
                  <FormInput
                    name="color"
                    type="text"
                    label="Renk"
                    placeholder="Örn: Altın sarısı, Siyah, Gri"
                    required
                  />
                </div>

                {/* Birth Date */}
                <FormInput
                  name="birthDate"
                  type="date"
                  label="Doğum Tarihi"
                  required
                />

                {/* Allergies */}
                <FormTextarea
                  name="allergies"
                  label="Alerjiler (Opsiyonel)"
                  placeholder="Bilinen alerjiler, özel durumlar veya hassasiyetler..."
                  rows={3}
                />

                {/* Form Actions */}
                <div className="flex justify-end space-x-4">
                  <Link href="/pets">
                    <Button variant="outline">
                      İptal
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={createPet.isPending}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {createPet.isPending ? 'Kaydediliyor...' : 'Hayvanı Kaydet'}
                    </span>
                  </Button>
                </div>

                {/* Success/Error Messages */}
                {createPet.isSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      ✅ Hayvan başarıyla kaydedildi!
                    </p>
                  </div>
                )}

                {createPet.isError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">
                      ❌ Hayvan kaydedilirken hata oluştu. Lütfen tekrar deneyin.
                    </p>
                  </div>
                )}
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">💡 İpuçları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>• Doğum tarihini tam olarak bilmiyorsanız, yaklaşık tarihi girebilirsiniz</p>
            <p>• Cins bilgisini mümkün olduğunca detaylı girin</p>
            <p>• Alerjiler bölümüne ilaç, yiyecek veya çevresel alerjileri yazabilirsiniz</p>
            <p>• Kaydettikten sonra microchip bilgilerini de ekleyebilirsiniz</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
