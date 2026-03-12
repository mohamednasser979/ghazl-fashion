import { useMemo, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatEGP } from "../utils/pricing";

const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Dakahlia",
  "Sharqia",
  "Gharbia",
  "Monufia",
  "Beheira",
  "Kafr El Sheikh",
  "Damietta",
  "Port Said",
  "Ismailia",
  "Suez",
  "North Sinai",
  "South Sinai",
  "Fayoum",
  "Beni Suef",
  "Minya",
  "Assiut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
  "Red Sea",
  "New Valley",
  "Matrouh",
];

const CAIRO_GIZA_GOVERNORATES = new Set(["Cairo", "Giza"]);

const SHIPPING_PRICES = {
  cairoGiza: 50,
  otherGovernorates: 70,
  remote: 90,
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    area: "",
    isRemoteArea: false,
  });

  const subtotalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingFee = useMemo(() => {
    const normalizedArea = String(shipping.area || "").trim().toLowerCase();
    const isDahab = normalizedArea.includes("dahab");

    if (!shipping.city) {
      return 0;
    }

    if (CAIRO_GIZA_GOVERNORATES.has(shipping.city)) {
      return SHIPPING_PRICES.cairoGiza;
    }

    if (isDahab || shipping.isRemoteArea) {
      return SHIPPING_PRICES.remote;
    }

    return SHIPPING_PRICES.otherGovernorates;
  }, [shipping.area, shipping.city, shipping.isRemoteArea]);

  const totalPrice = subtotalPrice + shippingFee;

  const hasMissingSelections = cart.some(
    (item) => !item.selectedSize || !item.selectedColor
  );

  const activeShippingTier =
    shippingFee === SHIPPING_PRICES.cairoGiza
      ? "cairo-giza"
      : shippingFee === SHIPPING_PRICES.remote
        ? "remote"
        : shippingFee === SHIPPING_PRICES.otherGovernorates
          ? "other"
          : "";

  const extractImageName = (value) => {
    if (!value) return "";

    const image = String(value).trim();
    if (!image) return "";

    if (/^https?:\/\//i.test(image)) {
      return image.split("/uploads/").pop() || "";
    }

    const normalized = image.split("/uploads/").pop() || image;
    return normalized.replace(/^uploads\//, "");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "city") {
      const shouldResetRemote = CAIRO_GIZA_GOVERNORATES.has(value);

      setShipping((prev) => ({
        ...prev,
        city: value,
        isRemoteArea: shouldResetRemote ? false : prev.isRemoteArea,
      }));

      return;
    }

    setShipping((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (hasMissingSelections) {
      alert("Please choose size and color for each item before checkout.");
      navigate("/cart");
      return;
    }

    if (!shipping.city) {
      alert("Please select the governorate to calculate shipping.");
      return;
    }

    try {
      const formattedItems = cart.map((item) => {
        const imageValue = item.image || item.images?.[0] || "";

        return {
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: extractImageName(imageValue),
          size: item.selectedSize,
          color: item.selectedColor,
        };
      });

      await api.post("/orders", {
        items: formattedItems,
        totalPrice,
        shippingFee,
        itemsSubtotal: subtotalPrice,
        shippingAddress: {
          fullName: shipping.fullName.trim(),
          phone: shipping.phone.trim(),
          address: shipping.address.trim(),
          city: shipping.city,
          area: shipping.area.trim(),
          shippingZone:
            shippingFee === SHIPPING_PRICES.cairoGiza
              ? "Cairo & Giza"
              : shippingFee === SHIPPING_PRICES.remote
                ? "Dahab / Remote Areas"
                : "Other Governorates",
        },
      });

      clearCart();
      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Error placing order");
    }
  };

  return (
    <div className="checkout-page">
      <div className="container checkout-container">
        <div className="checkout-header">
          <h2>Checkout</h2>
          <p>Choose your governorate to calculate shipping automatically.</p>
        </div>

        <form onSubmit={handleSubmit} className="checkout-grid">
          <section className="checkout-card checkout-form-card">
            <h4 className="checkout-card-title">Shipping Details</h4>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="checkout-label" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="form-control checkout-input"
                  value={shipping.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="checkout-label" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="01XXXXXXXXX"
                  className="form-control checkout-input"
                  value={shipping.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="checkout-label" htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Street, building, floor..."
                  className="form-control checkout-input"
                  value={shipping.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="checkout-label" htmlFor="city">
                  Governorate
                </label>
                <select
                  id="city"
                  name="city"
                  className="form-select checkout-input"
                  value={shipping.city}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select governorate</option>
                  {GOVERNORATES.map((governorate) => (
                    <option key={governorate} value={governorate}>
                      {governorate}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="checkout-label" htmlFor="area">
                  Area / City
                </label>
                <input
                  id="area"
                  type="text"
                  name="area"
                  placeholder="Example: Dahab, Nasr City, Smouha"
                  className="form-control checkout-input"
                  value={shipping.area}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label
                  className={`checkout-remote-toggle ${
                    CAIRO_GIZA_GOVERNORATES.has(shipping.city) ? "disabled" : ""
                  }`}
                  htmlFor="isRemoteArea"
                >
                  <input
                    id="isRemoteArea"
                    type="checkbox"
                    name="isRemoteArea"
                    checked={shipping.isRemoteArea}
                    onChange={handleChange}
                    disabled={CAIRO_GIZA_GOVERNORATES.has(shipping.city)}
                  />
                  <span>
                    Dahab or remote area (shipping {formatEGP(SHIPPING_PRICES.remote)})
                  </span>
                </label>
              </div>
            </div>

            <div className="checkout-shipping-rules">
              <h6 className="checkout-rule-title">Shipping Rules</h6>

              <div className="checkout-rule-grid">
                <div
                  className={`checkout-rule-card ${
                    activeShippingTier === "cairo-giza" ? "active" : ""
                  }`}
                >
                  <span>Cairo & Giza</span>
                  <strong>{formatEGP(SHIPPING_PRICES.cairoGiza)}</strong>
                </div>

                <div
                  className={`checkout-rule-card ${
                    activeShippingTier === "other" ? "active" : ""
                  }`}
                >
                  <span>Other Governorates</span>
                  <strong>{formatEGP(SHIPPING_PRICES.otherGovernorates)}</strong>
                </div>

                <div
                  className={`checkout-rule-card ${
                    activeShippingTier === "remote" ? "active" : ""
                  }`}
                >
                  <span>Dahab & Remote Areas</span>
                  <strong>{formatEGP(SHIPPING_PRICES.remote)}</strong>
                </div>
              </div>
            </div>
          </section>

          <aside className="checkout-card checkout-summary-card">
            <h4 className="checkout-card-title">Order Summary</h4>

            <div className="checkout-summary-line">
              <span>Products subtotal</span>
              <strong>{formatEGP(subtotalPrice)}</strong>
            </div>

            <div className="checkout-summary-line">
              <span>Shipping</span>
              <strong>{shipping.city ? formatEGP(shippingFee) : "Select governorate"}</strong>
            </div>

            <div className="checkout-summary-line checkout-summary-total">
              <span>Total</span>
              <strong>{formatEGP(totalPrice)}</strong>
            </div>

            {hasMissingSelections && (
              <div className="alert alert-warning mb-3">
                You must choose size and color for each item first.
              </div>
            )}

            {!shipping.city && (
              <div className="alert alert-info mb-3">
                Select the governorate first to apply shipping cost.
              </div>
            )}

            <button
              type="submit"
              className="btn btn-dark w-100 checkout-submit-btn"
              disabled={hasMissingSelections || !shipping.city}
            >
              Place Order
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}
