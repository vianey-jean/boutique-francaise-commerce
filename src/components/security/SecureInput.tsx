import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { useSecurity } from './SecurityProvider';
import { cn } from '@/lib/utils';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  validationType?: 'email' | 'phone' | 'text' | 'number';
  onSecureChange?: (value: string) => void;
  showSecurityIndicator?: boolean;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  validationType = 'text',
  onSecureChange,
  showSecurityIndicator = false,
  className,
  onChange,
  value,
  ...props
}) => {
  const { validateInput, sanitizeInput } = useSecurity();
  const [isValid, setIsValid] = useState(true);
  const [securityLevel, setSecurityLevel] = useState<'safe' | 'warning' | 'danger'>('safe');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Sanitize input
    const sanitizedValue = sanitizeInput(rawValue);
    
    // Validate input
    const valid = validateInput(sanitizedValue, validationType);
    setIsValid(valid);
    
    // Determine security level
    if (rawValue !== sanitizedValue) {
      setSecurityLevel('danger');
    } else if (!valid) {
      setSecurityLevel('warning');
    } else {
      setSecurityLevel('safe');
    }
    
    // Call parent onChange with sanitized value
    if (onChange) {
      const event = { ...e, target: { ...e.target, value: sanitizedValue } };
      onChange(event);
    }
    
    // Call secure change callback
    if (onSecureChange) {
      onSecureChange(sanitizedValue);
    }
  }, [validationType, validateInput, sanitizeInput, onChange, onSecureChange]);

  const getSecurityColor = () => {
    switch (securityLevel) {
      case 'safe': return 'border-green-500';
      case 'warning': return 'border-yellow-500';
      case 'danger': return 'border-red-500';
      default: return '';
    }
  };

  const getSecurityIndicator = () => {
    if (!showSecurityIndicator) return null;
    
    switch (securityLevel) {
      case 'safe': return '🔒';
      case 'warning': return '⚠️';
      case 'danger': return '🚨';
      default: return '';
    }
  };

  return (
    <div className="relative">
      <Input
        {...props}
        value={value}
        onChange={handleChange}
        className={cn(
          className,
          !isValid && 'border-red-500',
          showSecurityIndicator && getSecurityColor()
        )}
      />
      {showSecurityIndicator && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">
          {getSecurityIndicator()}
        </div>
      )}
      {!isValid && (
        <div className="text-xs text-red-500 mt-1">
          Valeur invalide pour le type {validationType}
        </div>
      )}
    </div>
  );
};