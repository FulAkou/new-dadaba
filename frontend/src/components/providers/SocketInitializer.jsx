"use client";

import socket from "@/lib/socket";
import { useAuthStore, useNotificationStore, useSocketStore } from "@/store";
import { Bell } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";

const SocketInitializer = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { setIsConnected, setSocket } = useSocketStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect socket
      socket.connect();
      setSocket(socket);

      socket.on("connect", () => {
        setIsConnected(true);
        console.log("Socket connected");
        // Join user specific room
        socket.emit("join", user.id);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
        console.log("Socket disconnected");
      });

      // Listen for notifications
      socket.on("notification", (notification) => {
        addNotification(notification);
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-3xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}
            >
              <div className="flex-1 w-0 p-1">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-500">
                      <Bell className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-bold text-secondary-900">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs text-secondary-500">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-secondary-100">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-3xl p-4 flex items-center justify-center text-xs font-black uppercase text-primary-500 hover:text-primary-700 focus:outline-none"
                >
                  Fermer
                </button>
              </div>
            </div>
          ),
          { duration: 5000 }
        );
      });

      // Listen for order status updates
      socket.on("orderStatusUpdated", (data) => {
        toast.success(
          `Commande #${data.orderId.slice(-6).toUpperCase()} : ${data.status}`,
          {
            icon: "🍱",
            duration: 6000,
          }
        );
        console.log("Order status updated:", data);
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("notification");
        socket.off("orderStatusUpdated");
        socket.disconnect();
      };
    } else {
      socket.disconnect();
    }
  }, [isAuthenticated, user, setIsConnected, setSocket, addNotification]);

  return null;
};

export default SocketInitializer;
