const Stripe = require('stripe');

class StripeService {
  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(amount, currency = 'eur', customerId = null) {
    try {
      console.log(`Creating PaymentIntent for ${amount} cents`);
      
      const paymentIntentData = {
        amount: Math.round(amount), // Montant en centimes
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
        setup_future_usage: 'off_session', // Permet la sauvegarde de carte
      };

      if (customerId) {
        paymentIntentData.customer = customerId;
      }

      const paymentIntent = await this.stripe.paymentIntents.create(paymentIntentData);
      
      console.log(`PaymentIntent created successfully: ${paymentIntent.id}`);
      
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Error creating PaymentIntent:', error);
      throw new Error(`Failed to create PaymentIntent: ${error.message}`);
    }
  }

  async createCheckoutSession(amount, currency = 'eur', successUrl, cancelUrl) {
    try {
      console.log(`Creating checkout session for ${amount} cents`);
      
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: 'Commande Riziky Boutique',
                description: 'Produits capillaires premium'
              },
              unit_amount: Math.round(amount), // Montant en centimes
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: ['FR', 'RE'],
        }
      });

      console.log(`Checkout session created: ${session.id}`);
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error(`Failed to create checkout session: ${error.message}`);
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
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  async getPaymentIntent(paymentIntentId) {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Error retrieving PaymentIntent:', error);
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
      console.error('Error creating Stripe customer:', error);
      throw error;
    }
  }

  async getCustomer(customerId) {
    try {
      return await this.stripe.customers.retrieve(customerId);
    } catch (error) {
      console.error('Error retrieving customer:', error);
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
      console.error('Error creating SetupIntent:', error);
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
      console.error('Error retrieving payment methods:', error);
      throw error;
    }
  }

  async deletePaymentMethod(paymentMethodId) {
    try {
      return await this.stripe.paymentMethods.detach(paymentMethodId);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }
}

module.exports = new StripeService();
