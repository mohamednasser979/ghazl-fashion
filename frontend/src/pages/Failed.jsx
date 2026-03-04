import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Failed() {
  const { t } = useTranslation();

  return (
    <div className="container mt-5 pt-5 text-center">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mb-3">❌</h1>

        <h2>{t("paymentFailed")}</h2>

        <p className="text-muted mt-2">
          {t("tryAgain")}
        </p>

        <a href="/checkout" className="btn btn-dark mt-3">
          {t("retryPayment")}
        </a>
      </motion.div>

    </div>
  );
}
