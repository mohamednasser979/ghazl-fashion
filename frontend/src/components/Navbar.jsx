import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {

const navigate = useNavigate();
const { cart } = useCart();

const token = localStorage.getItem("token");

const handleLogout = () => {

localStorage.removeItem("token");
localStorage.removeItem("role");

navigate("/login");

};

return (

<nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">

  <div className="container">

    <Link className="navbar-brand fw-bold" to="/">
      GHAZL
    </Link>

    {/* Mobile button */}
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarNav">

      <ul className="navbar-nav ms-auto">

        <li className="nav-item">
          <Link className="nav-link" to="/">Home</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/products">Shop</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/cart">
            Cart ({cart.length})
          </Link>
        </li>

        {!token && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
          </>
        )}

        {token && (
          <li className="nav-item">
            <button
              className="btn btn-dark ms-lg-3 mt-2 mt-lg-0"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        )}

      </ul>

    </div>

  </div>

</nav>

);

}