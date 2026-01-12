import dotenv from "dotenv";
dotenv.config();

import { sendOrderNotificationToAdmins } from "../src/lib/mailer.js";

(async () => {
  try {
    const fakeOrder = {
      id: "test-order-1",
      secretCode: "FF-TEST-1234",
      total: 12345,
      user: { name: "Test User" },
    };

    await sendOrderNotificationToAdmins(fakeOrder);
    console.log(
      "sendOrderNotificationToAdmins executed (check logs for details)"
    );
  } catch (err) {
    console.error("Test script failed:", err);
  }
})();
