import { useNavigate } from 'react-router-dom';
import { getSecureRoute } from '@/services/secureIds';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook personnalisé pour la navigation sécurisée
 * Transforme automatiquement les routes en routes sécurisées
 */
export const useSecureNavigation = () => {
  const navigate = useNavigate();
  const { setRedirectAfterLogin } = useAuth();

  /**
   * Navigue vers une route sécurisée
   * @param path Chemin de la route réelle
   * @param options Options de navigation
   */
  const navigateSecure = (path: string, options?: { replace?: boolean }) => {
    try {
      const securePath = getSecureRoute(path);
      const secureDestination = securePath.startsWith('/') ? securePath : `/${securePath}`;
      navigate(secureDestination, options);
    } catch (error) {
      console.error('Erreur lors de la navigation sécurisée:', error);
      // Fallback vers la navigation normale
      navigate(path, options);
    }
  };

  /**
   * Définit une redirection sécurisée après connexion
   * @param path Chemin de la route réelle
   */
  const setSecureRedirect = (path: string) => {
    try {
      const securePath = getSecureRoute(path);
      const secureDestination = securePath.startsWith('/') ? securePath : `/${securePath}`;
      setRedirectAfterLogin(secureDestination);
    } catch (error) {
      console.error('Erreur lors de la définition de la redirection sécurisée:', error);
      setRedirectAfterLogin(path);
    }
  };

  return {
    navigateSecure,
    setSecureRedirect,
  };
};