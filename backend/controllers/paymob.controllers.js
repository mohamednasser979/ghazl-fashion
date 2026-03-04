const axios = require("axios");

exports.payWithPaymob = async (req, res) => {
  try {
    const { amount } = req.body;

    /* STEP 1 – AUTH TOKEN */
    const authResponse = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      {
        api_key: process.env.PAYMOB_API_KEY,
      }
    );

    const authToken = authResponse.data.token;

    /* STEP 2 – ORDER REGISTRATION */
    const orderResponse = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: amount * 100,
        currency: "EGP",
        items: [],
      }
    );

    const orderId = orderResponse.data.id;

    /* STEP 3 – PAYMENT KEY */
    const paymentKeyResponse = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: authToken,
        amount_cents: amount * 100,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: "NA",
          email: "test@test.com",
          floor: "NA",
          first_name: "Test",
          street: "NA",
          building: "NA",
          phone_number: "01000000000",
          shipping_method: "NA",
          postal_code: "NA",
          city: "Cairo",
          country: "EG",
          last_name: "User",
          state: "NA",
        },
        currency: "EGP",
        integration_id: process.env.PAYMOB_INTEGRATION_ID,
      }
    );

    const paymentToken = paymentKeyResponse.data.token;

    /* FINAL PAYMOB URL */
  const iframeURL = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}&redirect_url=http://localhost:3000/success`;

    res.json({ url: iframeURL });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "Payment Error ❌" });
  }
};
