const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  createOrder,
} = require("../controllers/order.controller");

// Admin - Get All Orders
router.get("/", auth, admin, getAllOrders);

// Admin - Update Order Status
router.put("/:id", auth, admin, updateOrderStatus);

// Admin - Delete Order
router.delete("/:id", auth, admin, deleteOrder);

// User - Create Order
router.post("/", auth, createOrder);

module.exports = router;