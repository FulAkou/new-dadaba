"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import notificationService from "@/services/notification.service";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Bell, Check, Clock, Info, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || data);
    } catch (error) {
      toast.error("Erreur lors du chargement des notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      toast.success("Toutes les notifications sont lues");
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "ORDER_CONFIRMED":
        return <Check className="w-5 h-5 text-green-500" />;
      case "ORDER_UPDATED":
        return <ShoppingBag className="w-5 h-5 text-blue-500" />;
      case "ORDER_CREATED":
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <Info className="w-5 h-5 text-primary-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black font-outfit text-secondary-900 leading-tight">
            Notifications
          </h1>
          <p className="text-secondary-500 font-medium">
            Restez informé de l&apos;actualité de vos commandes
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-primary-500 font-bold hover:text-primary-600"
          >
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-white rounded-3xl border border-secondary-100 animate-pulse"
            />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "group relative bg-white p-6 rounded-3xl border transition-all duration-300",
                notif.read
                  ? "border-secondary-100 opacity-70"
                  : "border-primary-100 shadow-lg shadow-primary-500/5 bg-primary-50/10"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "p-3 rounded-2xl flex-shrink-0",
                    notif.read ? "bg-secondary-50" : "bg-white shadow-sm"
                  )}
                >
                  {getIcon(notif.type)}
                </div>

                <div className="flex-grow space-y-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={cn(
                        "font-bold text-lg",
                        notif.read ? "text-secondary-600" : "text-secondary-900"
                      )}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-secondary-400 font-bold uppercase tracking-widest">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-500 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {!notif.read && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Marquer comme lu"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
              </div>

              {!notif.read && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-primary-500 rounded-r-full" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-secondary-100 space-y-6">
          <div className="w-24 h-24 bg-secondary-50 rounded-full flex items-center justify-center mx-auto text-secondary-300">
            <Bell className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-outfit text-secondary-900">
              Tout est calme ici
            </h3>
            <p className="text-secondary-500 max-w-sm mx-auto">
              Vous n&apos;avez aucune notification pour le moment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
