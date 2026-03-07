import { useEffect, useState } from "react";
import api from "../utils/api";
import { useTranslation } from "react-i18next";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-5 pt-5">

      <h2 className="mb-4">{t("myOrders")}</h2>

      {orders.length === 0 ? (
        <h5>{t("noOrders")}</h5>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card mb-3 shadow-sm border-0 p-3">

            <div className="d-flex justify-content-between">
              <strong>Order #{order._id.slice(-6)}</strong>
              <span>{order.paymentStatus}</span>
            </div>

            <div className="text-muted">
              {t("total")}: ${order.totalPrice}
            </div>

            <div>
              {t("status")}: {order.orderStatus}
            </div>

          </div>
        ))
      )}
    </div>
  );
}
