import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw, ArrowLeft, Zap } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

interface ErrorPageProps {
  errorCode?: string;
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  errorCode = "404",
  title = "Page introuvable",
  message = "La page que vous recherchez n'existe pas ou a été déplacée.",
  showBackButton = true
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(`${errorCode} Error: User attempted to access:`, location.pathname);
  }, [location.pathname, errorCode]);

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20,
        duration: 0.8
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl"
      >
        <Card className="card-3d bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl p-8 md:p-12">
          <div className="text-center space-y-8">
            {/* Error Icon */}
            <motion.div
              variants={iconVariants}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    y: [-10, 10, -10],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.6, 1]
                  }}
                  className="bg-gradient-to-br from-destructive/20 to-destructive/10 p-6 rounded-full"
                >
                  <AlertTriangle className="w-16 h-16 text-destructive" />
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-destructive/20 rounded-full blur-xl"
                />
              </div>
            </motion.div>

            {/* Error Code */}
            <motion.div variants={itemVariants} className="space-y-2">
              <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-none">
                {errorCode}
              </h1>
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Erreur détectée
                </span>
                <Zap className="w-4 h-4 text-primary animate-pulse" />
              </div>
            </motion.div>

            {/* Title and Message */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                {title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                {message}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={handleGoHome}
                size="lg"
                className="btn-3d bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-all duration-300"
              >
                <Home className="w-5 h-5 mr-2" />
                Retour à l'accueil
              </Button>

              {showBackButton && (
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  size="lg"
                  className="btn-3d border-2 border-border hover:border-primary/50 hover:bg-accent font-semibold px-8 py-3 rounded-lg transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Page précédente
                </Button>
              )}

              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="lg"
                className="btn-3d hover:bg-muted font-semibold px-8 py-3 rounded-lg transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Actualiser
              </Button>
            </motion.div>

            {/* Additional Info */}
            <motion.div variants={itemVariants} className="pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Si le problème persiste, contactez notre équipe de support.
              </p>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground/60">
                <span>Code d'erreur: {errorCode}</span>
                <span>•</span>
                <span>Timestamp: {new Date().toLocaleTimeString()}</span>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ErrorPage;