const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: { street: String, city: String, country: String },
  cart: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number, variant: { color: String, size: String } }],
  wishlist: [{ productId: mongoose.Schema.Types.ObjectId, variant: { color: String, size: String } }]
});
module.exports = mongoose.model('User', userSchema);