const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {

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

    status:{
      type:String,
      default:"pending"
    },

    paymentStatus:{
      type:String,
      enum:["pending","paid","failed"],
      default:"pending"
    },

    orderStatus:{
      type:String,
      enum:["processing","shipped","delivered"],
      default:"processing"
    }

  },
  { timestamps:true }
);

module.exports = mongoose.model("Order",orderSchema);