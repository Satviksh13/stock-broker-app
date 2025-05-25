const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Place order
router.post('/', auth, async (req, res) => {
  try {
    const { symbol, quantity, price, orderType } = req.body;
    const userId = req.user.id;

    // Validate
    if (!symbol || !quantity || !price) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const totalCost = quantity * price;

    // Check balance for buy orders
    if (orderType === 'buy' && totalCost > user.balance) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }

    // Check portfolio for sell orders
    if (orderType === 'sell') {
      if (!user.portfolio[symbol] || user.portfolio[symbol].shares < quantity) {
        return res.status(400).json({ msg: 'Insufficient shares' });
      }
    }

    // Update user's balance
    if (orderType === 'buy') {
      user.balance -= totalCost;
    } else {
      user.balance += totalCost;
    }
    
    // Update portfolio
    if (!user.portfolio[symbol]) {
      user.portfolio[symbol] = { shares: 0, avgPrice: 0 };
    }

    const currentPosition = user.portfolio[symbol];
    let newShares;
    let newAvgPrice;

    if (orderType === 'buy') {
      newShares = currentPosition.shares + quantity;
      newAvgPrice = ((currentPosition.avgPrice * currentPosition.shares) + totalCost) / newShares;
    } else {
      newShares = currentPosition.shares - quantity;
      newAvgPrice = newShares > 0 ? currentPosition.avgPrice : 0;
    }

    if (newShares === 0) {
      delete user.portfolio[symbol];
    } else {
      user.portfolio[symbol] = {
        shares: newShares,
        avgPrice: newAvgPrice
      };
    }

    await user.save();

    res.json({
      msg: 'Order executed successfully',
      balance: user.balance,
      portfolio: user.portfolio
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user portfolio
router.get('/portfolio', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ msg: 'User not found' });

    res.json({
      balance: user.balance,
      portfolio: user.portfolio
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;