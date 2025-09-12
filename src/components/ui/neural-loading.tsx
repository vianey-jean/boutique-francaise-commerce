import React from 'react';
import { cn } from '@/lib/utils';

interface NeuralLoadingProps {
  variant?: 'spinner' | 'pulse' | 'wave' | 'matrix';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NeuralLoading: React.FC<NeuralLoadingProps> = ({ 
  variant = 'spinner', 
  size = 'md',
  className 
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const variants = {
    spinner: (
      <div className={cn('relative', sizes[size])}>
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        <div className="absolute inset-1 rounded-full border border-secondary/40 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      </div>
    ),
    pulse: (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-6 bg-neural-gradient rounded-full animate-neural-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    ),
    wave: (
      <div className={cn('flex items-center space-x-1', className)}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1 bg-neural-gradient rounded-full animate-neural-wave"
            style={{ 
              height: `${16 + (i % 2) * 8}px`,
              animationDelay: `${i * 0.1}s` 
            }}
          />
        ))}
      </div>
    ),
    matrix: (
      <div className={cn('grid grid-cols-3 gap-1', sizes[size])}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="bg-neural-primary rounded-sm animate-pulse"
            style={{ 
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    )
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {variants[variant]}
    </div>
  );
};

export { NeuralLoading };