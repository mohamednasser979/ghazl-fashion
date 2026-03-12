import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const { cart, cartUpdated } = useCart();
  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const threshold = 10;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 8) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (delta > threshold && currentScrollY > 80) {
        setIsVisible(false);
        setOpen(false);
      } else if (delta < -threshold) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const handleChangeLanguage = () => {
    const nextLanguage = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("appLang", nextLanguage);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setOpen(false);
    navigate("/login");
  };

  return (
    <>
      <div className="site-navbar-spacer"></div>

      <nav
        className={`site-navbar navbar navbar-expand-lg navbar-light bg-white shadow-sm ${
          isVisible ? "navbar-visible" : "navbar-hidden"
        }`}
      >
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={Logo} alt="Ghazl Fashion logo" className="logo" />
          </Link>

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
                <Link className="nav-link" to="/" onClick={() => setOpen(false)}>
                  {t("home")}
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/products" onClick={() => setOpen(false)}>
                  {t("shop")}
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link cart-nav-link"
                  to="/cart"
                  onClick={() => setOpen(false)}
                  aria-label={`${t("cart")} (${cart.length})`}
                >
                  <span className="cart-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 16 16"
                      width="20"
                      height="20"
                      fill="currentColor"
                    >
                      <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .49.402L2.89 6h10.61a.5.5 0 0 1 .49.598l-1 5A.5.5 0 0 1 12.5 12H4a.5.5 0 0 1-.49-.402L1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 7l.8 4h8.188l.8-4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m5 2a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                    </svg>
                  </span>

                  <span className={`cart-count-badge ${cartUpdated ? "cart-count-badge-active" : ""}`}>
                    {cart.length}
                  </span>
                </Link>
              </li>

              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm ms-lg-3 mt-2 mt-lg-0 lang-toggle-btn"
                  title={t("languageToggle")}
                  onClick={handleChangeLanguage}
                >
                  {i18n.language === "ar" ? "EN" : "AR"}
                </button>
              </li>

              {!token && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login" onClick={() => setOpen(false)}>
                      {t("login")}
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/register" onClick={() => setOpen(false)}>
                      {t("register")}
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
                    {t("logout")}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
