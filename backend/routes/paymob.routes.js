const express = require("express");
const router = express.Router();
const { payWithPaymob } = require("../controllers/paymob.controllers");
/*
 POST /api/paymob/pay
*/
router.post("/pay", payWithPaymob);

module.exports = router;
