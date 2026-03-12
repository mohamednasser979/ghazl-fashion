import { useEffect, useState } from "react";
import api from "../utils/api";
import { formatEGP } from "../utils/pricing";

function AdminDashboard() {

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    processingOrders: 0,
    totalRevenue: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {

    const fetchStats = async () => {

      try{

        const res = await api.get(
          "/dashboard",
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );

        setStats(res.data);

      }catch(error){
        console.log(error);
      }

    };

    fetchStats();

  },[token]);

  return (

    <div className="container-fluid admin-dashboard mt-4">

      <h2 className="mb-4 fw-bold">Admin Dashboard</h2>

      <div className="row g-4">

        {/* PRODUCTS */}

        <div className="col-12 col-sm-6 col-xl-3">

          <div className="card shadow border-0 rounded-4 text-center p-4">

            <h6 className="text-muted">Total Products</h6>

            <h2 className="fw-bold text-primary">
              {stats.totalProducts}
            </h2>

          </div>

        </div>


        {/* ORDERS */}

        <div className="col-12 col-sm-6 col-xl-3">

          <div className="card shadow border-0 rounded-4 text-center p-4">

            <h6 className="text-muted">Total Orders</h6>

            <h2 className="fw-bold text-success">
              {stats.totalOrders}
            </h2>

          </div>

        </div>


        {/* PROCESSING */}

        <div className="col-12 col-sm-6 col-xl-3">

          <div className="card shadow border-0 rounded-4 text-center p-4">

            <h6 className="text-muted">Processing Orders</h6>

            <h2 className="fw-bold text-warning">
              {stats.processingOrders}
            </h2>

          </div>

        </div>


        {/* DELIVERED */}

        <div className="col-12 col-sm-6 col-xl-3">

          <div className="card shadow border-0 rounded-4 text-center p-4">

            <h6 className="text-muted">Delivered Orders</h6>

            <h2 className="fw-bold text-info">
              {stats.deliveredOrders}
            </h2>

          </div>

        </div>


        {/* REVENUE */}

        <div className="col-12">

          <div className="card shadow border-0 rounded-4 text-center p-4">

            <h6 className="text-muted">Total Revenue</h6>

            <h1 className="fw-bold text-danger">
              {formatEGP(stats.totalRevenue)}
            </h1>

          </div>

        </div>

      </div>

    </div>

  );

}

export default AdminDashboard;
