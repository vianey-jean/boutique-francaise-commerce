import { generateSecureId } from '@/services/secureIds';

// Map pour stocker les mappings sécurisés des URLs de fichiers
const secureUrlMap = new Map<string, string>();
const reverseUrlMap = new Map<string, string>();

/**
 * Génère une URL sécurisée pour un fichier
 * @param originalUrl URL originale du fichier
 * @returns URL sécurisée
 */
export const getSecureFileUrl = (originalUrl: string): string => {
  // Vérifier si une URL sécurisée existe déjà
  if (secureUrlMap.has(originalUrl)) {
    return secureUrlMap.get(originalUrl)!;
  }

  // Extraire l'extension du fichier
  const urlParts = originalUrl.split('.');
  const extension = urlParts.length > 1 ? `.${urlParts[urlParts.length - 1]}` : '';
  
  // Générer un ID sécurisé pour le fichier
  const secureId = generateSecureId(originalUrl, 'product'); // Utiliser 'product' comme type par défaut
  const secureUrl = `/secure-file/${secureId}${extension}`;

  // Stocker les mappings
  secureUrlMap.set(originalUrl, secureUrl);
  reverseUrlMap.set(secureUrl, originalUrl);

  return secureUrl;
};

/**
 * Récupère l'URL originale à partir d'une URL sécurisée
 * @param secureUrl URL sécurisée
 * @returns URL originale ou undefined si non trouvée
 */
export const getRealFileUrl = (secureUrl: string): string | undefined => {
  return reverseUrlMap.get(secureUrl);
};

/**
 * Sécurise une URL de fichier de chat
 * @param fileUrl URL du fichier de chat
 * @returns URL sécurisée
 */
export const getSecureChatFileUrl = (fileUrl: string): string => {
  if (!fileUrl) return '';
  
  // Si c'est déjà une URL sécurisée, la retourner
  if (fileUrl.startsWith('/secure-file/')) {
    return fileUrl;
  }

  return getSecureFileUrl(fileUrl);
};

/**
 * Middleware pour servir les fichiers sécurisés
 * Cette fonction devrait être implémentée côté serveur
 */
export const createSecureFileHandler = () => {
  return (req: any, res: any) => {
    const secureUrl = req.path;
    const realUrl = getRealFileUrl(secureUrl);
    
    if (!realUrl) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    // Rediriger vers le fichier réel de manière sécurisée
    // En production, cela devrait vérifier les permissions
    res.redirect(realUrl);
  };
};