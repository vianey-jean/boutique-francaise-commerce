
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeService {
  // Créer ou récupérer un client Stripe
  async getOrCreateCustomer(email, shippingAddress) {
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      console.log('Client Stripe existant trouvé:', existingCustomers.data[0].id);
      return existingCustomers.data[0];
    }

    const customer = await stripe.customers.create({
      email: email,
      name: `${shippingAddress.prenom} ${shippingAddress.nom}`,
      phone: shippingAddress.telephone,
      address: {
        line1: shippingAddress.adresse,
        city: shippingAddress.ville,
        postal_code: shippingAddress.codePostal,
        country: 'RE',
      }
    });

    console.log('Nouveau client Stripe créé:', customer.id);
    return customer;
  }

  // Créer une session de checkout
  async createCheckoutSession({ items, shippingAddress, userId, userEmail, saveCard, origin }) {
    const customer = await this.getOrCreateCustomer(userEmail, shippingAddress);

    const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/checkout/cancel`;

    const sessionConfig = {
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            images: item.image ? [`${process.env.BASE_URL || origin}${item.image}`] : []
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
        orderId: `temp-${Date.now()}`
      }
    };

    if (saveCard) {
      sessionConfig.payment_intent_data = {
        setup_future_usage: 'off_session'
      };
    }

    return await stripe.checkout.sessions.create(sessionConfig);
  }

  // Récupérer les cartes sauvegardées
  async getSavedCards(email) {
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    if (customers.data.length === 0) {
      return [];
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customers.data[0].id,
      type: 'card',
    });

    return paymentMethods.data.slice(0, 6).map(pm => ({
      id: pm.id,
      brand: pm.card.brand,
      last4: pm.card.last4,
      exp_month: pm.card.exp_month,
      exp_year: pm.card.exp_year,
      isDefault: false
    }));
  }

  // Payer avec une carte sauvegardée
  async payWithSavedCard({ paymentMethodId, items, shippingAddress, deliveryPrice = 0 }) {
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxAmount = totalAmount * 0.20;
    const finalAmount = Math.round((totalAmount + taxAmount + deliveryPrice) * 100);

    return await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'eur',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: `${process.env.BASE_URL || 'http://localhost:8080'}/checkout/success`
    });
  }

  // Supprimer une carte sauvegardée
  async deleteSavedCard(cardId) {
    return await stripe.paymentMethods.detach(cardId);
  }

  // Vérifier le statut d'une session
  async verifySession(sessionId) {
    return await stripe.checkout.sessions.retrieve(sessionId);
  }
}

module.exports = new StripeService();
