export default function Sidebar() {
  return (
    <div className="bg-black text-light p-3" style={{ width: 250, minHeight: "100vh" }}>
      <h4 className="mb-4">Admin 😎</h4>

      <div className="d-flex flex-column gap-3">
        <a href="/admin" className="text-light text-decoration-none">Products</a>
        <a href="/admin/orders" className="text-light text-decoration-none">Orders</a>
        <a href="/admin/stats" className="text-light text-decoration-none">Stats</a>
      </div>
    </div>
  );
}
