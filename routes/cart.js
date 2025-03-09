const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart.productId');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
});

router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity, variant } = req.body;
    const user = await User.findById(req.userId);
    const itemIndex = user.cart.findIndex(item => 
      item.productId.toString() === productId && 
      item.variant.color === variant.color && 
      item.variant.size === variant.size
    );
    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, quantity, variant });
    }
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
});

router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart = user.cart.filter(item => item.productId.toString() !== req.params.productId);
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Error removing from cart', error: err.message });
  }
});

module.exports = { router, auth };