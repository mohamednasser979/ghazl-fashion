const Order = require("../models/Order");

// ==========================
// GET ALL ORDERS (Admin)
// ==========================

exports.getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.productId", "name images image")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }
};


// ==========================
// UPDATE ORDER STATUS
// ==========================

exports.updateOrderStatus = async (req, res) => {
  try {

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { returnDocument: "after" }
    );

    res.json(order);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }
};


// ==========================
// DELETE ORDER
// ==========================

exports.deleteOrder = async (req, res) => {
  try {

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order deleted successfully" });

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }
};


// ==========================
// CREATE ORDER
// ==========================

exports.createOrder = async (req, res) => {

  try {

    const { items, totalPrice, shippingAddress, shippingFee, itemsSubtotal } = req.body;

    if (!items || items.length === 0) {

      return res.status(400).json({ message: "No order items" });

    }

    const order = new Order({

      user: req.user.id,   // 🔥 هذا كان ناقص

      items,
      totalPrice: Number(totalPrice) || 0,
      itemsSubtotal: Number(itemsSubtotal) || Number(totalPrice) || 0,
      shippingFee: Number(shippingFee) || 0,
      shippingAddress,

      orderStatus: "Pending"

    });

    await order.save();

    res.status(201).json(order);

  } catch (error) {

    console.log(error);

    res.status(500).json({ message: "Server error" });

  }

};
