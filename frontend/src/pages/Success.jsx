import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function Success() {
  const { clearCart } = useCart();
  const { t } = useTranslation();

  // مسح السلة بعد نجاح الدفع 👑
  useEffect(() => {
    clearCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mt-5 pt-5 text-center">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mb-3">🎉</h1>

        <h2>{t("paymentSuccess")}</h2>

        <p className="text-muted mt-2">
          {t("thankYouOrder")}
        </p>

        <a href="/" className="btn btn-dark mt-3">
          {t("continueShopping")}
        </a>
      </motion.div>

    </div>
  );
}
