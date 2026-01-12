"use client";

import DataTable from "@/components/admin/DataTable";
import orderService from "@/services/order.service";
import userService from "@/services/user.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ChevronLeft,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  Shield,
  ShoppingBag,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await userService.getUserById(id);
        setUser(userData);
        // Assuming there's a way to get orders by user ID
        const ordersData = await orderService.getOrders();
        const filtered = Array.isArray(ordersData)
          ? ordersData.filter((o) => o.userId === id)
          : [];
        setUserOrders(filtered);
      } catch (error) {
        toast.error("Utilisateur introuvable");
        router.push("/admin/users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-secondary-500 font-bold uppercase tracking-widest text-xs">
          Analyse du profil...
        </p>
      </div>
    );
  }

  const orderColumns = [
    {
      header: "Commande",
      cell: (row) => (
        <span className="font-mono font-bold">
          #{row.id.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      header: "Date",
      cell: (row) => format(new Date(row.createdAt), "dd/MM/yyyy"),
    },
    {
      header: "Total",
      cell: (row) => (
        <span className="font-bold">{row.total.toFixed(2)} FCFA</span>
      ),
    },
    {
      header: "Statut",
      cell: (row) => (
        <span className="px-3 py-1 bg-secondary-100 text-secondary-600 rounded-full text-[10px] font-black uppercase tracking-widest">
          {row.status}
        </span>
      ),
    },
    {
      header: "",
      cell: (row) => (
        <Link
          href={`/admin/orders/${row.id}`}
          className="text-primary-500 hover:underline flex items-center gap-1 font-bold text-xs"
        >
          Détails <ExternalLink className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Link
          href="/admin/users"
          className="p-2 bg-white border border-secondary-100 rounded-xl hover:bg-secondary-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-secondary-600" />
        </Link>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-black font-outfit shadow-xl shadow-primary-500/10">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black font-outfit text-secondary-900">
              {user.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="px-3 py-0.5 bg-secondary-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                {user.role}
              </span>
              <span className="text-secondary-400 text-xs font-medium italic">
                Inscrit le{" "}
                {format(new Date(user.createdAt), "d MMMM yyyy", {
                  locale: fr,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* User Info Stats */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-secondary-100 shadow-sm space-y-8">
            <h3 className="text-lg font-bold font-outfit text-secondary-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary-500" /> Coordonnées
            </h3>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary-50 rounded-2xl">
                  <Mail className="w-5 h-5 text-secondary-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                    Email
                  </p>
                  <p className="font-bold text-secondary-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary-50 rounded-2xl">
                  <Phone className="w-5 h-5 text-secondary-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                    Téléphone
                  </p>
                  <p className="font-bold text-secondary-900">
                    {user.telephone || "Non renseigné"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary-50 rounded-2xl">
                  <Shield className="w-5 h-5 text-secondary-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                    Status Compte
                  </p>
                  <span className="text-xs font-bold text-green-500">
                    Actif & Vérifié
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-secondary-950 p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden group">
            <h3 className="text-lg font-bold font-outfit text-primary-500">
              Résumé d&apos;Activité
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-3xl font-black font-outfit">
                  {userOrders.length}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                  Commandes
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black font-outfit">
                  {userOrders.reduce((sum, o) => sum + o.total, 0).toFixed(0)}{" "}
                  FCFA
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                  Dépenses
                </p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700">
              <ShoppingBag className="w-32 h-32" />
            </div>
          </div>
        </div>

        {/* User Orders History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black font-outfit text-secondary-900">
              Historique des <span className="text-primary-500">Commandes</span>
            </h3>
          </div>

          <DataTable
            columns={orderColumns}
            data={userOrders}
            emptyMessage="Cet utilisateur n'a pas encore passé de commande."
          />
        </div>
      </div>
    </div>
  );
}
