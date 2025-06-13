
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'eur' } = await req.json();
    
    // Initialiser Stripe avec la clé secrète
    const stripe = new Stripe('sk_test_51RJ8CjRrys1rHLYCufNnUZpE28RRZi6cma9z9n2gHjvqllhhl0gFmtGzIJ70DDu7040SVjN6qsuCZK2ZEiT7CmjE00GMEQVOkC', {
      apiVersion: "2023-10-16",
    });

    // Créer une session de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency,
          product_data: {
            name: 'Commande Riziky Boutique',
            description: `Paiement de ${(amount / 100).toFixed(2)}€`,
          },
          unit_amount: Math.round(amount), // Montant en centimes
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      metadata: {
        order_id: `order_${Date.now()}`,
      },
    });

    return new Response(JSON.stringify({ 
      sessionId: session.id,
      url: session.url 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    console.error('Erreur Stripe:', error);
    return new Response(JSON.stringify({ 
      error: error.message || "Erreur lors de la création de la session de paiement" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
