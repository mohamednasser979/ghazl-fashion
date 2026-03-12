import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleAdminLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? "admin-sidebar-open" : ""}`}>
        <div className="admin-sidebar-head">
          <h4 className="mb-0">Admin Panel</h4>

          <button
            type="button"
            className="btn btn-sm btn-outline-light admin-close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            Close
          </button>
        </div>

        <ul className="nav flex-column mt-4">
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/dashboard">
              Dashboard
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/products">
              Products
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/orders">
              Orders
            </Link>
          </li>
        </ul>
      </aside>

      <button
        type="button"
        className={`admin-sidebar-backdrop ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close sidebar"
      />

      <main className="admin-main">
        <div className="admin-mobile-topbar">
          <button
            type="button"
            className="btn btn-dark btn-sm"
            onClick={() => setSidebarOpen(true)}
          >
            Menu
          </button>

          <span className="admin-mobile-title">Admin Panel</span>
        </div>

        <div className="admin-main-content">
          <Outlet />
        </div>
      </main>

      <button
        type="button"
        className="btn btn-danger admin-logout-fixed"
        onClick={handleAdminLogout}
      >
        Logout Admin
      </button>
    </div>
  );
}

export default AdminLayout;
