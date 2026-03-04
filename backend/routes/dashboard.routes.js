const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { getStats } = require("../controllers/dashboard.controller");

router.get("/", auth, admin, getStats);

module.exports = router;