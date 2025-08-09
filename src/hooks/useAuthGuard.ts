'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

export function useAuthGuard(redirectTo: string = '/auth/login') {
  const { user, isLoading, accessToken, isHydrated, setHydrated } = useAuthStore();
  const router = useRouter();

  // Handle hydration from localStorage
  useEffect(() => {
    if (!isHydrated) {
      setHydrated(true);
    }
  }, [isHydrated, setHydrated]);

  useEffect(() => {
    // Wait for hydration and auth state to load
    if (!isHydrated || isLoading) return;

    // Check both user and token for authentication
    const isAuthenticated = user && accessToken;
    
    // If no user is logged in, redirect to login
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }
  }, [user, accessToken, isLoading, isHydrated, router, redirectTo]);

  // Loading state until hydrated and auth state is ready
  const loading = !isHydrated || isLoading;
  const authenticated = !!user && !!accessToken;

  return { user, isLoading: loading, isAuthenticated: authenticated };
}

export function useVetGuard(redirectTo: string = '/auth/login') {
  const { user, isLoading, accessToken, isHydrated, setHydrated } = useAuthStore();
  const router = useRouter();

  // Handle hydration from localStorage
  useEffect(() => {
    if (!isHydrated) {
      setHydrated(true);
    }
  }, [isHydrated, setHydrated]);

  useEffect(() => {
    // Wait for hydration and auth state to load
    if (!isHydrated || isLoading) return;

    // Check both user and token for authentication
    const isAuthenticated = user && accessToken;

    // If no user is logged in, redirect to login
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // If user is not a VET, redirect to dashboard or appropriate page
    if (user.role !== 'VET') {
      router.push('/dashboard');
      return;
    }
  }, [user, accessToken, isLoading, isHydrated, router, redirectTo]);

  // Loading state until hydrated and auth state is ready
  const loading = !isHydrated || isLoading;
  const authenticated = !!user && !!accessToken && user.role === 'VET';

  return { user, isLoading: loading, isAuthenticated: authenticated };
}

export function useGuestGuard(redirectTo: string = '/dashboard') {
  const { user, isLoading, accessToken, isHydrated, setHydrated } = useAuthStore();
  const router = useRouter();

  // Handle hydration from localStorage
  useEffect(() => {
    if (!isHydrated) {
      setHydrated(true);
    }
  }, [isHydrated, setHydrated]);

  useEffect(() => {
    // Wait for hydration and auth state to load
    if (!isHydrated || isLoading) return;

    // Check if user is authenticated
    const isAuthenticated = user && accessToken;
    
    // If user is logged in, redirect to dashboard
    if (isAuthenticated) {
      router.push(redirectTo);
      return;
    }
  }, [user, accessToken, isLoading, isHydrated, router, redirectTo]);

  // Loading state until hydrated and auth state is ready
  const loading = !isHydrated || isLoading;
  const isGuest = !user || !accessToken;

  return { isLoading: loading, isGuest };
}
