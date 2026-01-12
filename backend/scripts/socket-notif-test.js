import axios from "axios";
import { io } from "socket.io-client";

const BASE = "http://localhost:3005";

async function getToken(email, password) {
  const res = await axios.post(`${BASE}/api/auth/signin`, { email, password });
  return res.data.token;
}

async function createOrder(userToken, dishId) {
  const res = await axios.post(
    `${BASE}/api/orders`,
    { items: [{ dishId, quantity: 1 }], seats: 1 },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );
  return res.data;
}

async function run() {
  try {
    console.log("Logging admin...");
    const adminToken = await getToken("admin@foodfest.com", "password123");

    console.log("Connecting socket as admin...");
    const socket = io(BASE.replace(/\/api\/?$/, ""), {
      auth: { token: adminToken },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("notification", (n) => {
      console.log("Received notification via socket:", n);
      process.exit(0);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err.message);
      process.exit(1);
    });

    // Wait a moment to ensure socket is connected
    await new Promise((r) => setTimeout(r, 1000));

    console.log("Logging user and creating order...");
    const userToken = await getToken("user@foodfest.com", "password123");

    // Get a dish id to create order with
    const dishesRes = await axios.get(`${BASE}/api/dishes`);
    const dishId = dishesRes.data.dishes?.[0]?.id;
    if (!dishId) {
      console.error("No dish found to create order");
      process.exit(1);
    }

    const order = await createOrder(userToken, dishId);
    console.log("Order created:", order.id);

    // Wait up to 10 seconds for notification
    setTimeout(() => {
      console.error("No notification received within timeout");
      process.exit(1);
    }, 10000);
  } catch (err) {
    console.error("Test failed:", err.message || err);
    process.exit(1);
  }
}

run();
