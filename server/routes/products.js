
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middlewares/auth');
const multer = require('multer');

// Configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}.${file.originalname.split('.').pop()}`);
  }
});
const upload = multer({ storage });

const productsFilePath = path.join(__dirname, '../data/products.json');
const favoritesFilePath = path.join(__dirname, '../data/favorites.json');

// Get all products
router.get('/', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    res.json(products);
  } catch (error) {
    console.error('Error reading products file:', error);
    res.status(500).json({ message: 'Error reading products data' });
  }
});

// Get product by ID
router.get('/:id', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error reading products file:', error);
    res.status(500).json({ message: 'Error reading products data' });
  }
});

// Get products by category
router.get('/category/:category', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const filteredProducts = products.filter(p => 
      p.category.toLowerCase() === req.params.category.toLowerCase()
    );
    
    res.json(filteredProducts);
  } catch (error) {
    console.error('Error reading products file:', error);
    res.status(500).json({ message: 'Error reading products data' });
  }
});

// Search products
router.get('/search/:query', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const query = req.params.query.toLowerCase();
    
    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
    
    res.json(filteredProducts);
  } catch (error) {
    console.error('Error reading products file:', error);
    res.status(500).json({ message: 'Error reading products data' });
  }
});

// Get most favorited products
router.get('/most-favorited', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    
    // If favorites file doesn't exist, just return some products
    if (!fs.existsSync(favoritesFilePath)) {
      return res.json(products.slice(0, 8)); 
    }
    
    const favorites = JSON.parse(fs.readFileSync(favoritesFilePath, 'utf8'));
    
    // Count how many times each product appears in favorites
    const productCounts = {};
    
    Object.values(favorites).forEach(userFavorites => {
      if (userFavorites.items && Array.isArray(userFavorites.items)) {
        userFavorites.items.forEach(item => {
          if (item.id) {
            productCounts[item.id] = (productCounts[item.id] || 0) + 1;
          }
        });
      }
    });
    
    // Sort products by count
    const sortedProducts = [...products].sort((a, b) => {
      const countA = productCounts[a.id] || 0;
      const countB = productCounts[b.id] || 0;
      return countB - countA;
    });
    
    res.json(sortedProducts.slice(0, 8));
  } catch (error) {
    console.error('Error getting most favorited products:', error);
    res.status(500).json({ message: 'Error getting most favorited products' });
  }
});

// Get new arrivals
router.get('/new-arrivals', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    
    // Sort products by date, newest first
    const sortedProducts = [...products].sort((a, b) => {
      const dateA = a.dateAjout ? new Date(a.dateAjout) : new Date(0);
      const dateB = b.dateAjout ? new Date(b.dateAjout) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    
    res.json(sortedProducts.slice(0, 8));
  } catch (error) {
    console.error('Error getting new arrivals:', error);
    res.status(500).json({ message: 'Error getting new arrivals' });
  }
});

// Create product - Admin only
router.post('/', auth, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    
    const newProduct = {
      id: Date.now().toString(),
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      image: req.body.image || '/uploads/placeholder.jpg',
      category: req.body.category,
      stock: parseInt(req.body.stock) || 0,
      isSold: req.body.stock > 0,
      dateAjout: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    // Add promotion if it exists
    if (req.body.promotion) {
      newProduct.promotion = parseFloat(req.body.promotion);
      newProduct.originalPrice = newProduct.price;
      newProduct.price = newProduct.price * (1 - (newProduct.promotion / 100));
    }
    
    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update product - Admin only
router.put('/:id', auth, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const index = products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const updatedProduct = {
      ...products[index],
      name: req.body.name || products[index].name,
      description: req.body.description || products[index].description,
      price: parseFloat(req.body.price) || products[index].price,
      image: req.body.image || products[index].image,
      category: req.body.category || products[index].category,
      stock: parseInt(req.body.stock) || products[index].stock,
      isSold: parseInt(req.body.stock) > 0,
      updatedAt: new Date().toISOString()
    };
    
    // Update promotion if it exists
    if (req.body.promotion) {
      updatedProduct.promotion = parseFloat(req.body.promotion);
      updatedProduct.originalPrice = parseFloat(req.body.originalPrice) || updatedProduct.price;
      updatedProduct.price = updatedProduct.originalPrice * (1 - (updatedProduct.promotion / 100));
    }
    
    products[index] = updatedProduct;
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete product - Admin only
router.delete('/:id', auth, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const filteredProducts = products.filter(p => p.id !== req.params.id);
    
    if (filteredProducts.length === products.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    fs.writeFileSync(productsFilePath, JSON.stringify(filteredProducts, null, 2), 'utf8');
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Update product stock - Admin only
router.put('/:id/stock', auth, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const { stock } = req.body;
    if (stock === undefined) {
      return res.status(400).json({ message: 'Stock is required' });
    }
    
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    const index = products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    products[index].stock = parseInt(stock);
    products[index].isSold = parseInt(stock) > 0;
    products[index].updatedAt = new Date().toISOString();
    
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
    
    res.json(products[index]);
  } catch (error) {
    console.error('Error updating product stock:', error);
    res.status(500).json({ message: 'Error updating product stock' });
  }
});

module.exports = router;
