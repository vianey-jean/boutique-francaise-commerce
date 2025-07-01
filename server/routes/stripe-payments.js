
const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripe.service');
const { authenticateToken } = require('../config/auth');

// Middleware conditionnel d'authentification
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    // Si un token est fourni, on l'authentifie
    return authenticateToken(req, res, next);
  } else {
    // Sinon on continue sans user
    req.user = null;
    next();
  }
};

// Créer un PaymentIntent
router.post('/create-payment-intent', optionalAuth, async (req, res) => {
  try {
    const { amount, currency = 'eur' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Montant invalide' 
      });
    }

    console.log(`Création d'un PaymentIntent pour ${amount} centimes`);

    const result = await stripeService.createPaymentIntent(amount, currency);
    
    res.json({
      success: true,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId
    });

  } catch (error) {
    console.error('Erreur lors de la création du PaymentIntent:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création du paiement',
      error: error.message 
    });
  }
});

// Confirmer un paiement
router.post('/confirm-payment', optionalAuth, async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'PaymentIntent ID requis' 
      });
    }

    const paymentIntent = await stripeService.confirmPaymentIntent(paymentIntentId, paymentMethodId);
    
    res.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    });

  } catch (error) {
    console.error('Erreur lors de la confirmation du paiement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la confirmation du paiement',
      error: error.message 
    });
  }
});

// Vérifier le statut d'un paiement
router.get('/payment-status/:paymentIntentId', optionalAuth, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripeService.getPaymentIntent(paymentIntentId);
    
    res.json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      created: paymentIntent.created
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la vérification du statut',
      error: error.message 
    });
  }
});

// Créer un client Stripe
router.post('/create-customer', optionalAuth, async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email requis' 
      });
    }

    const customer = await stripeService.createCustomer(email, name);
    
    res.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création du client',
      error: error.message 
    });
  }
});

module.exports = router;
