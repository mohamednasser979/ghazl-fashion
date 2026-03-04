import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        home: "Home",
        shop: "Shop",
        cart: "Cart",
        checkout: "Checkout",
        heroTitle: "Elevate Your Style",
        heroSubtitle: "Modern fashion inspired by elegance",
        shopNow: "Shop Now",
        productsTitle: "Shop Our Collection",
        addToCart: "Add to Cart",
        yourCart: "Your Cart",
        emptyCart: "Your cart is empty",
        total: "Total",
        // eslint-disable-next-line no-dupe-keys
        checkout: "Checkout",
        placeOrder: "Place Order",
        shippingAddress: "Shipping Address",
        orderSummary: "Order Summary",
      },
    },
    ar: {
      translation: {
        home: "الرئيسية",
        shop: "المتجر",
        cart: "السلة",
        checkout: "الدفع",
        heroTitle: "ارتقِ بذوقك",
        heroSubtitle: "أناقة عصرية مستوحاة من الفخامة",
        shopNow: "تسوق الآن",
        productsTitle: "تسوق مجموعتنا",
        addToCart: "أضف إلى السلة",
        yourCart: "سلة التسوق",
        emptyCart: "السلة فارغة",
        total: "الإجمالي",
        // eslint-disable-next-line no-dupe-keys
        checkout: "الدفع",
        placeOrder: "إتمام الطلب",
        shippingAddress: "عنوان الشحن",
        orderSummary: "ملخص الطلب",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
