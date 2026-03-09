import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";

export default function Home() {

  const { t } = useTranslation();

  return (

    <>

      {/* HERO */}

      <section className="hero"
      style={{
        backgroundImage:"url('https://github.com/mohamednasser979/ghazl-fashion/blob/main/frontend/public/images/swiper1.jpeg')",
        backgroundSize:"cover",
        backgroundPosition:"center",
        backgroundRepeat:"no-repeat"
      }}>

        <div className="hero-overlay">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >

            <h1>{t("heroTitle")}</h1>

            <p>{t("heroSubtitle")}</p>

            <Link to="/products" className="hero-btn">
              {t("shopNow")}
            </Link>

          </motion.div>

        </div>

      </section>

      


      {/* FEATURED */}

      <section className="featured">

        <div className="featured-container">

          <div className="featured-card">
            <h3>Elegant Hijabs</h3>
            <p>Soft fabrics, timeless colors.</p>
            <Link to="/products" className="featured-link">
              Discover →
            </Link>
          </div>

          <div className="featured-card">
            <h3>Luxury Abayas</h3>
            <p>Premium cuts & modern style.</p>
            <Link to="/products" className="featured-link">
              Discover →
            </Link>
          </div>

          <div className="featured-card">
            <h3>New Collection</h3>
            <p>Fresh arrivals every week.</p>
            <Link to="/products" className="featured-link">
              Discover →
            </Link>
          </div>

        </div>

      </section>

    </>

  );

}