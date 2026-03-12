import { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import { formatEGP } from "../utils/pricing";
import { applyImageFallback, buildUploadFallbackUrl, buildUploadUrl } from "../utils/images";
import { parseSoldOutFlag, resolveSoldOutValue } from "../utils/soldOut";

function AdminProducts() {
  const [, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [colorSearch, setColorSearch] = useState("");
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);

  const colorDropdownRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    images: [],
    sizes: [],
    colors: [],
    soldOut: false
  });

  const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL", "One Size"];

  const AVAILABLE_COLORS = [
    "Black", "White", "Beige", "Yellow", "Red", "Burgundy",
    "Gray", "Dark Gray", "Mint Green", "Brown", "Navy",
    "Orange", "Olive", "Baby Blue", "Powder Pink", "GARNET",
    "Bronze", "Sage", "Petroleum", "Maroon", "Deep Navy",
    "Mocha Brown", "Soft Mint", "Warm Cashmere", "CRIMSON",
    "INDIGO", "NUDE", "OLIVE", "CARAMEL", "FLAMINGO", "INK",
    "LEMON", "SKY", "SAND", "WINE", "FOREST", "LIME", "NOIR", "PURE",
    "ROSE", "DENIM", "PEACH", "SUN"
  ];

  const filteredAvailableColors = AVAILABLE_COLORS.filter((color) =>
    color.toLowerCase().includes(colorSearch.trim().toLowerCase())
  );

  const fetchProducts = async () => {
    const res = await api.get("/products");

    setProducts(res.data);
    setFilteredProducts(res.data);

    return res.data;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!isColorDropdownOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(event.target)
      ) {
        setIsColorDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isColorDropdownOpen]);

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      images: [],
      sizes: [],
      colors: [],
      soldOut: false
    });
    setColorSearch("");
    setIsColorDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentPrice = Number(form.price);

    if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
      alert("Price must be a valid positive number.");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", String(currentPrice));
    formData.append("description", form.description);
    formData.append("soldOut", String(Boolean(form.soldOut)));

    formData.append("sizes", JSON.stringify(form.sizes));
    formData.append("colors", JSON.stringify(form.colors));

    for (let i = 0; i < form.images.length; i += 1) {
      formData.append("images", form.images[i]);
    }

    try {
      let response;
      if (editingId) {
        response = await api.put(`/products/${editingId}`, formData);
      } else {
        response = await api.post("/products", formData);
      }

      const expectedSoldOut = parseSoldOutFlag(form.soldOut);
      const responseSoldOut = parseSoldOutFlag(response?.data?.soldOut);

      setEditingId(null);
      resetForm();

      const refreshedProducts = await fetchProducts();
      const savedId = response?.data?._id || editingId;
      const refreshedSavedProduct = Array.isArray(refreshedProducts)
        ? refreshedProducts.find((product) => String(product._id) === String(savedId))
        : null;
      const refreshedSoldOut = parseSoldOutFlag(refreshedSavedProduct?.soldOut);

      const soldOutSavedCorrectly =
        responseSoldOut === expectedSoldOut || refreshedSoldOut === expectedSoldOut;

      if (!soldOutSavedCorrectly) {
        alert(
          "Sold Out was not saved by the connected backend. Please deploy latest backend."
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error saving product.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;

    await api.delete(`/products/${id}`);

    fetchProducts();
  };

  const editProduct = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      images: [],
      sizes: product.sizes || [],
      colors: product.colors || [],
      soldOut: resolveSoldOutValue(product)
    });

    setColorSearch("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resolveImageSrc = (product) => {
    const imageValue = product.images?.[0] || product.image || "";

    if (!imageValue) return "";

    const image = String(imageValue).trim();
    if (!image) return "";

    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    return buildUploadUrl(image);
  };

  const toggleOption = (field, value, isChecked) => {
    setForm((prev) => {
      const existingValues = Array.isArray(prev[field]) ? prev[field] : [];

      if (isChecked) {
        if (existingValues.includes(value)) {
          return prev;
        }

        return { ...prev, [field]: [...existingValues, value] };
      }

      return {
        ...prev,
        [field]: existingValues.filter((item) => item !== value)
      };
    });
  };

  const colorsSummaryLabel =
    form.colors.length > 0
      ? `${form.colors.length} selected`
      : "Select colors";

  return (
    <div className="container mt-4 admin-products-page">
      <h2 className="mb-4 fw-bold">
        {editingId ? "Edit Product" : "Add Product"}
      </h2>

      <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4 mb-4 admin-product-form">
        <div className="row g-3">
          <div className="col-lg-4 col-md-6">
            <label className="admin-field-label" htmlFor="product-name">
              Product Name
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="Write product name"
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="col-lg-2 col-md-6">
            <label className="admin-field-label" htmlFor="product-price">
              Price (EGP)
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="form-control"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          <div className="col-lg-4 col-md-8">
            <label className="admin-field-label" htmlFor="product-description">
              Description
            </label>
            <input
              id="product-description"
              type="text"
              placeholder="Short product description"
              className="form-control"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="col-lg-2 col-md-4">
            <label className="admin-field-label" htmlFor="product-images">
              Images
            </label>
            <input
              id="product-images"
              type="file"
              multiple
              className="form-control"
              onChange={(e) => setForm({ ...form, images: e.target.files })}
            />
          </div>
        </div>

        <div className="admin-form-options mt-3">
          <div className="admin-size-panel">
            <span className="admin-field-label d-block">Sizes</span>

            <div className="admin-size-grid">
              {AVAILABLE_SIZES.map((size) => (
                <label
                  key={size}
                  className={`admin-size-chip ${form.sizes.includes(size) ? "active" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={form.sizes.includes(size)}
                    onChange={(e) => toggleOption("sizes", size, e.target.checked)}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="admin-color-panel" ref={colorDropdownRef}>
            <span className="admin-field-label d-block">Colors</span>

            <button
              type="button"
              className="admin-color-dropdown-trigger"
              onClick={() => setIsColorDropdownOpen((prev) => !prev)}
            >
              <span>{colorsSummaryLabel}</span>
              <span className={`admin-dropdown-arrow ${isColorDropdownOpen ? "open" : ""}`}>
                v
              </span>
            </button>

            {isColorDropdownOpen && (
              <div className="admin-color-dropdown-menu">
                <input
                  type="search"
                  className="form-control admin-colors-search"
                  placeholder="Search color..."
                  value={colorSearch}
                  onChange={(e) => setColorSearch(e.target.value)}
                />

                <div className="admin-color-dropdown-list">
                  {filteredAvailableColors.map((color) => (
                    <label
                      key={color}
                      className={`admin-color-option ${form.colors.includes(color) ? "active" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.colors.includes(color)}
                        onChange={(e) => toggleOption("colors", color, e.target.checked)}
                      />
                      <span>{color}</span>
                    </label>
                  ))}

                  {filteredAvailableColors.length === 0 && (
                    <div className="admin-colors-empty">No matching colors.</div>
                  )}
                </div>
              </div>
            )}

            {form.colors.length > 0 && (
              <div className="admin-selected-colors">
                {form.colors.map((color) => (
                  <span key={color} className="admin-selected-color-chip">
                    {color}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="admin-stock-panel">
            <span className="admin-field-label d-block">Stock Status</span>

            <label className={`admin-soldout-toggle ${form.soldOut ? "active" : ""}`}>
              <input
                type="checkbox"
                checked={form.soldOut}
                onChange={(e) => setForm({ ...form, soldOut: e.target.checked })}
              />
              <span>{form.soldOut ? "Sold Out" : "Available"}</span>
            </label>

            <small className="text-muted d-block mt-2">
              When set to Sold Out, the product card in Shop will show Sold Out and disable Add to Cart.
            </small>
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button className="btn btn-dark">
            {editingId ? "Update Product" : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setEditingId(null);
                resetForm();
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price (EGP)</th>
              <th>Status</th>
              <th>Description</th>
              <th>Sizes</th>
              <th>Colors</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => {
              const imageSrc = resolveImageSrc(product);

              return (
                <tr key={product._id}>
                  <td>
                    {imageSrc && (
                      <img
                        src={imageSrc}
                        width="60"
                        alt=""
                        onError={(event) =>
                          applyImageFallback(
                            event,
                            buildUploadFallbackUrl(
                              product.images?.[0] || product.image || ""
                            )
                          )
                        }
                      />
                    )}
                  </td>

                  <td>{product.name}</td>

                  <td>{formatEGP(product.price)}</td>

                  <td>
                    <span
                      className={`admin-status-badge ${
                        resolveSoldOutValue(product) ? "soldout" : "available"
                      }`}
                    >
                      {resolveSoldOutValue(product) ? "Sold Out" : "Available"}
                    </span>
                  </td>

                  <td>{product.description}</td>

                  <td>{product.sizes?.join(", ")}</td>

                  <td>{product.colors?.join(", ")}</td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editProduct(product)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
