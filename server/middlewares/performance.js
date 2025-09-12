const compression = require('compression');
const cache = require('memory-cache');

// Performance middleware
const performanceMiddleware = [
  // Compression
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  })
];

// Cache middleware
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = cache.get(key);

    if (cachedBody) {
      res.send(cachedBody);
      return;
    }

    res.sendResponse = res.send;
    res.send = (body) => {
      cache.put(key, body, duration * 1000);
      res.sendResponse(body);
    };

    next();
  };
};

// Request optimization
const optimizeRequests = (req, res, next) => {
  // Set timeout
  req.setTimeout(30000);
  
  // Optimize headers
  res.setHeader('X-Powered-By', 'Neural-Commerce');
  res.setHeader('Server', 'Neural-Server');
  
  next();
};

module.exports = {
  performanceMiddleware,
  cacheMiddleware,
  optimizeRequests
};