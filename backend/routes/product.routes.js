const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");

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

const parsePriceFields = (body) => {
  const parsedPrice = Number(body.price);

  if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
    return { error: "Price must be a valid positive number." };
  }

  return {
    price: parsedPrice
  };
};

const parseSoldOutValue = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "1", "yes", "on", "soldout", "sold out"].includes(normalized);
  }

  return false;
};

const getSoldOutFieldValue = (body = {}) => {
  const hasOwn = Object.prototype.hasOwnProperty;

  if (hasOwn.call(body, "soldOut")) {
    return body.soldOut;
  }

  if (hasOwn.call(body, "soldout")) {
    return body.soldout;
  }

  if (hasOwn.call(body, "isSoldOut")) {
    return body.isSoldOut;
  }

  return undefined;
};

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
    const { name, description } = req.body;
    const priceFields = parsePriceFields(req.body);
    const soldOut = parseSoldOutValue(getSoldOutFieldValue(req.body));

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (priceFields.error) {
      return res.status(400).json({ message: priceFields.error });
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
      name: String(name).trim(),
      price: priceFields.price,
      description,
      sizes,
      colors,
      soldOut,
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
    const { name, description } = req.body;
    const priceFields = parsePriceFields(req.body);
    const soldOutFieldValue = getSoldOutFieldValue(req.body);

    if (priceFields.error) {
      return res.status(400).json({ message: priceFields.error });
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

    const updateData = {
      name: name ? String(name).trim() : name,
      price: priceFields.price,
      description,
      sizes,
      colors,
    };

    if (soldOutFieldValue !== undefined) {
      updateData.soldOut = parseSoldOutValue(soldOutFieldValue);
    }

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.filename);
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" }
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
