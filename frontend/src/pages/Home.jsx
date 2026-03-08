import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import main from "../assets/GENESIS/THE FIRST DROP.jpeg";

import "swiper/css";
import "swiper/css/pagination";

export default function Home() {

  const { t } = useTranslation();

  return (

    <>
      {/* HERO */}

      <section className="hero">

        <div className="hero-overlay">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <img src={main} alt="Ghazl Fashion" className="main-image" />
            <h1>{t("heroTitle")}</h1>

            <p>{t("heroSubtitle")}</p>

            <Link to="/products" className="hero-btn">
              {t("shopNow")}
            </Link>

          </motion.div>

        </div>

      </section>

      {/* SLIDER */}

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500 }}
        loop={true}
        className="home-slider"
      >

        <SwiperSlide>

          <img
            src="https://images.unsplash.com/photo-1520975916090-3105956dac38"
            className="slider-img"
            alt=""
          />

        </SwiperSlide>


        <SwiperSlide>

          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
            className="slider-img"
            alt=""
          />

        </SwiperSlide>


        <SwiperSlide>

          <img
            src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c"
            className="slider-img"
            alt=""
          />

        </SwiperSlide>

      </Swiper>


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