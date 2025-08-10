'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '@/services/api';
import type { CreateAppointmentRequest, UpdateAppointmentRequest } from '@/types/api';
import { useRouter } from 'next/navigation';

// Query Keys
export const APPOINTMENT_QUERY_KEYS = {
  all: ['appointments'] as const,
  byPet: (petId: string) => ['appointments', 'pet', petId] as const,
};

// Get all appointments for veterinarian
export const useAppointments = () => {
  return useQuery({
    queryKey: APPOINTMENT_QUERY_KEYS.all,
    queryFn: () => appointmentService.getAppointments(),
  });
};

// Get appointments by pet ID
export const useAppointmentsByPet = (petId: string) => {
  return useQuery({
    queryKey: APPOINTMENT_QUERY_KEYS.byPet(petId),
    queryFn: () => appointmentService.getAppointmentsByPet(petId),
    enabled: !!petId,
  });
};

// Create new appointment
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) => appointmentService.createAppointment(data),
    onSuccess: (response) => {
      console.log('✅', response.message || 'Randevu başarıyla oluşturuldu');
      // Invalidate appointments queries
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['appointments', 'pet'] });
      router.push('/appointments');
    },
    onError: (error) => {
      console.error('Appointment creation error:', error);
      console.log('❌ Randevu oluşturulurken bir hata oluştu');
    },
  });
};

// Update appointment
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentRequest }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: (response) => {
      console.log('✅', response.message || 'Randevu başarıyla güncellendi');
      // Invalidate appointments queries
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['appointments', 'pet'] });
    },
    onError: (error) => {
      console.error('Appointment update error:', error);
      console.log('❌ Randevu güncellenirken bir hata oluştu');
    },
  });
};

// Delete appointment
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentService.deleteAppointment(id),
    onSuccess: (response) => {
      console.log('✅', response.data.message || 'Randevu başarıyla silindi');
      // Invalidate appointments queries
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['appointments', 'pet'] });
    },
    onError: (error) => {
      console.error('Appointment deletion error:', error);
      console.log('❌ Randevu silinirken bir hata oluştu');
    },
  });
};
