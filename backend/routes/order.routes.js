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


// ==========================
// USER CREATE ORDER
// ==========================

router.post("/", auth, createOrder);


// ==========================
// ADMIN ROUTES
// ==========================

router.get("/", auth, admin, getAllOrders);

router.put("/:id", auth, admin, updateOrderStatus);

router.delete("/:id", auth, admin, deleteOrder);


module.exports = router;