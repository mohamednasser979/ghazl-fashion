const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

/* =========================
   MULTER CONFIG
========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* =========================
   GET ALL PRODUCTS
========================= */

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   GET SINGLE PRODUCT
========================= */

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   CREATE PRODUCT
========================= */

router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price required" });
    }

    let sizes = [];
    let colors = [];

    try {
      sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];
      colors = req.body.colors ? JSON.parse(req.body.colors) : [];
    } catch (err) {
      console.log("JSON parse error:", err);
      return res.status(400).json({ message: "Invalid sizes/colors format" });
    }

    const images =
      req.files && req.files.length > 0
        ? req.files.map((file) => file.filename)
        : [];

    const newProduct = new Product({
      name,
      price,
      description,
      sizes,
      colors,
      images,
    });

    await newProduct.save();

    res.status(201).json(newProduct);

  } catch (error) {
    console.log("CREATE ERROR:", error);
    res.status(500).json({ message: "Error creating product" });
  }
});

/* =========================
   UPDATE PRODUCT
========================= */

router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    let sizes = [];
    let colors = [];

    try {
      sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];
      colors = req.body.colors ? JSON.parse(req.body.colors) : [];
    } catch (err) {
      console.log("JSON parse error:", err);
      return res.status(400).json({ message: "Invalid sizes/colors format" });
    }

    const updateData = {
      name,
      price,
      description,
      sizes,
      colors,
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.filename);
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});

/* =========================
   DELETE PRODUCT
========================= */

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;