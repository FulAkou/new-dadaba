"use client";

import { cn } from "@/lib/utils/cn";
import orderService from "@/services/order.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CheckCircle,
  ChevronLeft,
  Clock,
  CreditCard,
  ExternalLink,
  Loader2,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (error) {
        toast.error("Commande introuvable");
        router.push("/orders");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-secondary-500 font-bold font-outfit uppercase tracking-widest text-xs">
          Chargement des détails...
        </p>
      </div>
    );
  }

  const steps = [
    { status: "PENDING", label: "En attente", icon: Clock },
    { status: "CONFIRMED", label: "Confirmé", icon: ShieldCheck },
    { status: "PREPARING", label: "En cuisine", icon: Truck },
    { status: "READY", label: "Prêt", icon: Package },
    { status: "COMPLETED", label: "Terminé", icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  return (
    <div className="max-w-5xl mx-auto px-6 pb-20 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary-500 hover:text-primary-500 transition-colors mb-4 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Retour</span>
          </button>
          <h1 className="text-4xl font-black font-outfit text-secondary-900 leading-tight">
            Détail de la <span className="text-primary-500">Commande</span>
          </h1>
          <p className="text-secondary-500 font-medium font-mono uppercase tracking-widest">
            ID: {order.id.toUpperCase()}
          </p>
        </div>
        <div className="bg-secondary-900 p-6 rounded-[2rem] text-white flex flex-col items-center gap-2 shadow-2xl">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400">
            Code Secret
          </span>
          <span className="text-3xl font-black font-outfit tracking-widest text-primary-500">
            {order.secretCode}
          </span>
          <p className="text-[8px] text-secondary-400 max-w-[120px] text-center italic">
            À présenter lors du retrait
          </p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white p-10 rounded-[3rem] border border-secondary-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-8">
          {steps.map((step, idx) => {
            const isPast = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const Icon = step.icon;

            return (
              <div
                key={step.status}
                className="flex-1 flex flex-col items-center gap-3 relative w-full sm:w-auto"
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 shadow-lg",
                    isPast
                      ? "bg-green-500 text-white shadow-green-500/20"
                      : isCurrent
                      ? "bg-primary-500 text-white animate-pulse shadow-primary-500/20"
                      : "bg-secondary-50 text-secondary-300"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p
                    className={cn(
                      "text-xs font-black uppercase tracking-widest leading-none",
                      isCurrent
                        ? "text-primary-600"
                        : isPast
                        ? "text-green-600"
                        : "text-secondary-400"
                    )}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span className="text-[10px] text-primary-400 font-bold lowercase">
                      En cours
                    </span>
                  )}
                </div>

                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <div className="hidden sm:block absolute left-1/2 top-7 w-full h-[2px] bg-secondary-100 -z-10">
                    <div
                      className={cn(
                        "h-full bg-green-500 transition-all duration-1000",
                        isPast ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-secondary-100 overflow-hidden">
            <div className="p-8 border-b border-secondary-50 bg-secondary-50/30">
              <h3 className="text-xl font-bold font-outfit text-secondary-900">
                Articles Commandés ({order.items?.length})
              </h3>
            </div>
            <div className="divide-y divide-secondary-50">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-8 flex items-center gap-6 group hover:bg-secondary-50/50 transition-colors"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-secondary-100 flex-shrink-0">
                    <img
                      src={item.dish?.imageUrl}
                      alt={item.dish?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow space-y-1">
                    <h4 className="font-bold text-secondary-900 text-lg group-hover:text-primary-500 transition-colors">
                      {item.dish?.name}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-secondary-500">
                      <span className="font-bold">Qté: {item.quantity}</span>
                      <span className="w-1 h-1 rounded-full bg-secondary-200" />
                      <span className="font-medium">
                        {item.price} FCFA / unité
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-secondary-900 text-xl font-outfit">
                      {(item.price * item.quantity).toFixed(2)} FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-secondary-900 text-white flex justify-between items-center">
              <span className="font-bold">Total Payé</span>
              <span className="text-3xl font-black font-outfit text-primary-500">
                {order.total.toFixed(2)} FCFA
              </span>
            </div>
          </div>
        </div>

        {/* Delivery/Summary Extra Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-secondary-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold font-outfit text-secondary-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-500" /> Informations
              Retrait
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                  Emplacement
                </p>
                <p className="font-bold text-secondary-900">
                  {order.deliveryLocation || "Zone de retrait principale"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                  Contact
                </p>
                <p className="font-bold text-secondary-900">
                  {order.deliveryName} • {order.deliveryPhone}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                  Date de commande
                </p>
                <p className="font-bold text-secondary-900">
                  {format(new Date(order.createdAt), "d MMMM 'à' HH:mm", {
                    locale: fr,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-secondary-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold font-outfit text-secondary-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-500" /> Paiement
            </h3>
            <div className="p-4 bg-secondary-50 rounded-2xl flex items-center justify-between">
              <span className="text-sm font-bold text-secondary-600">
                {order.paymentMethod === "CARD"
                  ? "Carte Bancaire"
                  : "Espèces au retrait"}
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> Payé
              </div>
            </div>
          </div>

          <div className="bg-primary-50 p-8 rounded-[2.5rem] border border-primary-100 text-center space-y-3">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest">
              Un problème ?
            </p>
            <button className="flex items-center gap-2 mx-auto text-primary-700 font-black text-sm hover:underline">
              Contacter le support <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
