
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import PasswordStrengthIndicator from '../auth/PasswordStrengthIndicator';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
  newPassword: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
  confirmPassword: z.string().min(1, 'Veuillez confirmer votre mot de passe'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const PasswordForm = () => {
  const { user, updateUserPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const watchNewPassword = watch('newPassword');

  // Calculate password strength
  React.useEffect(() => {
    if (!watchNewPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (watchNewPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(watchNewPassword)) strength += 1;
    if (/[a-z]/.test(watchNewPassword)) strength += 1;
    if (/[0-9]/.test(watchNewPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(watchNewPassword)) strength += 1;

    setPasswordStrength(strength);
  }, [watchNewPassword]);

  const onSubmit = async (data: PasswordFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updateUserPassword(data.currentPassword, data.newPassword);
      toast.success('Mot de passe mis à jour avec succès');
      reset();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
        <Input
          id="currentPassword"
          type="password"
          {...register('currentPassword')}
          className={errors.currentPassword ? 'border-red-500' : ''}
        />
        {errors.currentPassword && (
          <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <Input
          id="newPassword"
          type="password"
          {...register('newPassword')}
          className={errors.newPassword ? 'border-red-500' : ''}
        />
        {watchNewPassword && <PasswordStrengthIndicator strength={passwordStrength} />}
        {errors.newPassword && (
          <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className={errors.confirmPassword ? 'border-red-500' : ''}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
      </Button>
    </form>
  );
};

export default PasswordForm;
