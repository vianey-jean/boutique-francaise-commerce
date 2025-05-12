
import React from 'react';

export interface User {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  role: string;
  adresse?: string;
  telephone?: string;
  dateCreation: string;
  genre?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (nom: string, email: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ hasPasswordUnique: boolean; userId: string }>;
  verifyTempPassword: (email: string, tempPassword: string) => Promise<boolean>;
  resetPassword: (email: string, tempPassword: string, newPassword: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
