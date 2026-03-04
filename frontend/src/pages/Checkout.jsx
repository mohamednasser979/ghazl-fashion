import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {

  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handleChange = (e) => {
    setShipping({
      ...shipping,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {

      const formattedItems = cart.map(item => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image,
        size: item.selectedSize,
        color: item.selectedColor
      }));

      await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: formattedItems,
          totalPrice,
          shippingAddress: shipping,
        },
        {
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      clearCart();

      alert("Order placed successfully!");

      navigate("/");

    } catch (error) {

      console.log(error.response?.data || error.message);

      alert("Error placing order");

    }

  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Checkout</h2>

      <form onSubmit={handleSubmit} className="row g-3">

        <div className="col-md-6">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="form-control"
            value={shipping.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="form-control"
            value={shipping.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-8">
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="form-control"
            value={shipping.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            className="form-control"
            value={shipping.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12">
          <h5>Total: ${totalPrice}</h5>
        </div>

        <div className="col-12">
          <button className="btn btn-dark w-100">
            Place Order
          </button>
        </div>

      </form>

    </div>
  );

}