import { useEffect, useState } from "react";
import api from "../utils/api";
import AdminLayout from "../components/AdminLayout";

export default function AdminStats() {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    const res = await api.get("/admin/stats", {
      headers: { Authorization: token },
    });

    setStats(res.data);
  };

  return (
    <AdminLayout>

      <h3>Stats 🔥</h3>

      <div className="row">

        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h6>Products</h6>
            <h3>{stats.products}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h6>Orders</h6>
            <h3>{stats.orders}</h3>
          </div>
        </div>

      </div>

    </AdminLayout>
  );
}
