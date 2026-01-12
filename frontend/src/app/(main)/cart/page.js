"use client";

import Button from "@/components/ui/Button";
import { useCartStore } from "@/store";
import {
  ArrowRight,
  ChevronLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto text-secondary-400">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-outfit text-secondary-900">
            Votre panier est vide
          </h1>
          <p className="text-secondary-500">
            Il semble que vous n&apos;ayez pas encore ajouté de délices à votre
            sélection.
          </p>
        </div>
        <Link href="/">
          <Button size="lg" className="mt-4">
            Retourner au Menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="p-2 bg-secondary-100 rounded-lg hover:bg-secondary-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-secondary-600" />
        </Link>
        <h1 className="text-3xl font-bold font-outfit text-secondary-900">
          Mon Panier
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-3xl border border-secondary-100 hover:shadow-xl hover:shadow-secondary-900/5 transition-all animate-fade-in"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary-100 flex-shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-grow space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-secondary-900">
                  {item.name}
                </h3>
                <p className="text-sm text-secondary-500 line-clamp-1">
                  {item.description}
                </p>
                <p className="text-primary-500 font-bold">{item.price} FCFA</p>
              </div>

              <div className="flex items-center gap-4 bg-secondary-50 p-2 rounded-xl">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1.5 hover:bg-white rounded-lg transition-colors text-secondary-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-secondary-900">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1.5 hover:bg-white rounded-lg transition-colors text-secondary-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="font-bold text-secondary-900">
                  {(item.price * item.quantity).toFixed(2)} FCFA
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm font-semibold text-secondary-400 hover:text-red-500 transition-colors flex items-center gap-2 ml-auto"
          >
            <Trash2 className="w-4 h-4" /> Vider le panier
          </button>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 glass p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6">
            <h2 className="text-xl font-bold font-outfit text-secondary-900">
              Récapitulatif
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-secondary-600">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} FCFA</span>
              </div>
              <div className="flex justify-between text-secondary-600">
                <span>Livraison</span>
                <span className="text-green-500 font-bold">Gratuit</span>
              </div>
              <div className="flex justify-between text-secondary-600">
                <span>TVA (20%)</span>
                <span>{(total * 0.2).toFixed(2)} FCFA</span>
              </div>
              <div className="pt-4 border-t border-secondary-100 flex justify-between">
                <span className="text-lg font-bold text-secondary-900">
                  Total
                </span>
                <span className="text-2xl font-black text-primary-500 font-outfit">
                  {total.toFixed(2)} FCFA
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Link href="/checkout">
                <Button className="w-full group" size="lg">
                  Commander
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-[10px] text-center text-secondary-400 uppercase tracking-widest font-bold">
                Paiement sécurisé par SSL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
