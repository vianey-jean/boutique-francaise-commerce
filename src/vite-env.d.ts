
/// <reference types="vite/client" />

// Stripe types
declare global {
  interface Window {
    Stripe?: (key: string) => any;
    ApplePaySession?: typeof ApplePaySession;
  }
}

declare class ApplePaySession {
  static canMakePayments(): boolean;
  static canMakePaymentsWithActiveCard(merchantIdentifier: string): Promise<boolean>;
  static supportsVersion(version: number): boolean;
  
  constructor(version: number, paymentRequest: ApplePayJS.ApplePayPaymentRequest);
  
  begin(): void;
  abort(): void;
  completeMerchantValidation(merchantSession: any): void;
  completePaymentMethodSelection(update: ApplePayJS.ApplePayPaymentMethodUpdate): void;
  completeShippingContactSelection(update: ApplePayJS.ApplePayShippingContactUpdate): void;
  completeShippingMethodSelection(update: ApplePayJS.ApplePayShippingMethodUpdate): void;
  completePayment(result: ApplePayJS.ApplePayPaymentAuthorizationResult): void;
  
  onvalidatemerchant: (event: ApplePayJS.ApplePayValidateMerchantEvent) => void;
  onpaymentmethodselected: (event: ApplePayJS.ApplePayPaymentMethodSelectedEvent) => void;
  onshippingcontactselected: (event: ApplePayJS.ApplePayShippingContactSelectedEvent) => void;
  onshippingmethodselected: (event: ApplePayJS.ApplePayShippingMethodSelectedEvent) => void;
  onpaymentauthorized: (event: ApplePayJS.ApplePayPaymentAuthorizedEvent) => void;
  oncancel: (event: Event) => void;
}

declare namespace ApplePayJS {
  interface ApplePayPaymentRequest {
    countryCode: string;
    currencyCode: string;
    supportedNetworks: string[];
    merchantCapabilities: string[];
    total: ApplePayLineItem;
    lineItems?: ApplePayLineItem[];
    billingContact?: ApplePayPaymentContact;
    shippingContact?: ApplePayPaymentContact;
    applicationData?: string;
  }
  
  interface ApplePayLineItem {
    label: string;
    amount: string;
    type?: 'pending' | 'final';
  }
  
  interface ApplePayPaymentContact {
    phoneNumber?: string;
    emailAddress?: string;
    givenName?: string;
    familyName?: string;
    phoneticGivenName?: string;
    phoneticFamilyName?: string;
    addressLines?: string[];
    locality?: string;
    postalCode?: string;
    administrativeArea?: string;
    country?: string;
    countryCode?: string;
  }
  
  interface ApplePayValidateMerchantEvent {
    validationURL: string;
  }
  
  interface ApplePayPaymentMethodSelectedEvent {
    paymentMethod: ApplePayPaymentMethod;
  }
  
  interface ApplePayShippingContactSelectedEvent {
    shippingContact: ApplePayPaymentContact;
  }
  
  interface ApplePayShippingMethodSelectedEvent {
    shippingMethod: ApplePayShippingMethod;
  }
  
  interface ApplePayPaymentAuthorizedEvent {
    payment: ApplePayPayment;
  }
  
  interface ApplePayPaymentMethod {
    displayName: string;
    network: string;
    type: string;
  }
  
  interface ApplePayShippingMethod {
    label: string;
    amount: string;
    detail: string;
    identifier: string;
  }
  
  interface ApplePayPayment {
    token: ApplePayPaymentToken;
    billingContact?: ApplePayPaymentContact;
    shippingContact?: ApplePayPaymentContact;
  }
  
  interface ApplePayPaymentToken {
    paymentData: any;
    paymentMethod: ApplePayPaymentMethod;
    transactionIdentifier: string;
  }
  
  interface ApplePayPaymentMethodUpdate {
    newTotal: ApplePayLineItem;
    newLineItems?: ApplePayLineItem[];
  }
  
  interface ApplePayShippingContactUpdate {
    newTotal: ApplePayLineItem;
    newLineItems?: ApplePayLineItem[];
    newShippingMethods?: ApplePayShippingMethod[];
    errors?: ApplePayError[];
  }
  
  interface ApplePayShippingMethodUpdate {
    newTotal: ApplePayLineItem;
    newLineItems?: ApplePayLineItem[];
  }
  
  interface ApplePayPaymentAuthorizationResult {
    status: number;
    errors?: ApplePayError[];
  }
  
  interface ApplePayError {
    code: string;
    message: string;
    contactField?: string;
  }
}

export {};
