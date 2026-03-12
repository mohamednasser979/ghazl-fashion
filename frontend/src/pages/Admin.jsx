import { useEffect, useState } from "react";
import api from "../utils/api";
import EditProductModal from "../components/EditProductModal";
import { formatEGP } from "../utils/pricing";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(
        `/products/${id}`,
        { headers: { Authorization: token } }
      );

      fetchProducts();
    } catch {
      alert("Admins only ❌");
    }
  };

  return (
    <div className="container mt-5 pt-5">

      <h2>Admin Panel 👑</h2>

      {products.map((p) => (
        <div
          key={p._id}
          className="card p-3 mb-3 shadow-sm"
        >
          <img src={p.image} alt={p.name} width="100" />

          <h5>{p.name}</h5>
          <p>{formatEGP(p.price)}</p>

          <button
            className="btn btn-sm btn-dark me-2"
            onClick={() => setSelected(p)}
          >
            Edit
          </button>

          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(p._id)}
          >
            Delete
          </button>
        </div>
      ))}

      {selected && (
        <EditProductModal
          product={selected}
          onClose={() => setSelected(null)}
          refresh={fetchProducts}
        />
      )}
    </div>
  );
}
