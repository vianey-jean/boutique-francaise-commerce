
import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Heart, Shield, FileText, HelpCircle, Target } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-violet-600 text-white py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-300" />
              <h3 className="text-lg font-bold">Riziky-Agendas</h3>
            </div>
            <p className="text-white/80 text-sm">
              La solution premium pour gérer vos rendez-vous avec élégance et efficacité.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h4 className="font-bold text-white">Liens Rapides</h4>
            <div className="space-y-2">
              <Link to="/dashboard" className="block text-white/80 hover:text-white transition-colors text-sm">
                Tableau de bord
              </Link>
              <Link to="/calendar" className="block text-white/80 hover:text-white transition-colors text-sm">
                Calendrier
              </Link>
              <Link to="/clients" className="block text-white/80 hover:text-white transition-colors text-sm">
                Clients
              </Link>
            </div>
          </div>

          {/* À propos */}
          <div className="space-y-4">
            <h4 className="font-bold text-white">À Propos</h4>
            <div className="space-y-2">
              <Link to="/mission" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <Target className="w-4 h-4" />
                Notre Mission
              </Link>
              <Link to="/about" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <Heart className="w-4 h-4" />
                À Propos
              </Link>
              <Link to="/contact" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <HelpCircle className="w-4 h-4" />
                Contact
              </Link>
            </div>
          </div>

          {/* Légal */}
          <div className="space-y-4">
            <h4 className="font-bold text-white">Légal & Support</h4>
            <div className="space-y-2">
              <Link to="/confidentialite" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <Shield className="w-4 h-4" />
                Confidentialité
              </Link>
              <Link to="/conditions" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <FileText className="w-4 h-4" />
                Conditions d'utilisation
              </Link>
              <Link to="/support" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <HelpCircle className="w-4 h-4" />
                Support
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-white/80 text-sm">
            © 2024 Riziky-Agendas Premium. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
