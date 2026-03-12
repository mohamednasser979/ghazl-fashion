import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import { resolveSoldOutValue } from "../utils/soldOut";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const productName = String(product.name || "").toLowerCase();
      const productDescription = String(product.description || "").toLowerCase();
      const isSoldOut = resolveSoldOutValue(product);

      const matchesSearch =
        !normalizedTerm ||
        productName.includes(normalizedTerm) ||
        productDescription.includes(normalizedTerm);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && !isSoldOut) ||
        (statusFilter === "soldout" && isSoldOut);

      return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered];

    if (sortBy === "price-low") {
      sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === "name-az") {
      sorted.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }

    return sorted;
  }, [products, searchTerm, statusFilter, sortBy]);

  return (
    <section className="shop-page">
      <div className="shop-bg-glow shop-bg-glow-left" aria-hidden="true" />
      <div className="shop-bg-glow shop-bg-glow-right" aria-hidden="true" />

      <div className="container shop-container">
        <header className="shop-hero">
          <p className="shop-kicker">Ghazl Fashion</p>
          <h1>Shop The Collection</h1>
          <p>
            Find your perfect fit with premium fabrics, elegant tones, and modern cuts.
          </p>
        </header>

        <div className="shop-toolbar">
          <div className="shop-search-wrap">
            <label htmlFor="shop-search" className="shop-toolbar-label">
              Search
            </label>
            <input
              id="shop-search"
              type="search"
              className="shop-search-input"
              placeholder="Search by name or description"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="shop-filter-wrap">
            <span className="shop-toolbar-label">Status</span>
            <div className="shop-filter-chips">
              <button
                type="button"
                className={`shop-filter-chip ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={`shop-filter-chip ${statusFilter === "available" ? "active" : ""}`}
                onClick={() => setStatusFilter("available")}
              >
                Available
              </button>
              <button
                type="button"
                className={`shop-filter-chip ${statusFilter === "soldout" ? "active" : ""}`}
                onClick={() => setStatusFilter("soldout")}
              >
                Sold Out
              </button>
            </div>
          </div>

          <div className="shop-sort-wrap">
            <label htmlFor="shop-sort" className="shop-toolbar-label">
              Sort By
            </label>
            <select
              id="shop-sort"
              className="shop-sort-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="shop-results-row">
          <p className="shop-results-count">
            Showing <strong>{visibleProducts.length}</strong> of{" "}
            <strong>{products.length}</strong> products
          </p>
        </div>

        {isLoading ? (
          <div className="shop-empty-state">
            <h3>Loading products...</h3>
            <p>Please wait a moment.</p>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="shop-empty-state">
            <h3>No products match your search</h3>
            <p>Try another keyword or change filters.</p>
          </div>
        ) : (
          <div className="row g-4 shop-grid-row">
            {visibleProducts.map((product) => (
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
