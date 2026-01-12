"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import orderService from "@/services/order.service";
import { useAuthStore, useCartStore } from "@/store";
import {
  ArrowRight,
  ChevronLeft,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const total = getTotal();

  const [formData, setFormData] = useState({
    deliveryName: user?.name || "",
    deliveryPhone: user?.telephone || "",
    deliveryLocation: "",
    paymentMethod: "CARD",
    seats: 1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour finaliser votre commande");
      router.push("/login"); // or /auth/login depending on route structure, assuming /login based on file structure
      return;
    }

    if (items.length === 0) return;

    setIsLoading(true);
    try {
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          dishId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
      };

      const response = await orderService.createOrder(orderData);
      toast.success("Commande validée ! Un code secret vous a été attribué.");
      clearCart();
      router.push(`/orders/${response.id}`);
    } catch (error) {
      console.error("Checkout error:", error);

      // Handle Zod validation errors (array of details)
      if (
        error.response?.data?.details &&
        Array.isArray(error.response.data.details)
      ) {
        const errorMessages = error.response.data.details
          .map((detail) => detail.message)
          .join(", ");
        toast.error(errorMessages);
        return;
      }

      // Handle standard backend errors
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erreur lors de la commande";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold font-outfit text-secondary-900">
          Votre panier est vide
        </h2>
        <Link
          href="/"
          className="mt-4 inline-block text-primary-500 font-bold underline"
        >
          Retourner au menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <Link
        href="/cart"
        className="flex items-center gap-2 text-secondary-500 hover:text-primary-500 transition-colors mb-8 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Retour au panier</span>
      </Link>

      <form
        onSubmit={handleCheckout}
        className="grid grid-cols-1 lg:grid-cols-2 gap-16"
      >
        <div className="space-y-12">
          <div className="space-y-6">
            <h1 className="text-4xl font-black font-outfit text-secondary-900">
              Finaliser ma <span className="text-primary-500">Commande</span>
            </h1>
            <p className="text-secondary-500 font-medium leading-relaxed">
              Veuillez confirmer vos informations de livraison au festival.
              Toutes les commandes sont traitées avec la plus grande attention
              gastronomique.
            </p>
          </div>

          {/* Delivery Section */}
          <div className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-secondary-100 shadow-sm">
            <h3 className="text-xl font-bold font-outfit text-secondary-900 flex items-center gap-3">
              <Truck className="w-6 h-6 text-primary-500" />
              Détails de Livraison
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nom complet pour le retrait"
                name="deliveryName"
                value={formData.deliveryName}
                onChange={handleChange}
                required
              />
              <Input
                label="Numéro de contact"
                name="deliveryPhone"
                value={formData.deliveryPhone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700">
                Emplacement au festival (Table/Zone)
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  name="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={handleChange}
                  placeholder="ex: Zone B - Table 12 ou Retrait Comptoir"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-secondary-100 bg-secondary-50/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-secondary-100 shadow-sm">
            <h3 className="text-xl font-bold font-outfit text-secondary-900 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-primary-500" />
              Mode de Paiement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "CARD" })
                }
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border-2 transition-all group",
                  formData.paymentMethod === "CARD"
                    ? "border-primary-500 bg-primary-50/50"
                    : "border-secondary-100 hover:border-secondary-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <CreditCard
                    className={cn(
                      "w-5 h-5",
                      formData.paymentMethod === "CARD"
                        ? "text-primary-500"
                        : "text-secondary-400"
                    )}
                  />
                  <span className="font-bold text-sm">Carte Bancaire</span>
                </div>
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-4",
                    formData.paymentMethod === "CARD"
                      ? "border-primary-500"
                      : "border-secondary-300"
                  )}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "CASH_PICKUP" })
                }
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border-2 transition-all group",
                  formData.paymentMethod === "CASH_PICKUP"
                    ? "border-primary-500 bg-primary-50/50"
                    : "border-secondary-100 hover:border-secondary-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Wallet
                    className={cn(
                      "w-5 h-5",
                      formData.paymentMethod === "CASH_PICKUP"
                        ? "text-primary-500"
                        : "text-secondary-400"
                    )}
                  />
                  <span className="font-bold text-sm">Paiement au Retrait</span>
                </div>
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-4",
                    formData.paymentMethod === "CASH_PICKUP"
                      ? "border-primary-500"
                      : "border-secondary-300"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-32 h-fit">
          <div className="bg-secondary-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl font-bold font-outfit mb-8 relative z-10">
              Résumé de la Commande
            </h2>

            <div className="space-y-6 relative z-10">
              <div className="max-h-60 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 relative">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-[150px]">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-secondary-400 font-black uppercase tracking-widest">
                          x{item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold">
                      {(item.price * item.quantity).toFixed(2)} FCFA
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-sm text-secondary-400">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} FCFA</span>
                </div>
                <div className="flex justify-between text-sm text-secondary-400">
                  <span>Taxe (20%)</span>
                  <span>{(total * 0.2).toFixed(2)} FCFA</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-4xl font-black font-outfit text-primary-500">
                    {total.toFixed(2)} FCFA
                  </span>
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-primary-500 text-white hover:bg-primary-600 h-14 rounded-2xl group text-lg"
                  isLoading={isLoading}
                >
                  Confirmer et Payer
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-secondary-400 font-medium">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />{" "}
                    Sécurisé
                  </div>
                  <span>•</span>
                  <span>Retrait express</span>
                </div>
              </div>
            </div>

            {/* Decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
          </div>
        </div>
      </form>
    </div>
  );
}
