import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLanguage =
  typeof window !== "undefined" ? localStorage.getItem("appLang") : null;

const initialLanguage =
  savedLanguage === "ar" || savedLanguage === "en" ? savedLanguage : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        home: "Home",
        shop: "Shop",
        cart: "Cart",
        checkout: "Checkout",
        login: "Login",
        register: "Register",
        logout: "Logout",
        remove: "Remove",
        languageToggle: "Switch Language",
        heroTitle: "Own The Moment. Wear Ghazl.",
        heroSubtitle: "Modern fashion inspired by elegance",
        shopNow: "Shop Now",
        productsTitle: "Shop Our Collection",
        addToCart: "Add to Cart",
        yourCart: "Your Cart",
        emptyCart: "Your cart is empty",
        shippingAddress: "Shipping Address",
        fullName: "Full Name",
        phone: "Phone",
        address: "Address",
        city: "City",
        orderSummary: "Order Summary",
        total: "Total",
        placeOrder: "Place Order",
        payNow: "Pay Now",
        paymentSuccess: "Payment Successful",
        thankYouOrder: "Thank you for your purchase",
        continueShopping: "Continue Shopping",
        paymentFailed: "Payment Failed",
        tryAgain: "Something went wrong during payment",
        retryPayment: "Retry Payment",
        myOrders: "My Orders",
        noOrders: "No Orders Yet",
        status: "Order Status",
      },
    },
    ar: {
      translation: {
        home: "\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
        shop: "\u0627\u0644\u0645\u062a\u062c\u0631",
        cart: "\u0627\u0644\u0633\u0644\u0629",
        checkout: "\u0627\u0644\u062f\u0641\u0639",
        login: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
        register: "\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628",
        logout: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c",
        remove: "\u0625\u0632\u0627\u0644\u0629",
        languageToggle: "\u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u0644\u063a\u0629",
        heroTitle: "\u0627\u0631\u062a\u0642\u0650 \u0628\u0630\u0648\u0642\u0643",
        heroSubtitle:
          "\u0623\u0646\u0627\u0642\u0629 \u0639\u0635\u0631\u064a\u0629 \u0645\u0633\u062a\u0648\u062d\u0627\u0629 \u0645\u0646 \u0627\u0644\u0641\u062e\u0627\u0645\u0629",
        shopNow: "\u062a\u0633\u0648\u0642 \u0627\u0644\u0622\u0646",
        productsTitle: "\u062a\u0633\u0648\u0642 \u0645\u062c\u0645\u0648\u0639\u062a\u0646\u0627",
        addToCart: "\u0623\u0636\u0641 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629",
        yourCart: "\u0633\u0644\u0629 \u0627\u0644\u062a\u0633\u0648\u0642",
        emptyCart: "\u0627\u0644\u0633\u0644\u0629 \u0641\u0627\u0631\u063a\u0629",
        shippingAddress: "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0634\u062d\u0646",
        fullName: "\u0627\u0644\u0627\u0633\u0645 \u0628\u0627\u0644\u0643\u0627\u0645\u0644",
        phone: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641",
        address: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
        city: "\u0627\u0644\u0645\u062f\u064a\u0646\u0629",
        orderSummary: "\u0645\u0644\u062e\u0635 \u0627\u0644\u0637\u0644\u0628",
        total: "\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a",
        placeOrder: "\u0625\u062a\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628",
        payNow: "\u0627\u062f\u0641\u0639 \u0627\u0644\u0622\u0646",
        paymentSuccess: "\u062a\u0645 \u0627\u0644\u062f\u0641\u0639 \u0628\u0646\u062c\u0627\u062d",
        thankYouOrder: "\u0634\u0643\u0631\u0627\u064b \u0644\u0637\u0644\u0628\u0643",
        continueShopping: "\u0645\u062a\u0627\u0628\u0639\u0629 \u0627\u0644\u062a\u0633\u0648\u0642",
        paymentFailed: "\u0641\u0634\u0644 \u0627\u0644\u062f\u0641\u0639",
        tryAgain:
          "\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u0639\u0645\u0644\u064a\u0629 \u0627\u0644\u062f\u0641\u0639",
        retryPayment: "\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629",
        myOrders: "\u0637\u0644\u0628\u0627\u062a\u064a",
        noOrders: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0637\u0644\u0628\u0627\u062a",
        status: "\u062d\u0627\u0644\u0629 \u0627\u0644\u0637\u0644\u0628",
      },
    },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: ["en", "ar"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
