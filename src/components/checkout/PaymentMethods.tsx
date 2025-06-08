
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Banknote, Shield, Lock, Star } from 'lucide-react';
import visaLogo from '@/assets/visa.png';
import mastercardLogo from '@/assets/mastercard.png';
import paypalLogo from '@/assets/paypal.png';
import applepayLogo from '@/assets/applepay.png';

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  isDisabled?: boolean;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  selectedMethod, 
  onMethodChange,
  isDisabled = false 
}) => {
  return (
    <div className="bg-gradient-to-br from-white via-white to-neutral-50 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-900 p-8 rounded-3xl shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-green-50/30 dark:from-blue-900/10 dark:to-green-900/10 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
              Mode de paiement
            </h2>
            <Lock className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">Choisissez votre méthode de paiement sécurisée</p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
        </div>
        
        <RadioGroup value={selectedMethod} onValueChange={onMethodChange} disabled={isDisabled}>
          <div className="flex flex-col space-y-4">
            
            {/* Card Payment */}
            <div className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
              selectedMethod === 'card' 
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg scale-[1.02]' 
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
            }`}>
              <div className="flex items-center space-x-4 p-6">
                <RadioGroupItem value="card" id="card" className="border-2" />
                <Label htmlFor="card" className="flex-grow cursor-pointer flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-neutral-800 dark:text-white">Carte bancaire</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Paiement sécurisé par cryptage SSL</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <img src={visaLogo} alt="Visa" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
                    <img src={mastercardLogo} alt="Mastercard" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </Label>
              </div>
              {selectedMethod === 'card' && (
                <div className="px-6 pb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Vous serez redirigé vers notre page de paiement sécurisé</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PayPal */}
            <div className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
              selectedMethod === 'paypal' 
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-yellow-50 dark:from-blue-900/20 dark:to-yellow-900/20 shadow-lg scale-[1.02]' 
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
            }`}>
              <div className="flex items-center space-x-4 p-6">
                <RadioGroupItem value="paypal" id="paypal" className="border-2" />
                <Label htmlFor="paypal" className="flex-grow cursor-pointer flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <img src={paypalLogo} alt="PayPal" className="h-6" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-neutral-800 dark:text-white">PayPal</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Protection acheteur garantie</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600">Populaire</span>
                  </div>
                </Label>
              </div>
              {selectedMethod === 'paypal' && (
                <div className="px-6 pb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-yellow-50 dark:from-blue-900/30 dark:to-yellow-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Vous serez redirigé vers PayPal pour finaliser votre paiement</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Apple Pay */}
            <div className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
              selectedMethod === 'applepay' 
                ? 'border-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 shadow-lg scale-[1.02]' 
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-md'
            }`}>
              <div className="flex items-center space-x-4 p-6">
                <RadioGroupItem value="applepay" id="applepay" className="border-2" />
                <Label htmlFor="applepay" className="flex-grow cursor-pointer flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <img src={applepayLogo} alt="Apple Pay" className="h-6" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-neutral-800 dark:text-white">Apple Pay</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Paiement rapide et sécurisé</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Express</span>
                  </div>
                </Label>
              </div>
              {selectedMethod === 'applepay' && (
                <div className="px-6 pb-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-400">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Paiement sécurisé avec Touch ID ou Face ID</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Cash on Delivery */}
            <div className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
              selectedMethod === 'cash' 
                ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg scale-[1.02]' 
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md'
            }`}>
              <div className="flex items-center space-x-4 p-6">
                <RadioGroupItem value="cash" id="cash" className="border-2" />
                <Label htmlFor="cash" className="flex-grow cursor-pointer flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <Banknote className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-neutral-800 dark:text-white">Paiement à la livraison</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Payez en espèces au livreur</p>
                    </div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                    Pas de frais
                  </div>
                </Label>
              </div>
              {selectedMethod === 'cash' && (
                <div className="px-6 pb-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                      <Banknote className="h-4 w-4" />
                      <span className="text-sm font-medium">Préparez le montant exact si possible. Aucun frais supplémentaire.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </RadioGroup>

        {/* Security Info */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-2xl border border-green-200/50 dark:border-green-800/50">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Cryptage SSL 256-bit</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
              <Lock className="h-4 w-4" />
              <span className="font-medium">Paiement sécurisé</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400">
              <Star className="h-4 w-4" />
              <span className="font-medium">Protection acheteur</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
