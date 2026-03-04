const Order = require("../models/Order");
const Product = require("../models/Product");

exports.getStats = async (req, res) => {

  try {

    // Total Products
    const totalProducts = await Product.countDocuments();

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Delivered Orders
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered"
    });

    // Processing Orders
    const processingOrders = await Order.countDocuments({
      orderStatus: "processing"
    });

    // Revenue
    const revenueData = await Order.aggregate([
      {
        $match: { orderStatus: "delivered" }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }
        }
      }
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    res.json({
      totalProducts,
      totalOrders,
      deliveredOrders,
      processingOrders,
      totalRevenue
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};