const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const Product = require('./models/Product');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/wishlist', require('./routes/wishlist'));

// Automated Product Sync (runs daily at midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    const products = await require('./scrapeHomik')();
    await Product.deleteMany({ supplier: 'homikglobal' });
    await Product.insertMany(products);
    console.log('Products synced successfully');
  } catch (err) {
    console.error('Sync failed:', err);
  }
});

// Manual Sync Endpoint
app.get('/api/sync-products', async (req, res) => {
  try {
    const products = await require('./scrapeHomik')();
    await Product.deleteMany({ supplier: 'homikglobal' });
    await Product.insertMany(products);
    res.send('Products synced');
  } catch (err) {
    res.status(500).json({ message: 'Sync failed', error: err.message });
  }
});

// Error Handling
app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));