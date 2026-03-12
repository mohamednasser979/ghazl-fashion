import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatEGP } from "../utils/pricing";
import { applyImageFallback, buildUploadFallbackUrl, buildUploadUrl } from "../utils/images";
import { resolveSoldOutValue } from "../utils/soldOut";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [showChooser, setShowChooser] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const isSoldOut = resolveSoldOutValue(product);

  const hasSizeOptions = Array.isArray(product.sizes) && product.sizes.length > 0;
  const hasColorOptions = Array.isArray(product.colors) && product.colors.length > 0;
  const canAdd =
    (!hasSizeOptions || Boolean(selectedSize)) &&
    (!hasColorOptions || Boolean(selectedColor));
  const primaryImageValue = product.images?.[0] || product.image || "";
  const primaryImageSrc = buildUploadUrl(primaryImageValue);
  const fallbackImageSrc = buildUploadFallbackUrl(primaryImageValue);

  const handleOpenChooser = () => {
    if (isSoldOut) {
      return;
    }

    if (!hasSizeOptions && !hasColorOptions) {
      handleAddFromCard();
      return;
    }

    setSelectedSize("");
    setSelectedColor("");
    setShowChooser(true);
  };

  const handleAddFromCard = () => {
    if (isSoldOut) {
      return;
    }

    addToCart({
      ...product,
      selectedSize: hasSizeOptions ? selectedSize : "Free",
      selectedColor: hasColorOptions ? selectedColor : "Default"
    });

    setShowChooser(false);
  };

  return (
    <>
      <div
        className={`card collection-card h-100 shadow-sm border-0 overflow-hidden w-100 ${
          isSoldOut ? "collection-card-soldout" : ""
        }`}
      >
        {isSoldOut && (
          <span className="collection-soldout-badge">
            Sold Out
          </span>
        )}

        <Link to={`/products/${product._id}`}>
          <img
            src={primaryImageSrc}
            alt={product.name}
            className="card-img-top"
            onError={(event) => applyImageFallback(event, fallbackImageSrc)}
            style={{
              height: "320px"
            }}
          />
        </Link>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>

          <p className="text-muted small flex-grow-1">{product.description}</p>

          <h6 className="fw-bold mb-3">{formatEGP(product.price)}</h6>

          <button
            type="button"
            className="btn btn-dark w-100"
            onClick={handleOpenChooser}
            disabled={isSoldOut}
          >
            {isSoldOut ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>

      {showChooser && (
        <div className="product-options-overlay" onClick={() => setShowChooser(false)}>
          <div
            className="product-options-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="product-options-head">
              <h6 className="mb-0">Choose options</h6>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowChooser(false)}
              />
            </div>

            {hasSizeOptions && (
              <div className="mt-3">
                <strong>Size:</strong>
                <div className="option-chip-list mt-2">
                  {product.sizes.map((size) => (
                    <button
                      type="button"
                      key={size}
                      className={`option-chip ${selectedSize === size ? "active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasColorOptions && (
              <div className="mt-3">
                <strong>Color:</strong>
                <div className="option-chip-list mt-2">
                  {product.colors.map((color) => (
                    <button
                      type="button"
                      key={color}
                      className={`option-chip ${selectedColor === color ? "active" : ""}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="btn btn-dark w-100 mt-4"
              disabled={!canAdd || isSoldOut}
              onClick={handleAddFromCard}
            >
              {isSoldOut ? "Sold Out" : "Add To Cart"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
