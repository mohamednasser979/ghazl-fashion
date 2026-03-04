import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="admin-sidebar">

      <h4 className="mb-4">Admin 👑</h4>

      <Link to="/admin">Dashboard</Link>
      <Link to="/admin/orders">Orders</Link>
      <Link to="/admin/products">Products</Link>

    </div>
  );
}