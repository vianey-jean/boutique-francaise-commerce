
import React from 'react';
import { Shield, CheckCircle, Lock, Database, Eye, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SecurityStatus: React.FC = () => {
  const securityChecks = [
    {
      icon: <Shield className="h-4 w-4" />,
      label: "SSL/TLS 256-bit",
      status: "Actif",
      color: "green"
    },
    {
      icon: <Database className="h-4 w-4" />,
      label: "Cryptage AES-256",
      status: "Actif", 
      color: "green"
    },
    {
      icon: <Lock className="h-4 w-4" />,
      label: "Protection XSS",
      status: "Actif",
      color: "green"
    },
    {
      icon: <Eye className="h-4 w-4" />,
      label: "Conformité RGPD",
      status: "Certifié",
      color: "blue"
    },
    {
      icon: <Award className="h-4 w-4" />,
      label: "PCI DSS Level 1",
      status: "Certifié",
      color: "purple"
    }
  ];

  return (
    <Card className="p-4 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          État de la Sécurité
        </h3>
        <CheckCircle className="h-4 w-4 text-green-600" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {securityChecks.map((check, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700">
            <div className="flex items-center space-x-2">
              <div className={`text-${check.color}-600`}>
                {check.icon}
              </div>
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                {check.label}
              </span>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs border-${check.color}-300 text-${check.color}-700 dark:text-${check.color}-300`}
            >
              {check.status}
            </Badge>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-xs font-medium text-green-800 dark:text-green-200">
            Toutes les vérifications de sécurité sont réussies
          </span>
        </div>
      </div>
    </Card>
  );
};

export default SecurityStatus;
