
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middlewares/auth');

const panierFilePath = path.join(__dirname, '../data/panier.json');

// Initialize panier file if it doesn't exist
if (!fs.existsSync(panierFilePath)) {
  fs.writeFileSync(panierFilePath, JSON.stringify({}), 'utf8');
}

// Middleware to get cart
const getCart = (req, res, next) => {
  try {
    const carts = JSON.parse(fs.readFileSync(panierFilePath, 'utf8'));
    const userId = req.user.id;
    if (!carts[userId]) {
      carts[userId] = { items: [], total: 0 };
    }
    req.cart = carts[userId];
    req.allCarts = carts;
    next();
  } catch (error) {
    console.error('Error reading cart file:', error);
    res.status(500).json({ message: 'Error reading cart data' });
  }
};

// Get user cart
router.get('/', auth, getCart, (req, res) => {
  res.json(req.cart);
});

// Add item to cart
router.post('/items', auth, getCart, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const userId = req.user.id;
    const carts = req.allCarts;
    
    // Get product info from products.json
    const productsFilePath = path.join(__dirname, '../data/products.json');
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is already in cart
    const existingItem = req.cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
      // Update quantity if product exists
      existingItem.quantity += parseInt(quantity);
    } else {
      // Add new item if product doesn't exist
      req.cart.items.push({
        productId,
        quantity: parseInt(quantity),
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
    
    // Update total
    req.cart.total = req.cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    carts[userId] = req.cart;
    
    fs.writeFileSync(panierFilePath, JSON.stringify(carts, null, 2), 'utf8');
    res.status(200).json(req.cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item
router.put('/items', auth, getCart, (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const userId = req.user.id;
    const carts = req.allCarts;
    
    // Find item in cart
    const itemIndex = req.cart.items.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Update quantity
    req.cart.items[itemIndex].quantity = parseInt(quantity);
    
    // Update total
    req.cart.total = req.cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    carts[userId] = req.cart;
    
    fs.writeFileSync(panierFilePath, JSON.stringify(carts, null, 2), 'utf8');
    res.status(200).json(req.cart);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/items/:productId', auth, getCart, (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const carts = req.allCarts;
    
    // Remove item from cart
    req.cart.items = req.cart.items.filter(item => item.productId !== productId);
    
    // Update total
    req.cart.total = req.cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    carts[userId] = req.cart;
    
    fs.writeFileSync(panierFilePath, JSON.stringify(carts, null, 2), 'utf8');
    res.status(200).json(req.cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/', auth, getCart, (req, res) => {
  try {
    const userId = req.user.id;
    const carts = req.allCarts;
    
    // Clear cart
    req.cart.items = [];
    req.cart.total = 0;
    
    carts[userId] = req.cart;
    
    fs.writeFileSync(panierFilePath, JSON.stringify(carts, null, 2), 'utf8');
    res.status(200).json(req.cart);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
