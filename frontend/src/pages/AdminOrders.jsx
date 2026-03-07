import { useEffect, useState } from "react";
import api from "../utils/api";

export default function AdminOrders() {

  const [orders,setOrders] = useState([]);

  const [filters,setFilters] = useState({
    name:"",
    city:"",
    status:""
  });

  const token = localStorage.getItem("token");

  useEffect(()=>{

    const fetchOrders = async()=>{

      const res = await api.get(
        "/orders",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setOrders(res.data);

    };

    fetchOrders();

  },[token]);


  const updateStatus = async(id,orderStatus)=>{

    await api.put(
      `/orders/${id}`,
      {orderStatus},
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    setOrders(prev =>
      prev.map(order =>
        order._id === id
          ? {...order,orderStatus}
          : order
      )
    );

  };


  const deleteOrder = async(id)=>{

    if(!window.confirm("Delete this order?")) return;

    await api.delete(
      `/orders/${id}`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    setOrders(prev =>
      prev.filter(order => order._id !== id)
    );

  };


  const getStatusBadge = (status)=>{

    if(status === "processing")
      return <span className="badge bg-warning text-dark">Processing</span>;

    if(status === "shipped")
      return <span className="badge bg-primary">Shipped</span>;

    if(status === "delivered")
      return <span className="badge bg-success">Delivered</span>;

  };


  const filteredOrders = orders.filter(order => {

    const matchName =
      filters.name === "" ||
      order.items.some(i =>
        i.name.toLowerCase().includes(filters.name.toLowerCase())
      );

    const matchCity =
      filters.city === "" ||
      order.shippingAddress?.city
        ?.toLowerCase()
        .includes(filters.city.toLowerCase());

    const matchStatus =
      filters.status === "" ||
      order.orderStatus === filters.status;

    return matchName && matchCity && matchStatus;

  });


  return (

    <div className="container-fluid mt-4">

      <h2 className="fw-bold mb-4">Orders</h2>

      <div className="orders-table-wrapper">

        <table className="table table-bordered align-middle orders-table">

          <thead className="table-dark">

            <tr>

              <th style={{minWidth:"120px"}}>Date</th>

              <th style={{minWidth:"300px"}}>Products</th>

              <th style={{minWidth:"120px"}}>Total</th>

              <th style={{minWidth:"160px"}}>City</th>

              <th style={{minWidth:"160px"}}>Phone</th>

              <th style={{minWidth:"260px"}}>Address</th>

              <th style={{minWidth:"150px"}}>Status</th>

              <th style={{minWidth:"160px"}}>Change</th>

              <th style={{minWidth:"120px"}}>Action</th>

            </tr>

            <tr className="table-light">

              <th></th>

              <th>
                <input
                  className="form-control"
                  placeholder="Search product"
                  onChange={e =>
                    setFilters({...filters,name:e.target.value})
                  }
                />
              </th>

              <th></th>

              <th>
                <input
                  className="form-control"
                  placeholder="City"
                  onChange={e =>
                    setFilters({...filters,city:e.target.value})
                  }
                />
              </th>

              <th></th>

              <th></th>

              <th>
                <select
                  className="form-select"
                  onChange={e =>
                    setFilters({...filters,status:e.target.value})
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

            {filteredOrders.map(order => (

              <tr key={order._id}>

                <td>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td>

                  {order.items.map((item,index)=>(
                    <div key={index} className="mb-2">

                      <div className="d-flex align-items-center">

                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            width="40"
                            className="me-2 rounded"
                          />
                        )}

                        <div>

                          {item.name} × {item.qty}

                          <div style={{fontSize:"12px"}}>
                            Size: {item.size}
                          </div>

                          <div style={{fontSize:"12px"}}>
                            Color: {item.color}
                          </div>

                        </div>

                      </div>

                    </div>
                  ))}

                </td>

                <td className="fw-bold">
                  ${order.totalPrice}
                </td>

                <td>
                  {order.shippingAddress?.city}
                </td>

                <td>
                  {order.shippingAddress?.phone}
                </td>

                <td>
                  {order.shippingAddress?.address}
                </td>

                <td>
                  {getStatusBadge(order.orderStatus)}
                </td>

                <td>

                  <select
                    className="form-select"
                    value={order.orderStatus}
                    onChange={e =>
                      updateStatus(order._id,e.target.value)
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

    </div>

  );

}