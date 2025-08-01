
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, User } from '@/services/AuthService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  checkEmail: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté au chargement
    const currentUser = AuthService.getCurrentUser();
    console.log('Utilisateur actuel au chargement:', currentUser);
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('AuthContext: Tentative de connexion pour:', email);
    try {
      const success = await AuthService.login(email, password);
      console.log('AuthContext: Résultat de la connexion:', success);
      
      if (success) {
        const currentUser = AuthService.getCurrentUser();
        console.log('AuthContext: Utilisateur récupéré après connexion:', currentUser);
        setUser(currentUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('AuthContext: Erreur lors de la connexion:', error);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    try {
      return await AuthService.register(userData);
    } catch (error) {
      console.error('AuthContext: Erreur lors de l\'inscription:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('AuthContext: Déconnexion');
    AuthService.logout();
    setUser(null);
  };

  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    try {
      return await AuthService.resetPassword(email, newPassword);
    } catch (error) {
      console.error('AuthContext: Erreur lors de la réinitialisation:', error);
      return false;
    }
  };

  const checkEmail = async (email: string): Promise<boolean> => {
    try {
      return await AuthService.checkEmail(email);
    } catch (error) {
      console.error('AuthContext: Erreur lors de la vérification de l\'email:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    resetPassword,
    checkEmail
  };

  console.log('AuthContext: État actuel de l\'utilisateur:', user);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
