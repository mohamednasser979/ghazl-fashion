import { useLocation, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import api from "../utils/api";
import { formatEGP } from "../utils/pricing";
import { applyImageFallback, buildUploadFallbackUrl, buildUploadUrl } from "../utils/images";
import { resolveSoldOutValue } from "../utils/soldOut";

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImage, setMainImage] = useState("");
  const optionsRef = useRef(null);

  const shouldChooseOptions =
    new URLSearchParams(location.search).get("choose") === "1";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);

        setProduct(res.data);
        setMainImage(res.data.images?.[0] || res.data.image || "");
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && shouldChooseOptions && optionsRef.current) {
      optionsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [product, shouldChooseOptions]);

  if (!product) return <div>Loading...</div>;

  const hasSizeOptions = Array.isArray(product.sizes) && product.sizes.length > 0;
  const hasColorOptions = Array.isArray(product.colors) && product.colors.length > 0;
  const isSoldOut = resolveSoldOutValue(product);
  const galleryImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : (product.image ? [product.image] : []);
  const canAddToCart =
    (!hasSizeOptions || Boolean(selectedSize)) &&
    (!hasColorOptions || Boolean(selectedColor));

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          {mainImage && (
            <img
              src={buildUploadUrl(mainImage)}
              className="img-fluid rounded mb-3"
              alt={product.name}
              onError={(event) =>
                applyImageFallback(event, buildUploadFallbackUrl(mainImage))
              }
            />
          )}

          <div className="d-flex gap-2 flex-wrap">
            {galleryImages.map((img, i) => (
              <img
                key={i}
                src={buildUploadUrl(img)}
                style={{ width: 70, cursor: "pointer" }}
                onClick={() => setMainImage(img)}
                alt=""
                onError={(event) =>
                  applyImageFallback(event, buildUploadFallbackUrl(img))
                }
              />
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="mb-0">{product.name}</h2>
            {isSoldOut && (
              <span className="badge text-bg-danger">Sold Out</span>
            )}
          </div>

          <h4 className="text-muted mb-3">{formatEGP(product.price)}</h4>

          <p>{product.description}</p>

          {isSoldOut && (
            <div className="alert alert-danger py-2">
              This product is currently sold out.
            </div>
          )}

          {shouldChooseOptions && (
            <div className="alert alert-info py-2">
              Please choose size and color first.
            </div>
          )}

          <div ref={optionsRef}>
            {hasSizeOptions && (
              <div className="mb-3">
                <strong>Size:</strong>

                <div className="d-flex gap-2 mt-2">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      className={`btn ${
                        selectedSize === size ? "btn-dark" : "btn-outline-dark"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasColorOptions && (
              <div className="mb-3">
                <strong>Color:</strong>

                <div className="d-flex gap-2 mt-2">
                  {product.colors?.map((color) => (
                    <button
                      key={color}
                      className={`btn ${
                        selectedColor === color ? "btn-dark" : "btn-outline-dark"
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            className="btn btn-dark w-100"
            disabled={!canAddToCart || isSoldOut}
            onClick={() => {
              if (isSoldOut) {
                return;
              }

              addToCart({
                ...product,
                image: buildUploadUrl(galleryImages[0] || ""),
                selectedSize: hasSizeOptions ? selectedSize : "Free",
                selectedColor: hasColorOptions ? selectedColor : "Default"
              });
            }}
          >
            {isSoldOut ? "Sold Out" : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
