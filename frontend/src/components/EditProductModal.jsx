import { useState } from "react";
import axios from "axios";

export default function EditProductModal({
  product,
  onClose,
  refresh,
}) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/${product._id}`,
        { name, price, category }
      );

      alert("Updated ✅");
      refresh();
      onClose();
    } catch {
      alert("Update Failed ❌");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">

        <h4>Edit Product ✏️</h4>

        <input
          className="form-control mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="form-control mb-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="form-control mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button
          className="btn btn-dark w-100"
          onClick={handleUpdate}
        >
          Save
        </button>

        <button
          className="btn btn-light w-100 mt-2"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}