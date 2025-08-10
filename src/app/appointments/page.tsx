'use client';

import { useState } from 'react';
import { useAppointments, useUpdateAppointment, useDeleteAppointment } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import type { AppointmentStatus } from '@/types/api';

const statusConfig = {
  SCHEDULED: {
    label: 'Planlandı',
    variant: 'default' as const,
    icon: Clock,
    color: 'text-blue-600',
  },
  COMPLETED: {
    label: 'Tamamlandı', 
    variant: 'secondary' as const,
    icon: CheckCircle,
    color: 'text-green-600',
  },
  CANCELLED: {
    label: 'İptal Edildi',
    variant: 'destructive' as const,
    icon: XCircle,
    color: 'text-red-600',
  },
};

const typeConfig = {
  CHECKUP: {
    label: 'Kontrol',
    icon: Activity,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  VACCINATION: {
    label: 'Aşı',
    icon: AlertCircle,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  SURGERY: {
    label: 'Ameliyat',
    icon: Activity,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  TREATMENT: {
    label: 'Tedavi',
    icon: Activity,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
};

export default function AppointmentsPage() {
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | 'ALL'>('ALL');
  const { data: appointmentsResponse, isLoading, error } = useAppointments();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  const appointments = appointmentsResponse?.data || [];

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedStatus === 'ALL') return true;
    return appointment.status === selectedStatus;
  });

  const handleStatusUpdate = async (id: string, status: AppointmentStatus) => {
    await updateAppointment.mutateAsync({ id, data: { status } });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
      await deleteAppointment.mutateAsync(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Randevular yüklenirken hata oluştu
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Randevular
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Toplam {appointments.length} randevu
            </p>
          </div>
          <Link href="/appointments/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Yeni Randevu
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={selectedStatus === 'ALL' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('ALL')}
            className="whitespace-nowrap"
          >
            Tümü ({appointments.length})
          </Button>
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = appointments.filter(a => a.status === status).length;
            return (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                onClick={() => setSelectedStatus(status as AppointmentStatus)}
                className="whitespace-nowrap"
              >
                {config.label} ({count})
              </Button>
            );
          })}
        </div>

        {/* Appointments Grid */}
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {selectedStatus === 'ALL' ? 'Henüz randevu yok' : `${statusConfig[selectedStatus as AppointmentStatus]?.label} randevu yok`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Yeni bir randevu oluşturmak için başlayın
            </p>
            <Link href="/appointments/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                İlk Randevunu Oluştur
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAppointments.map((appointment) => {
              const StatusIcon = statusConfig[appointment.status].icon;
              const TypeIcon = typeConfig[appointment.type].icon;
              
              return (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <Badge className={typeConfig[appointment.type].color}>
                          {typeConfig[appointment.type].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${statusConfig[appointment.status].color}`} />
                        <Badge variant={statusConfig[appointment.status].variant}>
                          {statusConfig[appointment.status].label}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg dark:text-white">
                      {appointment.title}
                    </CardTitle>
                    {appointment.pet && (
                      <CardDescription className="flex items-center gap-1 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        {appointment.pet.name} ({appointment.pet.breed})
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Date & Time */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(appointment.appointmentDate)}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{formatTime(appointment.appointmentDate)}</span>
                      </div>

                      {/* Pet Owner Info */}
                      {appointment.pet?.owner && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          <span>{appointment.pet.owner.email}</span>
                          <Phone className="w-4 h-4 ml-2" />
                          <span>{appointment.pet.owner.userCode}</span>
                        </div>
                      )}

                      {/* Appointment Details */}
                      {appointment.vaccineType && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Aşı:</strong> {appointment.vaccineType}
                        </p>
                      )}
                      {appointment.surgeryType && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Ameliyat:</strong> {appointment.surgeryType}
                        </p>
                      )}
                      {appointment.treatmentType && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Tedavi:</strong> {appointment.treatmentType}
                        </p>
                      )}

                      {/* Notes */}
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          {appointment.notes}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {appointment.status === 'SCHEDULED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(appointment.id, 'COMPLETED')}
                            disabled={updateAppointment.isPending}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Tamamla
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="px-3"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(appointment.id)}
                          disabled={deleteAppointment.isPending}
                          className="px-3 text-red-600 hover:text-red-700"
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
      </div>
    </div>
  );
}
