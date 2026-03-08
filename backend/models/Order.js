const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      name: String,
      price: Number,
      qty: Number,
      image: String,
      size: String,
      color: String
    }
  ],

  totalPrice: {
    type: Number,
    required: true
  },

  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String
  },

  orderStatus: {
    type: String,
    default: "Pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);