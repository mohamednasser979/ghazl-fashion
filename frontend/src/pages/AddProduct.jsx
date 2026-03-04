import { useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

export default function AddProduct() {
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const handleAdd = async () => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", image);

    await axios.post("http://localhost:5000/api/products", formData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Product Added ✅");
  };

  return (
    <AdminLayout>

      <h3>Add Product 🔥</h3>

      <input className="form-control mb-2" placeholder="Name"
        onChange={(e) => setName(e.target.value)} />

      <input className="form-control mb-2" placeholder="Price"
        onChange={(e) => setPrice(e.target.value)} />

      <input className="form-control mb-2" placeholder="Category"
        onChange={(e) => setCategory(e.target.value)} />

      <input className="form-control mb-3" type="file"
        onChange={(e) => setImage(e.target.files[0])} />

      <button className="btn btn-dark" onClick={handleAdd}>
        Add Product
      </button>

    </AdminLayout>
  );
}
