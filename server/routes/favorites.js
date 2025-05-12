
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middlewares/auth');

const favoritesFilePath = path.join(__dirname, '../data/favorites.json');

// Initialize favorites file if it doesn't exist
if (!fs.existsSync(favoritesFilePath)) {
  fs.writeFileSync(favoritesFilePath, JSON.stringify({}), 'utf8');
}

// Middleware to get favorites
const getFavorites = (req, res, next) => {
  try {
    const favorites = JSON.parse(fs.readFileSync(favoritesFilePath, 'utf8'));
    const userId = req.user.id;
    if (!favorites[userId]) {
      favorites[userId] = { items: [] };
    }
    req.favorites = favorites[userId];
    req.allFavorites = favorites;
    next();
  } catch (error) {
    console.error('Error reading favorites file:', error);
    res.status(500).json({ message: 'Error reading favorites data' });
  }
};

// Get user favorites
router.get('/', auth, getFavorites, (req, res) => {
  res.json(req.favorites);
});

// Add item to favorites
router.post('/', auth, getFavorites, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const userId = req.user.id;
    const favorites = req.allFavorites;
    
    // Check if product is already in favorites
    const productExists = req.favorites.items.find(item => item.id === productId);
    if (productExists) {
      return res.status(400).json({ message: 'Product already in favorites' });
    }

    // Get product info from products.json
    const productsFilePath = path.join(__dirname, '../data/products.json');
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add product to favorites
    req.favorites.items.push(product);
    favorites[userId] = req.favorites;
    
    fs.writeFileSync(favoritesFilePath, JSON.stringify(favorites, null, 2), 'utf8');
    res.status(200).json(req.favorites);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from favorites
router.delete('/:productId', auth, getFavorites, (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    const favorites = req.allFavorites;
    
    // Remove product from favorites
    req.favorites.items = req.favorites.items.filter(item => item.id !== productId);
    favorites[userId] = req.favorites;
    
    fs.writeFileSync(favoritesFilePath, JSON.stringify(favorites, null, 2), 'utf8');
    res.status(200).json(req.favorites);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
