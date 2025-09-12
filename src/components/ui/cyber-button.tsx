import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'neural' | 'neon' | 'ghost' | 'hologram';
  size?: 'sm' | 'default' | 'lg' | 'xl';
  loading?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, glow = false, children, disabled, ...props }, ref) => {
    const variants = {
      default: 'cyber-button group',
      neural: 'bg-neural-gradient text-white shadow-neural hover:shadow-glow',
      neon: 'bg-transparent border-2 border-neural-primary text-neural-primary hover:bg-neural-primary hover:text-background shadow-neon',
      ghost: 'text-neural-primary hover:bg-neural-primary/10 border border-neural-primary/20',
      hologram: 'bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md border border-white/20 text-foreground hover:from-primary/30 hover:via-secondary/30 hover:to-accent/30'
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm rounded-lg',
      default: 'h-11 px-6 rounded-xl',
      lg: 'h-12 px-8 text-lg rounded-xl',
      xl: 'h-14 px-10 text-xl rounded-2xl'
    };

    const glowClass = glow ? 'animate-glow-pulse' : '';

    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden transform hover:scale-105 active:scale-95',
          variants[variant],
          sizes[size],
          glowClass,
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {variant === 'default' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        )}
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <span className="relative z-10">{children}</span>
        {variant === 'neon' && (
          <div className="absolute inset-0 bg-neural-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        )}
      </button>
    );
  }
);

CyberButton.displayName = 'CyberButton';

export { CyberButton };