
const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripe.service');
const { authenticateToken } = require('../middlewares/stripeAuth');

// Créer une session de checkout
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress, saveCard = false } = req.body;
    const userId = req.user.id;
    
    console.log('Création session Stripe pour utilisateur:', userId);

    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'http://localhost:8080';
    
    const session = await stripeService.createCheckoutSession({
      items,
      shippingAddress,
      userId,
      userEmail: req.user.email,
      saveCard,
      origin
    });

    console.log('Session Stripe créée avec succès:', session.id);

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Erreur création session Stripe:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Vérifier le statut d'une session
router.get('/verify-session/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log('Vérification session:', sessionId);
    
    const session = await stripeService.verifySession(sessionId);
    
    console.log('Statut session:', session.payment_status);
    
    res.json({
      success: session.payment_status === 'paid',
      session: session,
      payment_status: session.payment_status
    });
  } catch (error) {
    console.error('Erreur vérification session:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Récupérer les cartes sauvegardées
router.get('/saved-cards', authenticateToken, async (req, res) => {
  try {
    console.log('Récupération cartes pour utilisateur:', req.user.email);
    
    const cards = await stripeService.getSavedCards(req.user.email);

    console.log(`${cards.length} cartes trouvées`);
    res.json({ cards });
  } catch (error) {
    console.error('Erreur récupération cartes:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Créer un paiement avec une carte sauvegardée
router.post('/pay-with-saved-card', authenticateToken, async (req, res) => {
  try {
    const { paymentMethodId, items, shippingAddress } = req.body;
    
    const paymentIntent = await stripeService.payWithSavedCard({
      paymentMethodId,
      items,
      shippingAddress,
      deliveryPrice: req.body.deliveryPrice || 0
    });

    res.json({
      success: paymentIntent.status === 'succeeded',
      paymentIntent: paymentIntent,
      requires_action: paymentIntent.status === 'requires_action',
      client_secret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error('Erreur paiement carte sauvegardée:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Supprimer une carte sauvegardée
router.delete('/saved-cards/:cardId', authenticateToken, async (req, res) => {
  try {
    await stripeService.deleteSavedCard(req.params.cardId);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression carte:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;
