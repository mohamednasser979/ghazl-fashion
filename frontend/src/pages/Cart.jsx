import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { formatEGP } from "../utils/pricing";
import { applyImageFallback, buildUploadFallbackUrl, buildUploadUrl } from "../utils/images";

export default function Cart() {

  const { cart, removeFromCart, addToCart, decreaseQty } = useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const increaseQty = (item) => {
    addToCart({ ...item, qty: 1 });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const hasMissingSelections = cart.some(
    (item) => !item.selectedSize || !item.selectedColor
  );

  if (cart.length === 0)
    return (
      <div className="container mt-5 pt-5 text-center">
        <h4>{t("emptyCart")} 😎</h4>
      </div>
    );

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">{t("yourCart")}</h2>

      {cart.map((item, index) => (

        <div
          key={index}
          className="d-flex align-items-center border-bottom py-3"
        >

          {/* IMAGE */}
          <img
            src={buildUploadUrl(item.images?.[0] || item.image)}
            alt={item.name}
            width="100"
            className="rounded me-3"
            onError={(event) =>
              applyImageFallback(
                event,
                buildUploadFallbackUrl(item.images?.[0] || item.image)
              )
            }
          />

          {/* INFO */}
          <div className="flex-grow-1">

            <h6 className="mb-1">{item.name}</h6>

            <small className="text-muted">
              {formatEGP(item.price)}
            </small>

            <small className="text-muted d-block">
              Size: {item.selectedSize}
            </small>

            <small className="text-muted">
              Color: {item.selectedColor}
            </small>

          </div>

          {/* QUANTITY */}
          <div className="d-flex align-items-center">

            <button
              className="btn btn-sm btn-outline-dark"
              onClick={() => decreaseQty(index)}
            >
              −
            </button>

            <span className="mx-2">
              {item.qty}
            </span>

            <button
              className="btn btn-sm btn-outline-dark"
              onClick={() => increaseQty(item)}
            >
              +
            </button>

          </div>

          {/* REMOVE */}
          <button
            className="btn btn-sm btn-danger ms-3"
            onClick={() => removeFromCart(index)}
          >
            {t("remove")}
          </button>

        </div>

      ))}

      <hr />

      <div className="d-flex justify-content-between">
        <h5>Total:</h5>
        <h5>{formatEGP(total)}</h5>
      </div>

      {hasMissingSelections && (
        <div className="alert alert-warning mt-3 mb-0" role="alert">
          Please choose size and color for every item before checkout.
        </div>
      )}

      <button
        className="btn btn-dark w-100 mt-3"
        disabled={hasMissingSelections}
        onClick={() => navigate("/checkout")}
      >
          {t("checkout")}
      </button>

    </div>
  );
}
