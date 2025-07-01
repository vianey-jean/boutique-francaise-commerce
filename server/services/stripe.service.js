
const Stripe = require('stripe');

class StripeService {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(amount, currency = 'eur', customerId = null) {
    try {
      const paymentIntentData = {
        amount: Math.round(amount), // Montant en centimes
        currency: currency,
        automatic_payment_methods: {
          enabled: true,
        },
        confirmation_method: 'manual',
        confirm: false,
      };

      if (customerId) {
        paymentIntentData.customer = customerId;
      }

      const paymentIntent = await this.stripe.paymentIntents.create(paymentIntentData);
      
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Erreur lors de la création du PaymentIntent:', error);
      throw error;
    }
  }

  async createCheckoutSession(amount, currency = 'eur') {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: 'Commande',
              },
              unit_amount: Math.round(amount), // Montant en centimes
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout`,
      });

      return session;
    } catch (error) {
      console.error('Erreur lors de la création de la session checkout:', error);
      throw error;
    }
  }

  async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
        return_url: `${process.env.CLIENT_URL}/payment-success`
      });

      return paymentIntent;
    } catch (error) {
      console.error('Erreur lors de la confirmation du paiement:', error);
      throw error;
    }
  }

  async getPaymentIntent(paymentIntentId) {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Erreur lors de la récupération du PaymentIntent:', error);
      throw error;
    }
  }

  async createCustomer(email, name) {
    try {
      return await this.stripe.customers.create({
        email: email,
        name: name
      });
    } catch (error) {
      console.error('Erreur lors de la création du client Stripe:', error);
      throw error;
    }
  }

  async getCustomer(customerId) {
    try {
      return await this.stripe.customers.retrieve(customerId);
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      throw error;
    }
  }

  async createSetupIntent(customerId) {
    try {
      return await this.stripe.setupIntents.create({
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la création du SetupIntent:', error);
      throw error;
    }
  }

  async listPaymentMethods(customerId) {
    try {
      return await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des méthodes de paiement:', error);
      throw error;
    }
  }

  async deletePaymentMethod(paymentMethodId) {
    try {
      return await this.stripe.paymentMethods.detach(paymentMethodId);
    } catch (error) {
      console.error('Erreur lors de la suppression de la méthode de paiement:', error);
      throw error;
    }
  }
}

module.exports = new StripeService();
