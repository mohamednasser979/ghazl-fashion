import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <img src={Logo} alt="Ghazl Fashion logo" className="logo mb-3" />
          <p>Elegance in every thread.</p>
        </div>

        <div>
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div>
          <h4>Contact</h4>
          <a
            href="https://www.instagram.com/ghazlfashion_?igsh=MWk3NW1rbWd0NDk2bw=="
            target="_blank"
            rel="noreferrer"
          >
            @ghazlfashion_
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Ghazl. All rights reserved.
      </div>
    </footer>
  );
}
