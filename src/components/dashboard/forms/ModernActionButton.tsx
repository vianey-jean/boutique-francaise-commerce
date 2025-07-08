
import React, { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ModernActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  gradient?: 'blue' | 'green' | 'red' | 'purple' | 'indigo' | 'orange' | 'pink' | 'yellow' | 'teal' | 'cyan' | 'neutral';
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
}

const ModernActionButton = forwardRef<HTMLButtonElement, ModernActionButtonProps>(
  ({ variant = 'solid', gradient = 'blue', buttonSize = 'md', icon: Icon, children, className, ...props }, ref) => {
    const gradientClasses = {
      blue: {
        solid: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white',
        outline: 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50',
        ghost: 'text-blue-600 hover:bg-blue-50'
      },
      green: {
        solid: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white',
        outline: 'border-2 border-green-500 text-green-600 hover:bg-green-50',
        ghost: 'text-green-600 hover:bg-green-50'
      },
      red: {
        solid: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
        outline: 'border-2 border-red-500 text-red-600 hover:bg-red-50',
        ghost: 'text-red-600 hover:bg-red-50'
      },
      purple: {
        solid: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white',
        outline: 'border-2 border-purple-500 text-purple-600 hover:bg-purple-50',
        ghost: 'text-purple-600 hover:bg-purple-50'
      },
      indigo: {
        solid: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white',
        outline: 'border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50',
        ghost: 'text-indigo-600 hover:bg-indigo-50'
      },
      orange: {
        solid: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white',
        outline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50',
        ghost: 'text-orange-600 hover:bg-orange-50'
      },
      pink: {
        solid: 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white',
        outline: 'border-2 border-pink-500 text-pink-600 hover:bg-pink-50',
        ghost: 'text-pink-600 hover:bg-pink-50'
      },
      yellow: {
        solid: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white',
        outline: 'border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50',
        ghost: 'text-yellow-600 hover:bg-yellow-50'
      },
      teal: {
        solid: 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white',
        outline: 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50',
        ghost: 'text-teal-600 hover:bg-teal-50'
      },
      cyan: {
        solid: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white',
        outline: 'border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50',
        ghost: 'text-cyan-600 hover:bg-cyan-50'
      },
      neutral: {
        solid: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white',
        outline: 'border-2 border-gray-500 text-gray-600 hover:bg-gray-50',
        ghost: 'text-gray-600 hover:bg-gray-50'
      }
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl'
    };

    return (
      <Button
        ref={ref}
        className={cn(
          'font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2',
          gradientClasses[gradient][variant],
          sizeClasses[buttonSize],
          className
        )}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {children}
      </Button>
    );
  }
);

ModernActionButton.displayName = 'ModernActionButton';

export default ModernActionButton;
