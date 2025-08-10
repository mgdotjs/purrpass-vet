import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '@/services/api';
import type { 
  Pet, 
  CreatePetRequest, 
  UpdatePetRequest, 
  CreateMicrochipRequest,
  ApiResponse 
} from '@/types/api';

// Query Keys
export const PETS_QUERY_KEYS = {
  all: ['pets'] as const,
  lists: () => [...PETS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: string) => [...PETS_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...PETS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PETS_QUERY_KEYS.details(), id] as const,
};

// Get all pets
export function usePets() {
  return useQuery({
    queryKey: PETS_QUERY_KEYS.lists(),
    queryFn: () => petService.getPets(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get pet by ID
export function usePet(id: string, enabled = true) {
  return useQuery({
    queryKey: PETS_QUERY_KEYS.detail(id),
    queryFn: () => petService.getPetById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create pet
export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePetRequest) => petService.createPet(data),
    onSuccess: () => {
      // Invalidate and refetch pets list
      queryClient.invalidateQueries({ queryKey: PETS_QUERY_KEYS.lists() });
    },
    onError: (error: Error) => {
      console.error('Error creating pet:', error);
    },
  });
}

// Update pet
export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePetRequest }) => 
      petService.updatePet(id, data),
    onSuccess: (response: ApiResponse<Pet>, { id }) => {
      // Update the pets list cache
      queryClient.setQueryData<ApiResponse<Pet[]>>(
        PETS_QUERY_KEYS.lists(),
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((pet) => 
              pet.id === id ? response.data : pet
            ),
          };
        }
      );

      // Update the specific pet cache
      queryClient.setQueryData(
        PETS_QUERY_KEYS.detail(id),
        response
      );
    },
    onError: (error: Error) => {
      console.error('Error updating pet:', error);
    },
  });
}

// Delete pet
export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => petService.deletePet(id),
    onSuccess: (_, deletedId) => {
      // Remove from pets list cache
      queryClient.setQueryData<ApiResponse<Pet[]>>(
        PETS_QUERY_KEYS.lists(),
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((pet) => pet.id !== deletedId),
          };
        }
      );

      // Remove the specific pet cache
      queryClient.removeQueries({ 
        queryKey: PETS_QUERY_KEYS.detail(deletedId) 
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting pet:', error);
    },
  });
}

// Add microchip
export function useAddMicrochip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, data }: { petId: string; data: CreateMicrochipRequest }) => 
      petService.addMicrochip(petId, data),
    onSuccess: (response, { petId }) => {
      // Invalidate pet detail to refetch with microchip info
      queryClient.invalidateQueries({ 
        queryKey: PETS_QUERY_KEYS.detail(petId) 
      });
      
      // Also invalidate pets list in case it shows microchip info
      queryClient.invalidateQueries({ 
        queryKey: PETS_QUERY_KEYS.lists() 
      });
    },
    onError: (error: Error) => {
      console.error('Error adding microchip:', error);
    },
  });
}
