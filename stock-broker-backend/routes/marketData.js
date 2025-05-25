const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get market data for a specific symbol
router.get('/:symbol', auth, async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    
    // Here you would typically integrate with a real market data API
    // For now, we'll return mock data
    const mockData = {
      symbol: symbol,
      price: Math.random() * 1000,
      change: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 1000000)
    };

    res.json(mockData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get market data for multiple symbols
router.post('/batch', auth, async (req, res) => {
  try {
    const { symbols } = req.body;
    
    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ msg: 'Please provide an array of symbols' });
    }

    const marketData = symbols.map(symbol => ({
      symbol: symbol.toUpperCase(),
      price: Math.random() * 1000,
      change: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 1000000)
    }));

    res.json(marketData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
