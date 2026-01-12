"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import orderService from "@/services/order.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Phone,
  Printer,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (error) {
      toast.error("Commande introuvable");
      router.push("/admin/orders");
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchOrder();
  }, [id, fetchOrder]);

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      await orderService.updateOrderStatus(id, newStatus);
      toast.success(`Statut mis à jour : ${newStatus}`);
      fetchOrder();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-secondary-500 font-bold uppercase tracking-widest text-xs">
          Chargement de la commande...
        </p>
      </div>
    );
  }

  const statusOptions = [
    {
      value: "PENDING",
      label: "En attente",
      color: "bg-yellow-100 text-yellow-600",
      icon: Clock,
    },
    {
      value: "CONFIRMED",
      label: "Confirmé",
      color: "bg-blue-100 text-blue-600",
      icon: CheckCircle,
    },
    {
      value: "PREPARING",
      label: "En cuisine",
      color: "bg-orange-100 text-orange-600",
      icon: Truck,
    },
    {
      value: "READY",
      label: "Prêt",
      color: "bg-indigo-100 text-indigo-600",
      icon: Package,
    },
    {
      value: "COMPLETED",
      label: "Terminé",
      color: "bg-green-100 text-green-600",
      icon: CheckCircle,
    },
    {
      value: "CANCELLED",
      label: "Annulé",
      color: "bg-red-100 text-red-600",
      icon: XCircle,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 bg-white border border-secondary-100 rounded-xl hover:bg-secondary-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-secondary-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-black font-outfit text-secondary-900 leading-tight">
              Commande{" "}
              <span className="text-secondary-400 font-mono">
                #{order.id.slice(-6).toUpperCase()}
              </span>
            </h1>
            <p className="text-secondary-500 font-medium">
              {format(new Date(order.createdAt), "d MMMM yyyy 'à' HH:mm", {
                locale: fr,
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 rounded-xl">
            <Printer className="w-4 h-4" /> Imprimer Billet
          </Button>
          <div className="bg-primary-500 text-white px-6 py-2 rounded-xl shadow-lg shadow-primary-500/20 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Code Secret
            </p>
            <p className="text-xl font-black font-outfit">{order.secretCode}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Status Manager */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-secondary-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-outfit text-secondary-900 border-b border-secondary-50 pb-4">
              Gérer le Flux
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleUpdateStatus(status.value)}
                  disabled={isUpdating}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                    order.status === status.value
                      ? `${
                          status.color.replace("bg-", "border-").split(" ")[0]
                        } ${status.color.replace("100", "50")} shadow-lg`
                      : "border-secondary-50 hover:border-secondary-100 hover:bg-secondary-50"
                  )}
                >
                  <status.icon
                    className={cn(
                      "w-6 h-6",
                      order.status === status.value
                        ? "animate-bounce"
                        : "text-secondary-300"
                    )}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">
                    {status.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Order Items List */}
          <div className="bg-white rounded-[2.5rem] border border-secondary-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-secondary-50 bg-secondary-50/30">
              <h3 className="text-xl font-bold font-outfit text-secondary-900">
                Articles Commandés
              </h3>
            </div>
            <div className="divide-y divide-secondary-50">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 flex items-center justify-between group hover:bg-secondary-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary-100">
                      <img
                        src={item.dish?.imageUrl}
                        alt={item.dish?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary-900">
                        {item.dish?.name}
                      </h4>
                      <p className="text-xs text-secondary-500 font-bold uppercase tracking-widest">
                        x{item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-black text-secondary-900">
                    {(item.price * item.quantity).toFixed(2)} FCFA
                  </p>
                </div>
              ))}
            </div>
            <div className="p-8 bg-secondary-950 text-white flex justify-between items-center">
              <span className="text-secondary-400 font-bold">Total Client</span>
              <span className="text-4xl font-black font-outfit text-primary-500">
                {order.total.toFixed(2)} FCFA
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer & Delivery Info */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-secondary-100 shadow-sm space-y-8">
            <h3 className="text-xl font-bold font-outfit text-secondary-900 border-b border-secondary-50 pb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" /> Informations
              Livraison
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {/* Name */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-secondary-400 mb-1">
                    Nom Complet
                  </p>
                  <p className="text-lg font-bold text-secondary-900">
                    {order.deliveryName || order.user?.name || "Non renseigné"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-secondary-400 mb-1">
                    Téléphone
                  </p>
                  <p className="text-lg font-bold text-secondary-900">
                    {order.deliveryPhone ||
                      order.user?.telephone ||
                      "Non renseigné"}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-secondary-400 mb-1">
                    Lieu de livraison
                  </p>
                  <p className="text-lg font-bold text-secondary-900 leading-relaxed">
                    {order.deliveryLocation || "À emporter / Non renseigné"}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Info (Secondary) */}
            <div className="pt-6 border-t border-secondary-50">
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary-300 mb-3">
                Compte Utilisateur
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-400">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-sm">
                  <span className="font-bold text-secondary-600">
                    {order.user?.name}
                  </span>
                  <span className="mx-2 text-secondary-300">•</span>
                  <span className="text-secondary-400">
                    {order.user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-secondary-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold font-outfit text-secondary-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-500" /> Paiement
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-500 font-medium">Méthode</span>
                <span className="font-bold text-secondary-900">
                  {order.paymentMethod === "CARD"
                    ? "Carte Bancaire"
                    : "Espèces"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-500 font-medium">État</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Confirmé
                </span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {order.status === "PENDING" && (
            <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-[2.5rem] flex gap-4 animate-pulse">
              <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
              <p className="text-xs text-yellow-700 font-medium leading-relaxed">
                Cette commande est en attente depuis{" "}
                {formatDistanceToNow(new Date(order.createdAt), { locale: fr })}
                . Veuillez la confirmer au plus vite.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
