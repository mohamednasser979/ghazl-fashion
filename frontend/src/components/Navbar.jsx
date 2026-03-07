import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {

const navigate = useNavigate();
const { cart } = useCart();

const [open, setOpen] = useState(false);

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

    {/* Mobile Button */}
    <button
      className="navbar-toggler"
      type="button"
      onClick={() => setOpen(!open)}
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>

      <ul className="navbar-nav ms-auto">

        <li className="nav-item">
          <Link className="nav-link" to="/" onClick={()=>setOpen(false)}>Home</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/products" onClick={()=>setOpen(false)}>Shop</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/cart" onClick={()=>setOpen(false)}>
            Cart ({cart.length})
          </Link>
        </li>

        {!token && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/login" onClick={()=>setOpen(false)}>
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/register" onClick={()=>setOpen(false)}>
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