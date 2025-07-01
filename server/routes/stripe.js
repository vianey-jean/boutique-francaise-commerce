
const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripe.service');
const { authenticateToken } = require('../config/auth');

// Créer une session de checkout Stripe
router.post('/create-checkout', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'eur' } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Montant invalide' 
      });
    }

    console.log(`Création d'une session de checkout pour ${amount} centimes`);

    // Créer la session de checkout
    const session = await stripeService.createCheckoutSession(amount, currency);
    
    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Erreur lors de la création de la session checkout:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création de la session de paiement',
      error: error.message 
    });
  }
});

module.exports = router;
