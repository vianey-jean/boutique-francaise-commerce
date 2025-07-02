
const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripe.service');
const { authenticateToken } = require('../middlewares/stripeAuth');

// Route publique pour créer une session de checkout (accessible sans authentification)
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, saveCard = false } = req.body;
    
    console.log('Données reçues pour la session Stripe:', {
      items: items?.length || 0,
      totalAmount,
      saveCard
    });

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Le montant total TTC est requis et doit être supérieur à 0'
      });
    }

    // Si l'utilisateur est authentifié, utiliser ses informations
    let userId = 'guest';
    let userEmail = 'guest@example.com';
    
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      try {
        const jwt = require('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        userId = decoded.id;
        userEmail = decoded.email;
      } catch (authError) {
        console.log('Utilisateur non authentifié, utilisation du mode invité');
      }
    }
    
    console.log('Création session Stripe pour:', userId === 'guest' ? 'invité' : `utilisateur ${userId}`);
    console.log('Montant total TTC à débiter:', totalAmount, '€');

    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'http://localhost:8080';
    
    const session = await stripeService.createCheckoutSession({
      items,
      shippingAddress,
      userId,
      userEmail,
      saveCard: userId !== 'guest' ? saveCard : false, // Pas de sauvegarde pour les invités
      origin,
      totalAmount // Passer le total TTC directement
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

// Vérifier le statut d'une session (accessible sans authentification)
router.get('/verify-session/:sessionId', async (req, res) => {
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

// Récupérer les cartes sauvegardées (nécessite authentification)
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

// Créer un paiement avec une carte sauvegardée (nécessite authentification)
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

// Supprimer une carte sauvegardée (nécessite authentification)
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
