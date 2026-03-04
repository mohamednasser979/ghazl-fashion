import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );
      setProduct(res.data);
      setMainImage(res.data.images?.[0]);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container py-5">
      <div className="row">

        {/* Images */}
        <div className="col-md-6">
          <img
            src={`http://localhost:5000/uploads/${mainImage}`}
            className="img-fluid rounded mb-3"
            alt=""
          />

          <div className="d-flex gap-2 flex-wrap">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:5000/uploads/${img}`}
                style={{ width: 70, cursor: "pointer" }}
                onClick={() => setMainImage(img)}
                alt=""
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <h4 className="text-muted mb-3">${product.price}</h4>

          <p>{product.description}</p>

          {/* Sizes */}
          <div className="mb-3">
            <strong>Size:</strong>
            <div className="d-flex gap-2 mt-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`btn ${
                    selectedSize === size
                      ? "btn-dark"
                      : "btn-outline-dark"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mb-3">
            <strong>Color:</strong>
            <div className="d-flex gap-2 mt-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  className={`btn ${
                    selectedColor === color
                      ? "btn-dark"
                      : "btn-outline-dark"
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-dark w-100"
            disabled={!selectedSize || !selectedColor}
            onClick={() =>
              addToCart({
                ...product,
                image: `http://localhost:5000/uploads/${product.images[0]}`,
                selectedSize,
                selectedColor
              })
            }
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}