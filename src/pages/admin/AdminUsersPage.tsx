import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import UserManagement from '@/components/UserManagement';
import { useAuth } from '@/contexts/AuthContext';

const AdminUsersPage: React.FC = () => {
  const { userRoles } = useAuth();

  const hasRole = (role: string): boolean => {
    return userRoles.includes(role);
  };

  // Only allow admin role to access user management
  if (!hasRole('admin')) {
    return (
      <Card className="bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don't have permission to access user management. Only admin users can manage other users.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <UserManagement />;
};

export default AdminUsersPage;