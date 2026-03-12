import { Link, useParams } from "react-router-dom";
import { homeShowcases } from "../data/homeShowcases";

export default function HomeShowcase() {
  const { slug } = useParams();

  const showcase = homeShowcases.find((item) => item.slug === slug);

  if (!showcase) {
    return (
      <section className="showcase-page">
        <div className="showcase-shell">
          <div className="showcase-not-found">
            <h2>Collection not found</h2>
            <p>This gallery does not exist anymore.</p>
            <Link to="/" className="showcase-btn">
              Back To Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const [firstImage, secondImage, thirdImage] = showcase.images;

  return (
    <section className="showcase-page">
      <div className="showcase-shell">
        <div className="showcase-hero-card">
          <span className="showcase-badge">Collection Spotlight</span>
          <h1>{showcase.title}</h1>
          <p>{showcase.intro}</p>

          <div className="showcase-actions">
            <Link to="/products" className="showcase-btn">
              Shop This Style
            </Link>
            <Link to="/" className="showcase-btn showcase-btn-ghost">
              Back Home
            </Link>
          </div>
        </div>

        <div className="showcase-gallery">
          <figure className="showcase-image-card showcase-image-main">
            <img src={firstImage} alt={`${showcase.title} view 1`} />
          </figure>

          <figure className="showcase-image-card">
            <img src={secondImage} alt={`${showcase.title} view 2`} />
          </figure>

          <figure className="showcase-image-card">
            <img src={thirdImage} alt={`${showcase.title} view 3`} />
          </figure>
        </div>
      </div>
    </section>
  );
}
