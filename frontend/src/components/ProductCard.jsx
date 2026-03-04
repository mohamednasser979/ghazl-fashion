import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {

  const { addToCart } = useCart();

  return (

    <div className="card h-100 shadow-sm border-0 overflow-hidden w-75">

      <Link to={`/products/${product._id}`}>

        <img
          src={`http://localhost:5000/uploads/${product.images?.[0]}`}
          alt={product.name}
          className="card-img-top"
          style={{
            height:"320px"
          }}
        />

      </Link>

      <div className="card-body d-flex flex-column">

        <h5 className="card-title">
          {product.name}
        </h5>

        <p className="text-muted small flex-grow-1">
          {product.description}
        </p>

        <h6 className="fw-bold mb-3">
          ${product.price}
        </h6>

        <button
          className="btn btn-dark w-100"
          onClick={()=>addToCart(product)}
        >
          Add to Cart
        </button>

      </div>

    </div>

  );

}