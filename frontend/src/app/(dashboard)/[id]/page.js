"use client";

import Button from "@/components/ui/Button";
import orderService from "@/services/order.service";
import userService from "@/services/user.service";
import { useAuthStore } from "@/store";
import { ChefHat, Clock, ShoppingBag, Star, Zap } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserDashboardByIdPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [orders, setOrders] = useState([]);
  const [userToDisplay, setUserToDisplay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // dashboard layout handles auth redirect

    const isSelf = user.id === id;
    const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

    if (!isSelf && !isAdmin) {
      // not allowed to view another user's dashboard, redirect to own
      router.push(`/dashboard/${user.id}`);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        if (isSelf) {
          setUserToDisplay(user);
          const res = await orderService.getMyOrders();
          setOrders(res.orders || []);
        } else {
          const [uRes, oRes] = await Promise.all([
            userService.getUserById(id),
            orderService.getOrders({ userId: id, limit: 10 }),
          ]);
          setUserToDisplay(uRes);
          setOrders(oRes.orders || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, router]);

  if (!user) return null;

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[2.5rem] border border-secondary-100 shadow-sm relative overflow-hidden">
        <div className="space-y-3 relative z-10">
          <h1 className="text-4xl font-black font-outfit text-secondary-900">
            {userToDisplay ? (
              <>
                Tableau de bord de{" "}
                <span className="text-primary-500">
                  {userToDisplay.name.split(" ")[0]}
                </span>
              </>
            ) : (
              "Tableau de bord"
            )}
          </h1>
          <p className="text-secondary-500 font-medium italic">
            {userToDisplay
              ? `Vue personnalisée pour ${userToDisplay.email}`
              : "Chargement..."}
          </p>
          <div className="pt-4 flex gap-3">
            <Link href="/">
              <Button className="rounded-xl px-8">Explorer le Menu</Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline" className="rounded-xl px-8">
                Mes Commandes
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative z-10 hidden lg:block">
          <div className="flex gap-4">
            <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100 text-center space-y-1">
              <Star className="w-6 h-6 text-primary-500 mx-auto" />
              <p className="text-2xl font-black text-primary-600">
                {orders.length}
              </p>
              <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">
                Commandes
              </p>
            </div>
            <div className="bg-accent-50 p-6 rounded-3xl border border-accent-100 text-center space-y-1">
              <ShoppingBag className="w-6 h-6 text-accent-500 mx-auto" />
              <p className="text-2xl font-black text-accent-600">--</p>
              <p className="text-[10px] font-bold text-accent-500 uppercase tracking-widest">
                Activité
              </p>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-outfit text-secondary-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" />
              Activité Récente
            </h2>
            <Link
              href="/orders"
              className="text-sm font-bold text-primary-500 hover:underline"
            >
              Voir tout
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-secondary-500">Chargement...</p>
            ) : orders.length === 0 ? (
              <p className="text-secondary-500">
                Aucune commande pour le moment.
              </p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-3xl border border-secondary-100 flex items-center justify-between hover:shadow-xl hover:shadow-secondary-900/5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary-50 rounded-2xl">
                      <ShoppingBag className="w-6 h-6 text-secondary-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary-900">
                        Commande #{order.secretCode || order.id}
                      </h4>
                      <p className="text-xs text-secondary-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-black text-secondary-900">
                      {order.total} FCFA
                    </p>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        order.status === "COMPLETED"
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {order.status === "COMPLETED" ? "Terminé" : "En cours"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold font-outfit text-secondary-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent-500" />
            Offres Flash
          </h2>

          <div className="bg-secondary-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <span className="px-3 py-1 bg-accent-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                Promotion spéciale
              </span>
              <h3 className="text-3xl font-bold font-outfit">
                Weekend Gourmet
              </h3>
              <p className="text-secondary-400 text-sm leading-relaxed max-w-xs">
                -20% sur tous les desserts traditionnels ce weekend. Ne manquez
                pas cette douceur !
              </p>
              <Button
                variant="secondary"
                className="bg-white text-secondary-900 hover:bg-accent-500 hover:text-white mt-4"
              >
                En profiter
              </Button>
            </div>

            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">
              <ChefHat className="w-64 h-64 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
