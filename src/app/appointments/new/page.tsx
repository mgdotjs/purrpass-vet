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
      // Convert date to ISO string
      const appointmentData = {
        ...data,
        appointmentDate: new Date(data.appointmentDate).toISOString(),
        // Only include type-specific fields
        vaccineType: data.type === 'VACCINATION' ? data.vaccineType : undefined,
        treatmentType: data.type === 'TREATMENT' ? data.treatmentType : undefined,
        surgeryType: data.type === 'SURGERY' ? data.surgeryType : undefined,
      };
      
      await createAppointment.mutateAsync(appointmentData);
    } catch (error) {
      console.error('Appointment creation error:', error);
    }
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/appointments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-8 h-8" />
              Yeni Randevu
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Pet için yeni bir randevu oluşturun
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Randevu Bilgileri</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Randevu detaylarını doldurun
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Pet Selection */}
                <FormSelect
                  name="petId"
                  label="Pet Seçimi"
                  placeholder="Pet seçin..."
                  options={mockPets}
                  required
                />

                {/* Appointment Type */}
                <FormSelect
                  name="type"
                  label="Randevu Tipi"
                  placeholder="Randevu tipi seçin..."
                  options={appointmentTypes}
                  required
                />

                {/* Title */}
                <FormInput
                  name="title"
                  label="Başlık"
                  placeholder="Örn: Yıllık Genel Sağlık Kontrolü"
                  required
                />

                {/* Date & Time */}
                <FormInput
                  name="appointmentDate"
                  label="Randevu Tarihi ve Saati"
                  type="datetime-local"
                  min={minDate}
                  required
                />

                {/* Type-specific fields */}
                {selectedType === 'VACCINATION' && (
                  <FormInput
                    name="vaccineType"
                    label="Aşı Tipi"
                    placeholder="Örn: İç parazit, Kuduz, DHPP"
                    required
                  />
                )}

                {selectedType === 'SURGERY' && (
                  <FormInput
                    name="surgeryType"
                    label="Ameliyat Tipi"
                    placeholder="Örn: Kısırlaştırma, Kırık tedavisi"
                    required
                  />
                )}

                {selectedType === 'TREATMENT' && (
                  <FormInput
                    name="treatmentType"
                    label="Tedavi Tipi"
                    placeholder="Örn: Diş temizliği, Yara tedavisi"
                    required
                  />
                )}

                {/* Notes */}
                <FormTextarea
                  name="notes"
                  label="Notlar (İsteğe bağlı)"
                  placeholder="Randevu hakkında ek bilgiler..."
                  rows={4}
                />

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Link href="/appointments" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      İptal
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={createAppointment.isPending}
                    className="flex-1"
                  >
                    {createAppointment.isPending ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Randevu Oluştur
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Randevu Oluşturma İpuçları
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Randevu tarihini en az 1 gün önceden ayarlayın</li>
            <li>• Aşı randevularında aşı tipini belirtmeyi unutmayın</li>
            <li>• Ameliyat randevularında ameliyat detaylarını not bölümüne yazın</li>
            <li>• Acil durumlar için doğrudan klinik ile iletişime geçin</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
