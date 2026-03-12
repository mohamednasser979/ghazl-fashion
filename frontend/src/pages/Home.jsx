import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { homeShowcases } from "../data/homeShowcases";

const heroSlides = [
  { image: "/images/THE%20FIRST%20DROP.jpeg", alt: "The First Drop" },
  { image: "/images/DUAL%20MODE%20%284%29.jpeg", alt: "Dual Mode" },
  { image: "/images/OLIVE%20%2810%29.jpg", alt: "Olive" },
  {
    image: "/images/WhatsApp%20Image%202026-03-12%20at%203.04.51%20AM%20%281%29.jpeg",
    alt: "Ghazl Fashion showcase",
  },
];

export default function Home() {

  const { t } = useTranslation();

  return (
    <>
      {/* HERO */}

      <section className="hero">
        <Swiper
          className="hero-swiper"
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          loop
          speed={1200}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.image}>
              <img src={slide.image} alt={slide.alt} className="hero-image d-block" />
            </SwiperSlide>
          ))}
        </Swiper>

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

      {/* BEST PRODUCTS */}

      <section className="best-picks">
        <div className="best-picks-container">
          <div className="best-picks-head">
            <h2>Best Products</h2>
            <p>Replace these with your best product images anytime.</p>
          </div>

          <div className="best-picks-grid">
            {homeShowcases.map((card) => (
              <article className="best-pick-card" key={card.slug}>
                <div className="best-pick-media">
                  <Link to={`/home-showcase/${card.slug}`} className="best-pick-card-link">
                    <Swiper
                      className="best-pick-swiper"
                      modules={[Autoplay, Pagination]}
                      loop
                      speed={700}
                      autoplay={{
                        delay: 2600,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      pagination={{ clickable: true }}
                    >
                      {card.images.map((image, index) => (
                        <SwiperSlide key={`${card.slug}-${index}`}>
                          <img
                            src={image}
                            alt={`${card.title} slide ${index + 1}`}
                            className="best-pick-image"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Link>
                </div>

                <div className="best-pick-content">
                  <h3>{card.title}</h3>
                  <p>{card.subtitle}</p>
                  <div className="best-pick-dots" aria-hidden="true">
                    {card.images.map((_, index) => (
                      <span key={`${card.slug}-dot-${index}`} className="best-pick-dot" />
                    ))}
                  </div>
                  <Link to={`/home-showcase/${card.slug}`} className="best-pick-link">
                    Open Gallery
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </>

  );

}
