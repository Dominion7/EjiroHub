const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  products: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number, variant: { color: String, size: String } }],
  total: Number,
  status: { type: String, default: 'pending' }
});
module.exports = mongoose.model('Order', orderSchema);