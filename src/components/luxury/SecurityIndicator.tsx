
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SecurityIndicator: React.FC = () => {
  const [securityStatus, setSecurityStatus] = useState<'checking' | 'secure' | 'warning'>('checking');
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Simulation de vérification de sécurité
    const timer = setTimeout(() => {
      setSecurityStatus('secure');
    }, 2000);

    // Animation du compteur de visiteurs
    const visitorTimer = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(visitorTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <div className="p-6 space-y-4">
          {/* Status de sécurité */}
          <div className="flex items-center space-x-3">
            <AnimatePresence mode="wait">
              {securityStatus === 'checking' && (
                <motion.div
                  key="checking"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full"
                >
                  <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400 animate-pulse" />
                </motion.div>
              )}
              {securityStatus === 'secure' && (
                <motion.div
                  key="secure"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="bg-green-100 dark:bg-green-900 p-2 rounded-full"
                >
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-white">
                {securityStatus === 'checking' ? 'Vérification...' : 'Connexion Sécurisée'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                SSL 256-bit • HTTPS
              </div>
            </div>
          </div>

          {/* Indicateur de confiance */}
          <div className="flex items-center space-x-3 border-t border-slate-100 dark:border-slate-700 pt-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-800 dark:text-white">
                {visitorCount} personnes consultent
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Site de confiance vérifié
              </div>
            </div>
          </div>

          {/* Badge de protection */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-medium text-purple-800 dark:text-purple-300">
                Données protégées RGPD
              </span>
            </div>
          </div>
        </div>

        {/* Barre de progression de sécurité */}
        <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Niveau de sécurité</span>
            <span className="text-green-600 dark:text-green-400 font-semibold">Maximum</span>
          </div>
          <div className="mt-2 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: securityStatus === 'secure' ? '100%' : '60%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SecurityIndicator;
