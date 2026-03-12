const Product = require("../models/Product");

const parsePriceFields = (body = {}) => {
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

const parseStringArrayField = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return { value: [] };
  }

  if (Array.isArray(value)) {
    return { value };
  }

  if (typeof value === "string") {
    try {
      const parsedValue = JSON.parse(value);
      if (Array.isArray(parsedValue)) {
        return { value: parsedValue };
      }
      return { error: `${fieldName} must be an array.` };
    } catch (error) {
      return { error: `Invalid ${fieldName} format.` };
    }
  }

  return { error: `${fieldName} must be an array.` };
};

const extractImagesFromRequest = (req) => {
  if (Array.isArray(req.files) && req.files.length > 0) {
    return req.files.map((file) => file.filename);
  }

  if (req.file?.filename) {
    return [req.file.filename];
  }

  return [];
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createProduct = async (req, res) => {
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

    const sizesResult = parseStringArrayField(req.body.sizes, "sizes");
    if (sizesResult.error) {
      return res.status(400).json({ message: sizesResult.error });
    }

    const colorsResult = parseStringArrayField(req.body.colors, "colors");
    if (colorsResult.error) {
      return res.status(400).json({ message: colorsResult.error });
    }

    const images = extractImagesFromRequest(req);

    const product = await Product.create({
      name: String(name).trim(),
      price: priceFields.price,
      description: description || "",
      sizes: sizesResult.value,
      colors: colorsResult.value,
      soldOut,
      images,
      image: images[0] || ""
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description } = req.body;
    const priceFields = parsePriceFields(req.body);
    const soldOutFieldValue = getSoldOutFieldValue(req.body);

    if (priceFields.error) {
      return res.status(400).json({ message: priceFields.error });
    }

    const sizesResult = parseStringArrayField(req.body.sizes, "sizes");
    if (sizesResult.error) {
      return res.status(400).json({ message: sizesResult.error });
    }

    const colorsResult = parseStringArrayField(req.body.colors, "colors");
    if (colorsResult.error) {
      return res.status(400).json({ message: colorsResult.error });
    }

    const updateData = {
      name: name ? String(name).trim() : name,
      price: priceFields.price,
      description,
      sizes: sizesResult.value,
      colors: colorsResult.value
    };

    if (soldOutFieldValue !== undefined) {
      updateData.soldOut = parseSoldOutValue(soldOutFieldValue);
    }

    const images = extractImagesFromRequest(req);
    if (images.length > 0) {
      updateData.images = images;
      updateData.image = images[0];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      returnDocument: "after"
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
