import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePage from '@/pages/ProfilePage';

const AdminProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/a93jf02kd92ms71x8qp4');
  };

  return <ProfilePage onBack={handleBack} />;
};

export default AdminProfilePage;