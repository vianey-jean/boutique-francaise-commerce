import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { getSecureRoute } from '@/services/secureIds';
import { useAuth } from '@/contexts/AuthContext';

interface SecureLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  requireAuth?: boolean;
  children: React.ReactNode;
}

/**
 * Composant de lien sécurisé qui transforme automatiquement les routes
 * en routes sécurisées avec caractères invariables
 */
const SecureLink: React.FC<SecureLinkProps> = ({ 
  to, 
  requireAuth = false, 
  children, 
  onClick,
  ...props 
}) => {
  const { isAuthenticated, setRedirectAfterLogin } = useAuth();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Si l'authentification est requise et l'utilisateur n'est pas connecté
    if (requireAuth && !isAuthenticated) {
      e.preventDefault();
      // Stocker la destination sécurisée pour redirection après connexion
      try {
        const securePath = getSecureRoute(to);
        const secureDestination = securePath.startsWith('/') ? securePath : `/${securePath}`;
        setRedirectAfterLogin(secureDestination);
        // Naviguer vers la page de connexion sécurisée
        const secureLoginPath = getSecureRoute('/login');
        const secureLogin = secureLoginPath.startsWith('/') ? secureLoginPath : `/${secureLoginPath}`;
        window.location.href = secureLogin;
      } catch (error) {
        console.error('Erreur lors de la sécurisation de la redirection:', error);
        setRedirectAfterLogin(to);
        window.location.href = '/login';
      }
      return;
    }

    // Appeler le onClick personnalisé s'il existe
    if (onClick) {
      onClick(e);
    }
  };

  // Transformer la route en route sécurisée
  let secureTo: string;
  try {
    const secureRoute = getSecureRoute(to);
    secureTo = secureRoute.startsWith('/') ? secureRoute : `/${secureRoute}`;
  } catch (error) {
    console.error('Erreur lors de la sécurisation du lien:', error);
    secureTo = to; // Fallback vers le chemin original
  }

  return (
    <Link 
      to={secureTo} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default SecureLink;