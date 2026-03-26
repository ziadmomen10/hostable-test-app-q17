// Protected admin route component
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRoute } from '@/hooks/useAdminRoute';
import { Button } from '@/components/ui/button';
import AdminLogin from './AdminLogin';

interface AdminRouteProps {
  children: React.ReactNode;
  currentPath: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, currentPath }) => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { adminPath, isValidAdminPath, loading: routeLoading } = useAdminRoute();

  // CRITICAL: Don't do ANY validation or navigation during loading or when no adminPath is available
  // This prevents redirects during page refresh when auth state is temporarily reset
  if (authLoading || routeLoading || !adminPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only validate path AFTER loading is complete AND adminPath is available
  if (!isValidAdminPath(currentPath)) {
    console.log('AdminRoute - Invalid path detected:', { currentPath, adminPath });
    return <Navigate to="/" replace />;
  }

  // Show login form if not authenticated
  if (!user) {
    console.log('AdminRoute - No user, showing login');
    return <AdminLogin />;
  }

  // Check admin privileges
  if (!isAdmin) {
    console.log('AdminRoute - User not admin, showing access denied');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this area.</p>
          <div className="mt-4">
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  console.log('AdminRoute - User is admin, showing admin content');
  return <>{children}</>;
};

export default AdminRoute;