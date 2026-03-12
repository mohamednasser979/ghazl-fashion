import { useEffect, useState } from "react";
import api from "../utils/api";
import { formatEGP } from "../utils/pricing";
import { applyImageFallback, buildUploadFallbackUrl, buildUploadUrl } from "../utils/images";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [productImageLookup, setProductImageLookup] = useState({});
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    status: "",
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get("/orders"),
          api.get("/products"),
        ]);

        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);

        const nextLookup = {};
        const products = Array.isArray(productsRes.data) ? productsRes.data : [];

        products.forEach((product) => {
          const normalizedName = String(product?.name || "").trim().toLowerCase();
          const productImage = product?.images?.[0] || product?.image || "";

          if (normalizedName && productImage && !nextLookup[normalizedName]) {
            nextLookup[normalizedName] = productImage;
          }
        });

        setProductImageLookup(nextLookup);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (id, orderStatus) => {
    await api.put(`/orders/${id}`, { orderStatus });

    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, orderStatus } : order
      )
    );
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    await api.delete(`/orders/${id}`);

    setOrders((prev) => prev.filter((order) => order._id !== id));
  };

  const getStatusBadge = (status) => {
    if (status === "processing") {
      return <span className="badge bg-warning text-dark">Processing</span>;
    }

    if (status === "shipped") {
      return <span className="badge bg-primary">Shipped</span>;
    }

    if (status === "delivered") {
      return <span className="badge bg-success">Delivered</span>;
    }

    return <span className="badge bg-secondary">{status}</span>;
  };

  const resolveImageSrc = (item) => {
    const fallbackByName =
      productImageLookup[String(item?.name || "").trim().toLowerCase()] || "";

    const candidates = [
      item?.image,
      item?.imageUrl,
      item?.images?.[0],
      item?.productId?.images?.[0],
      item?.productId?.image,
      fallbackByName,
    ];

    for (const candidate of candidates) {
      if (!candidate) continue;

      const raw = String(candidate).trim();
      if (!raw) continue;

      if (raw.startsWith("/images/")) {
        return raw;
      }

      if (/^https?:\/\//i.test(raw)) {
        return raw;
      }

      const uploadSrc = buildUploadUrl(raw);
      if (uploadSrc) {
        return uploadSrc;
      }
    }

    return "";
  };

  const filteredOrders = orders.filter((order) => {
    const orderItems = Array.isArray(order.items) ? order.items : [];

    const matchName =
      filters.name === "" ||
      orderItems.some((i) =>
        String(i?.name || "").toLowerCase().includes(filters.name.toLowerCase())
      );

    const matchCity =
      filters.city === "" ||
      order.shippingAddress?.city
        ?.toLowerCase()
        .includes(filters.city.toLowerCase());

    const matchStatus =
      filters.status === "" || order.orderStatus === filters.status;

    return matchName && matchCity && matchStatus;
  });

  const nextImage = () => {
    if (previewImages.length <= 1) return;

    setCurrentImage((prev) =>
      prev === previewImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (previewImages.length <= 1) return;

    setCurrentImage((prev) =>
      prev === 0 ? previewImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="fw-bold mb-4">Orders</h2>

      <div className="orders-table-wrapper">
        <table className="table table-bordered align-middle orders-table">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Products</th>
              <th>Total</th>
              <th>City</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Change</th>
              <th>Action</th>
            </tr>

            <tr className="table-light">
              <th></th>

              <th>
                <input
                  className="form-control"
                  placeholder="Search product"
                  onChange={(e) =>
                    setFilters({ ...filters, name: e.target.value })
                  }
                />
              </th>

              <th></th>

              <th>
                <input
                  className="form-control"
                  placeholder="City"
                  onChange={(e) =>
                    setFilters({ ...filters, city: e.target.value })
                  }
                />
              </th>

              <th></th>
              <th></th>

              <th>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </th>

              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                <td>
                  {(Array.isArray(order.items) ? order.items : []).map((item, index) => {
                    const imageSrc = resolveImageSrc(item);

                    return (
                      <div key={index} className="mb-2">
                        <div className="d-flex align-items-center">
                          {imageSrc && (
                            <img
                              src={imageSrc}
                              alt={`${item.name || "Product"} preview`}
                              width="45"
                              className="me-2 rounded"
                              style={{ cursor: "pointer" }}
                              onError={(event) =>
                                applyImageFallback(
                                  event,
                                  buildUploadFallbackUrl(
                                    item.image ||
                                      item?.productId?.images?.[0] ||
                                      item?.productId?.image ||
                                      item.imageUrl
                                  )
                                )
                              }
                              onClick={() => {
                                const orderItemImages = (Array.isArray(order.items)
                                  ? order.items
                                  : [])
                                  .map((entry) => resolveImageSrc(entry))
                                  .filter(Boolean);
                                const uniqueImages = [...new Set(orderItemImages)];
                                const selectedIndex = Math.max(
                                  uniqueImages.indexOf(imageSrc),
                                  0
                                );

                                setPreviewImages(uniqueImages);
                                setCurrentImage(selectedIndex);
                              }}
                            />
                          )}

                          {!imageSrc && (
                            <div className="order-item-no-image me-2">
                              No image
                            </div>
                          )}

                          <div>
                            {item.name} x {item.qty}

                            <div style={{ fontSize: "12px" }}>
                              Size: {item.size}
                            </div>

                            <div style={{ fontSize: "12px" }}>
                              Color: {item.color}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </td>

                <td className="fw-bold">{formatEGP(order.totalPrice)}</td>
                <td>{order.shippingAddress?.city}</td>
                <td>{order.shippingAddress?.phone}</td>
                <td>{order.shippingAddress?.address}</td>
                <td>{getStatusBadge(order.orderStatus)}</td>

                <td>
                  <select
                    className="form-select"
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteOrder(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewImages.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setPreviewImages([])}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImages[currentImage]}
              alt="Order item preview"
              style={{
                maxWidth: "80vw",
                maxHeight: "80vh",
                borderRadius: "10px",
              }}
            />

            <div className="text-center mt-3">
              <button className="btn btn-light me-2" onClick={prevImage}>
                {"<"}
              </button>

              <button className="btn btn-light" onClick={nextImage}>
                {">"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
