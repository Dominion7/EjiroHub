const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('./cart');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('wishlist.productId');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching wishlist', error: err.message });
  }
});

router.post('/add', auth, async (req, res) => {
  try {
    const { productId, variant } = req.body;
    const user = await User.findById(req.userId);
    if (!user.wishlist.some(item => 
      item.productId.toString() === productId && 
      item.variant.color === variant.color && 
      item.variant.size === variant.size
    )) {
      user.wishlist.push({ productId, variant });
    }
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error adding to wishlist', error: err.message });
  }
});

router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.wishlist = user.wishlist.filter(item => item.productId.toString() !== req.params.productId);
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error removing from wishlist', error: err.message });
  }
});

module.exports = router;