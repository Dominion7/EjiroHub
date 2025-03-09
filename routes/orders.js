const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth } = require('./cart');

router.post('/', auth, async (req, res) => {
  try {
    const { products, total } = req.body;
    const order = new Order({ userId: req.userId, products, total });
    await order.save();
    const user = await User.findById(req.userId);
    user.cart = [];
    await user.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

module.exports = router;