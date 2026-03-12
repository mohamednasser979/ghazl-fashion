// NOTE:
// Home "Best Products" uses static files from frontend/public/images/genesis
// Keep folder name and file names lowercase for Linux hosts like Railway.
const GENESIS_BASE = "/images/genesis";

export const homeShowcases = [
  {
    slug: "best-product-01",
    title: "Best Product 01",
    subtitle: "Top-selling style with premium finishing.",
    intro:
      "A polished look with soft texture and refined details for everyday elegance.",
    images: [
      `${GENESIS_BASE}/genesis-1.jpeg`,
      `${GENESIS_BASE}/genesis-2.jpeg`,
      `${GENESIS_BASE}/genesis-3.jpeg`,
    ],
  },
  {
    slug: "best-product-02",
    title: "Best Product 02",
    subtitle: "Elegant cut designed for everyday luxury.",
    intro:
      "Structured silhouette with modern comfort, crafted for effortless styling.",
    images: [
      `${GENESIS_BASE}/genesis-4.jpg`,
      `${GENESIS_BASE}/genesis-5.jpeg`,
      `${GENESIS_BASE}/genesis-6.jpg`,
    ],
  },
  {
    slug: "best-product-03",
    title: "Best Product 03",
    subtitle: "Customer favorite in soft and timeless tones.",
    intro:
      "A timeless statement piece with balanced colors and smooth premium drape.",
    images: [
      `${GENESIS_BASE}/genesis-7.jpeg`,
      `${GENESIS_BASE}/genesis-8.jpeg`,
      `${GENESIS_BASE}/genesis-9.jpeg`,
    ],
  },
];
