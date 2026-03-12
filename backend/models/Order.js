const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      name: String,
      price: Number,
      qty: Number,
      image: String,
      imageUrl: String,
      size: String,
      color: String
    }
  ],

  totalPrice: {
    type: Number,
    required: true
  },

  itemsSubtotal: {
    type: Number,
    default: 0
  },

  shippingFee: {
    type: Number,
    default: 0
  },

  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    area: String,
    shippingZone: String
  },

  orderStatus: {
    type: String,
    default: "Pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
