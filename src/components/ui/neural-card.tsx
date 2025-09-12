import React from 'react';
import { cn } from '@/lib/utils';

interface NeuralCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'cyber' | 'hologram';
  children: React.ReactNode;
  glow?: boolean;
  animated?: boolean;
}

const NeuralCard = React.forwardRef<HTMLDivElement, NeuralCardProps>(
  ({ className, variant = 'default', children, glow = false, animated = false, ...props }, ref) => {
    const variants = {
      default: 'neural-card',
      glass: 'glass-card',
      cyber: 'neo-card bg-cyber-grid',
      hologram: 'neural-card bg-hologram-mesh'
    };

    const glowClass = glow ? 'cyber-glow' : '';
    const animatedClass = animated ? 'neural-hover animate-neural-pulse' : '';

    return (
      <div
        ref={ref}
        className={cn(
          variants[variant], 
          glowClass, 
          animatedClass, 
          className
        )}
        {...props}
      >
        {children}
        {variant === 'cyber' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-data-flow" />
            <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent animate-data-flow" style={{ animationDelay: '1s' }} />
          </div>
        )}
      </div>
    );
  }
);

NeuralCard.displayName = 'NeuralCard';

export { NeuralCard };