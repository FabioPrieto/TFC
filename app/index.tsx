import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from './context/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // User is authenticated, redirect to main app
        console.log(`User ${user.name} authenticated for store ${user.storeId}`);
        router.replace('/(tabs)/timecontrol');
      } else {
        // User is not authenticated, redirect to login
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // This should not be reached, but just in case
  return <LoadingSpinner message="Initializing..." />;
}