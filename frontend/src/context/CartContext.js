import { createContext, useContext, useEffect, useRef, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
  });
  const [cartUpdated, setCartUpdated] = useState(false);
  const cartUpdateTimerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    return () => {
      if (cartUpdateTimerRef.current) {
        clearTimeout(cartUpdateTimerRef.current);
      }
    };
  }, []);

  const triggerCartUpdated = () => {
    setCartUpdated(true);

    if (cartUpdateTimerRef.current) {
      clearTimeout(cartUpdateTimerRef.current);
    }

    cartUpdateTimerRef.current = setTimeout(() => {
      setCartUpdated(false);
    }, 650);
  };

  const addToCart = (product) => {

    triggerCartUpdated();

    setCart((prevCart) => {
      const existing = prevCart.find(
        item =>
          item._id === product._id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
      );

      if (existing) {
        return prevCart.map(item =>
          item._id === product._id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (index) => {

    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);

  };

  const decreaseQty = (index) => {

    const updated = [...cart];

    if (updated[index].qty > 1) {
      updated[index].qty -= 1;
    } else {
      updated.splice(index, 1);
    }

    setCart(updated);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartUpdated,
        addToCart,
        removeFromCart,
        decreaseQty,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
