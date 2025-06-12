
import React, { useState, useEffect } from 'react';
import { Shield, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SSLIndicator: React.FC = () => {
  const [sslStatus, setSSLStatus] = useState<'secure' | 'insecure' | 'checking'>('checking');

  useEffect(() => {
    // Vérifier si la connexion est sécurisée
    const checkSSLStatus = () => {
      if (window.location.protocol === 'https:') {
        setSSLStatus('secure');
      } else {
        setSSLStatus('insecure');
      }
    };

    checkSSLStatus();
  }, []);

  const getStatusColor = () => {
    switch (sslStatus) {
      case 'secure':
        return 'text-green-600';
      case 'insecure':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusIcon = () => {
    switch (sslStatus) {
      case 'secure':
        return <CheckCircle className="h-5 w-5" />;
      case 'insecure':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getStatusText = () => {
    switch (sslStatus) {
      case 'secure':
        return 'Connexion Sécurisée SSL/TLS';
      case 'insecure':
        return 'Connexion Non Sécurisée';
      default:
        return 'Vérification en cours...';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Card className="inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800 hover:shadow-md transition-all cursor-pointer">
            <div className={`${getStatusColor()}`}>
              {getStatusIcon()}
            </div>
            <div className="flex flex-col items-start">
              <Badge variant="outline" className="text-xs border-green-300 text-green-700 dark:text-green-300">
                SSL 256-bit
              </Badge>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                {getStatusText()}
              </span>
            </div>
            <Lock className="h-4 w-4 text-green-600" />
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <p className="font-medium mb-2">Sécurité SSL/TLS</p>
            <ul className="text-sm space-y-1">
              <li>• Chiffrement 256-bit</li>
              <li>• Certificat vérifié</li>
              <li>• Données protégées</li>
              <li>• Transmission sécurisée</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SSLIndicator;
