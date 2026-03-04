import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider }from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <AuthProvider>
    <CartProvider>
      <App />
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
);