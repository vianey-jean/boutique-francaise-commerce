import React from 'react';
import { cn } from '@/lib/utils';

export interface NeuralInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'cyber' | 'glass';
  icon?: React.ReactNode;
}

const NeuralInput = React.forwardRef<HTMLInputElement, NeuralInputProps>(
  ({ className, variant = 'default', type, icon, ...props }, ref) => {
    const variants = {
      default: 'bg-input/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:bg-input/80',
      cyber: 'bg-transparent border-2 border-neural-primary/30 focus:border-neural-primary focus:shadow-cyber',
      glass: 'bg-white/5 backdrop-blur-md border border-white/10 focus:border-white/30 focus:bg-white/10'
    };

    const inputElement = (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          variants[variant],
          icon ? 'pl-12' : '',
          className
        )}
        ref={ref}
        {...props}
      />
    );

    if (icon) {
      return (
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
            {icon}
          </div>
          {inputElement}
        </div>
      );
    }

    return inputElement;
  }
);

NeuralInput.displayName = 'NeuralInput';

export { NeuralInput };