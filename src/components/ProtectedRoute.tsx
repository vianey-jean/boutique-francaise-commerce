
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  // Si l'utilisateur n'est pas authentifié, le rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Vérifier les rôles si des rôles sont spécifiés
  if (allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      // Rediriger les utilisateurs non autorisés
      return <Navigate to="/" />;
    }
  }

  // Si l'utilisateur est authentifié et a les rôles requis, afficher les enfants
  return <>{children}</>;
};

export default ProtectedRoute;
