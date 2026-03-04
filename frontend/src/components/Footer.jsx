import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h3>Ghazl</h3>
          <p>Elegance in every thread.</p>
        </div>

        <div>
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div>
          <h4>Contact</h4>
          <p>info@ghazl.com</p>
          <p>+20 123 456 789</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Ghazl. All rights reserved.
      </div>
    </footer>
  );
}