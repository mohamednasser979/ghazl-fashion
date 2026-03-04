export default function AdminStats({ orders, products }) {

  const totalSales = orders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  return (
    <div className="row mb-4">

      <div className="col-md-4">
        <div className="card p-3 shadow-sm">
          <h6>Total Orders</h6>
          <h3>{orders.length}</h3>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card p-3 shadow-sm">
          <h6>Total Products</h6>
          <h3>{products.length}</h3>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card p-3 shadow-sm">
          <h6>Total Sales</h6>
          <h3>${totalSales}</h3>
        </div>
      </div>

    </div>
  );
}