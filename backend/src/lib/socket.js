import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { db } from "./db.js";
import { users } from "./schema.js";

let io;

export function initSocket(server, options = {}) {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "http://localhost:3000",
      ],
      credentials: true,
    },
    ...options,
  });

  // Authenticate socket connections using token (handshake.auth.token or Authorization header)
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");
      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userRow = await db
        .select({
          id: users.id,
          role: users.role,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1);
      const user = userRow[0];
      if (!user) return next(new Error("Unauthorized"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    // Admins join an 'admins' room to receive admin notifications
    if (socket.user?.role === "ADMIN" || socket.user?.role === "SUPER_ADMIN") {
      socket.join("admins");
    }

    socket.on("disconnect", () => {
      // cleanup if needed
    });
  });

  return io;
}

export function emitNotificationToAdmins(notification) {
  if (!io) return;
  io.to("admins").emit("notification", notification);
}

export function getIo() {
  return io;
}
