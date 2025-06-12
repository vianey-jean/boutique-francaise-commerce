
import React from 'react';
import { Shield, Lock, Eye, Database } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SecurityBanner: React.FC = () => {
  const securityFeatures = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "SSL 256-bit",
      description: "Chiffrement maximum"
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: "AES-256",
      description: "Données cryptées"
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "PCI DSS",
      description: "Norme bancaire"
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "RGPD",
      description: "Confidentialité"
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/50 dark:via-emerald-950/50 dark:to-teal-950/50 border-green-200 dark:border-green-800 p-4">
      <div className="flex items-center justify-center space-x-8">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-green-600" />
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            Sécurité Maximale Garantie
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="text-green-600">
                {feature.icon}
              </div>
              <div className="flex flex-col">
                <Badge variant="outline" className="text-xs border-green-300 text-green-700 dark:text-green-300 mb-1">
                  {feature.title}
                </Badge>
                <span className="text-xs text-green-600 dark:text-green-400">
                  {feature.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SecurityBanner;
