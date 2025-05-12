
import React from 'react';

export interface PersonalInfoFormProps {
  profileData: {
    id?: string;
    nom?: string;
    prenom?: string;
    email?: string;
    genre?: string;
    adresse?: string;
    telephone?: string;
  };
  loading: boolean;
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenreChange: (value: string) => void;
  handleProfileSubmit: (e: React.FormEvent) => void;
}
