import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Home() {

  const { t } = useTranslation();

  return (

    <>

      {/* SLIDER */}

      <div
        id="homeSlider"
        className="carousel slide"
        data-bs-ride="carousel"
      >

        <div className="carousel-indicators">

          <button
            type="button"
            data-bs-target="#homeSlider"
            data-bs-slide-to="0"
            className="active"
          ></button>

          <button
            type="button"
            data-bs-target="#homeSlider"
            data-bs-slide-to="1"
          ></button>

          <button
            type="button"
            data-bs-target="#homeSlider"
            data-bs-slide-to="2"
          ></button>

        </div>


        <div className="carousel-inner">


          <div className="carousel-item active">

            <img
              src="https://images.unsplash.com/photo-1520975916090-3105956dac38"
              className="d-block w-100"
              style={{height:"500px",objectFit:"cover"}}
              alt=""
            />

          </div>


          <div className="carousel-item">

            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
              className="d-block w-100"
              style={{height:"500px",objectFit:"cover"}}
              alt=""
            />

          </div>


          <div className="carousel-item">

            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c"
              className="d-block w-100"
              style={{height:"500px",objectFit:"cover"}}
              alt=""
            />

          </div>


        </div>


        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#homeSlider"
          data-bs-slide="prev"
        >

          <span className="carousel-control-prev-icon"></span>

        </button>


        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#homeSlider"
          data-bs-slide="next"
        >

          <span className="carousel-control-next-icon"></span>

        </button>

      </div>



      {/* HERO */}

      <section className="hero">

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

            <Link
              to="/products"
              className="featured-link"
            >

              Discover →

            </Link>

          </div>


          <div className="featured-card">

            <h3>Luxury Abayas</h3>

            <p>Premium cuts & modern style.</p>

            <Link
              to="/products"
              className="featured-link"
            >

              Discover →

            </Link>

          </div>


          <div className="featured-card">

            <h3>New Collection</h3>

            <p>Fresh arrivals every week.</p>

            <Link
              to="/products"
              className="featured-link"
            >

              Discover →

            </Link>

          </div>

        </div>

      </section>


    </>

  );

}