'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateAppointment } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/form-components';
import { appointmentSchema, type AppointmentFormData } from '@/utils/validation';
import { ArrowLeft, Calendar, Save } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Mock data - normally would come from API
const mockPets = [
  { value: 'ec4ed2cd-7e4a-4f49-833f-82c4cb9693ec', label: 'Buddy2 (Golden Retriever)' },
  { value: '85a079f7-86fc-4c7c-9c54-b6985f85b6da', label: 'Buddy1 (Golden Retriever)' },
];

const appointmentTypes = [
  { value: 'CHECKUP', label: 'Kontrol' },
  { value: 'VACCINATION', label: 'Aşı' },
  { value: 'SURGERY', label: 'Ameliyat' },
  { value: 'TREATMENT', label: 'Tedavi' },
];

export default function NewAppointmentPage() {
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      petId: '',
      type: 'CHECKUP',
      title: '',
      appointmentDate: '',
      notes: '',
      vaccineType: '',
      treatmentType: '',
      surgeryType: '',
    },
  });

  const createAppointment = useCreateAppointment();
  const selectedType = form.watch('type');

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const appointmentData = {
        ...data,
        appointmentDate: new Date(data.appointmentDate).toISOString(),
        vaccineType: data.type === 'VACCINATION' ? data.vaccineType : undefined,
        treatmentType: data.type === 'TREATMENT' ? data.treatmentType : undefined,
        surgeryType: data.type === 'SURGERY' ? data.surgeryType : undefined,
      };

      await createAppointment.mutateAsync(appointmentData);
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  return (
    <DashboardLayout 
      title="Yeni Randevu" 
      description="Hayvanınız için yeni randevu oluşturun"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/appointments" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Randevulara Dön
          </Link>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-white">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Randevu Bilgileri</span>
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Lütfen randevu detaylarını doldurun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormSelect
                  name="petId"
                  label="Hayvan Seçin"
                  options={mockPets}
                  placeholder="Hayvanınızı seçin..."
                  required
                />

                <FormSelect
                  name="type"
                  label="Randevu Türü"
                  options={appointmentTypes}
                  required
                />

                <FormInput
                  name="title"
                  type="text"
                  label="Randevu Başlığı"
                  placeholder="Örn: Rutin kontrol"
                  required
                />

                <FormInput
                  name="appointmentDate"
                  type="datetime-local"
                  label="Randevu Tarihi ve Saati"
                  required
                />

                {selectedType === 'VACCINATION' && (
                  <FormInput
                    name="vaccineType"
                    type="text"
                    label="Aşı Türü"
                    placeholder="Örn: Karma aşı, Kuduz aşısı"
                  />
                )}

                {selectedType === 'TREATMENT' && (
                  <FormInput
                    name="treatmentType"
                    type="text"
                    label="Tedavi Türü"
                    placeholder="Örn: Antibiyotik tedavisi"
                  />
                )}

                {selectedType === 'SURGERY' && (
                  <FormInput
                    name="surgeryType"
                    type="text"
                    label="Ameliyat Türü"
                    placeholder="Örn: Kısırlaştırma"
                  />
                )}

                <FormTextarea
                  name="notes"
                  label="Notlar (Opsiyonel)"
                  placeholder="Ek bilgiler veya özel notlar..."
                  rows={4}
                />

                <div className="flex justify-end space-x-4">
                  <Link href="/appointments">
                    <Button variant="outline">
                      İptal
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={createAppointment.isPending}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {createAppointment.isPending ? 'Kaydediliyor...' : 'Randevu Oluştur'}
                    </span>
                  </Button>
                </div>

                {createAppointment.isSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      ✅ Randevu başarıyla oluşturuldu!
                    </p>
                  </div>
                )}

                {createAppointment.isError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">
                      ❌ Randevu oluşturulurken hata oluştu. Lütfen tekrar deneyin.
                    </p>
                  </div>
                )}
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
