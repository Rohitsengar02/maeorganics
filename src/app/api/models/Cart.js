const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: function() {
      return this.itemType === 'product';
    }
  },
  combo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Combo',
    required: function() {
      return this.itemType === 'combo';
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  itemType: {
    type: String,
    enum: ['product', 'combo'],
    required: true,
    default: 'product'
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
}, { timestamps: true });

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
