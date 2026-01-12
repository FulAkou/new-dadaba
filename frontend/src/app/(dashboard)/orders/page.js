"use client";

import Button from "@/components/ui/Button";
import orderService from "@/services/order.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Loader2,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data.orders || data);
      } catch (error) {
        toast.error("Erreur lors du chargement de vos commandes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const statusMap = {
    PENDING: {
      label: "En attente",
      color: "bg-yellow-100 text-yellow-600",
      icon: Clock,
    },
    CONFIRMED: {
      label: "Confirmé",
      color: "bg-blue-100 text-blue-600",
      icon: CheckCircle,
    },
    PREPARING: {
      label: "En préparation",
      color: "bg-orange-100 text-orange-600",
      icon: Truck,
    },
    READY: {
      label: "Prêt à retirer",
      color: "bg-indigo-100 text-indigo-600",
      icon: CheckCircle,
    },
    COMPLETED: {
      label: "Terminé",
      color: "bg-green-100 text-green-600",
      icon: Package,
    },
    CANCELLED: {
      label: "Annulé",
      color: "bg-red-100 text-red-600",
      icon: XCircle,
    },
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-secondary-500 font-bold font-outfit uppercase tracking-widest text-xs">
          Chargement de votre historique...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-4xl font-black font-outfit text-secondary-900 leading-tight">
          Historique des <span className="text-primary-500">Commandes</span>
        </h1>
        <p className="text-secondary-500 font-medium">
          Retrouvez ici toutes vos expériences gastronomiques au festival
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = statusMap[order.status] || statusMap.PENDING;
            const Icon = status.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-[2.5rem] border border-secondary-100 overflow-hidden hover:shadow-2xl hover:shadow-secondary-900/5 transition-all group"
              >
                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Info */}
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-secondary-50 rounded-2xl group-hover:bg-primary-50 transition-colors">
                      <ShoppingBag className="w-8 h-8 text-secondary-400 group-hover:text-primary-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-bold text-secondary-900">
                          Commande #{order.id.slice(-6).toUpperCase()}
                        </h4>
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status.color}`}
                        >
                          <Icon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-500 font-medium lowercase first-letter:uppercase">
                        Le{" "}
                        {format(
                          new Date(order.createdAt),
                          "dd MMMM yyyy à HH:mm",
                          { locale: fr }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center justify-between md:justify-end gap-10">
                    <div className="text-right">
                      <p className="text-xs text-secondary-400 font-bold uppercase tracking-widest leading-none mb-1">
                        Total
                      </p>
                      <p className="text-2xl font-black text-secondary-900 font-outfit">
                        {order.total.toFixed(2)} FCFA
                      </p>
                    </div>
                    <Link href={`/orders/${order.id}`}>
                      <button className="p-4 bg-secondary-900 text-white rounded-2xl hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/20 transition-all">
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="bg-secondary-50/50 px-8 py-4 border-t border-secondary-50 flex gap-4 overflow-x-auto custom-scrollbar">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-secondary-100 text-xs font-bold text-secondary-600"
                    >
                      <span className="text-primary-500">x{item.quantity}</span>{" "}
                      {item.dish?.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-secondary-100 space-y-6">
          <div className="w-24 h-24 bg-secondary-50 rounded-full flex items-center justify-center mx-auto text-secondary-200">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-outfit text-secondary-900">
              Aucune commande trouvée
            </h3>
            <p className="text-secondary-500 max-w-sm mx-auto">
              Vous n&apos;avez pas encore passé de commande. Découvrez notre
              menu pour commencer l&apos;aventure !
            </p>
          </div>
          <Link href="/">
            <Button className="rounded-xl px-10">Voir le Menu</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
