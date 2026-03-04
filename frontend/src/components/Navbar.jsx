import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {

  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();
  const { cart } = useCart();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cartCount = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <header className="navbar-wrapper">

      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="brand-wrapper">
          <div className="brand-text">
            <span className="brand-name">GHAZL</span>
            <span className="brand-butterfly"></span>
          </div>
          <span className="brand-fashion">FASHION</span>
        </Link>

        {/* Desktop Links */}
        <nav className="nav-links">

          <Link to="/">Home</Link>

          <Link to="/products">Shop</Link>

          {/* Cart with counter */}
          <Link to="/cart" className="cart-link">

            Cart

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}

          </Link>

          {!user ? (

            <>
              <Link to="/login">Login</Link>

              <Link to="/register" className="primary-btn">
                Register
              </Link>
            </>

          ) : (

            <>
              {user.role === "admin" && (
                <Link to="/admin/dashboard">Admin</Link>
              )}

              <button
                className="text-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>

          )}

          <button
            className="mode-btn"
            onClick={() => setDark(!dark)}
          >
            {dark ? "☀" : "🌙"}
          </button>

        </nav>

        {/* Mobile Toggle */}
        <div
          className="mobile-toggle"
          onClick={() => setOpen(!open)}
        >
          ☰
        </div>

      </div>

      {/* Mobile Menu */}
      {open && (

        <div className="mobile-menu">

          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link to="/products" onClick={() => setOpen(false)}>
            Shop
          </Link>

          <Link to="/cart" onClick={() => setOpen(false)}>
            Cart ({cartCount})
          </Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>

              <Link to="/register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setOpen(false)}
                >
                  Admin
                </Link>
              )}

              <button onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

        </div>

      )}

    </header>
  );
}