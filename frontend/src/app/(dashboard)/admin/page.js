"use client";

import DataTable from "@/components/admin/DataTable";
import StatsCard from "@/components/admin/StatsCard";
import Button from "@/components/ui/Button";
import orderService from "@/services/order.service";
import reviewService from "@/services/review.service";
import userService from "@/services/user.service";
import { useSocketStore } from "@/store";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowRight,
  ChefHat,
  ChevronRight,
  Clock,
  Euro,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    rating: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { header: "ID", accessor: "id" },
    {
      header: "Client",
      cell: (row) => row.user?.name || row.user || "Anonyme",
    },
    {
      header: "Total",
      cell: (row) => (
        <span className="font-bold text-secondary-900">
          {row.total || 0} FCFA
        </span>
      ),
    },
    {
      header: "Statut",
      cell: (row) => {
        const statusMap = {
          PENDING: {
            label: "En attente",
            color: "bg-yellow-100 text-yellow-600",
          },
          PREPARING: {
            label: "En préparation",
            color: "bg-orange-100 text-orange-600",
          },
          READY: { label: "Prêt", color: "bg-blue-100 text-blue-600" },
          COMPLETED: { label: "Terminé", color: "bg-green-100 text-green-600" },
          CANCELLED: { label: "Annulé", color: "bg-red-100 text-red-600" },
        };
        // Utiliser un status par défaut si le status n'est pas trouvé
        const status = statusMap[row.status] || statusMap.PENDING;
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}
          >
            {status.label}
          </span>
        );
      },
    },
    {
      header: "Date",
      cell: (row) => {
        const date = row.createdAt || row.date;
        return date ? format(new Date(date), "HH:mm", { locale: fr }) : "N/A";
      },
    },
    {
      header: "",
      cell: (row) => (
        <Link href={`/admin/orders/${row.id}`}>
          <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors group">
            <ArrowRight className="w-4 h-4 text-secondary-400 group-hover:text-primary-500" />
          </button>
        </Link>
      ),
    },
  ];

  /* New Hook import */
  const { socket } = useSocketStore();

  const fetchDashboard = async () => {
    // Only show loading on initial load, not background updates
    if (stats.revenue === 0) setLoading(true);
    try {
      // Recent orders (limit 5)
      const recentRes = await orderService.getOrders({ page: 1, limit: 5 });
      setRecentOrders(recentRes.orders || []);

      // Stats: total orders & revenue
      const allOrdersRes = await orderService.getOrders({
        page: 1,
        limit: 100,
      });
      const allOrders = allOrdersRes.orders || [];
      const revenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const ordersCount = allOrdersRes.pagination?.total || allOrders.length;

      // Users count
      const usersRes = await userService.getUsers({ page: 1, limit: 1 });
      const usersCount = usersRes.pagination?.total || 0;

      // Average rating
      const reviewsRes = await reviewService.getAllReviews({
        page: 1,
        limit: 100,
      });
      const reviews = reviewsRes.reviews || [];
      const avgRating = reviews.length
        ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
        : 0;

      setStats({
        revenue,
        orders: ordersCount,
        users: usersCount,
        rating: avgRating.toFixed(1),
      });
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleNotification = () => {
      fetchDashboard();
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black font-outfit text-secondary-900 leading-tight">
            Tableau de <span className="text-primary-500">Bord</span>
          </h1>
          <p className="text-secondary-500 font-medium italic">
            Statistiques de Dadaba national en temps réel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-100 rounded-xl text-sm font-semibold text-secondary-600">
            <Clock className="w-4 h-4" />
            Dernière mise à jour: {format(new Date(), "HH:mm", { locale: fr })}
          </div>
          <Button>Exporter Rapport</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="CA Total"
          value={`${stats.revenue} FCFA`}
          icon={Euro}
          trend="up"
          trendValue="12.5"
        />
        <StatsCard
          title="Commandes"
          value={stats.orders}
          icon={ShoppingBag}
          trend="up"
          trendValue="8.2"
        />
        <StatsCard
          title="Clients"
          value={stats.users}
          icon={Users}
          trend="up"
          trendValue="4.1"
        />
        <StatsCard
          title="Note Moyenne"
          value={stats.rating}
          icon={Star}
          trend="down"
          trendValue="0.2"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-outfit text-secondary-900">
              Dernières Commandes
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm font-bold text-primary-500 hover:underline"
            >
              Voir tout
            </Link>
          </div>
          {loading ? (
            <p className="text-secondary-500">Chargement des données...</p>
          ) : (
            <DataTable columns={columns} data={recentOrders} />
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-outfit text-secondary-900">
            Actions Rapides
          </h2>
          <div className="bg-white p-6 rounded-3xl border border-secondary-100 space-y-3 shadow-sm">
            <Link href="/admin/dishes/new" className="block">
              <button className="w-full flex items-center justify-between p-4 bg-secondary-50 hover:bg-primary-50 text-secondary-900 hover:text-primary-600 rounded-2xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-colors">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="font-bold">Ajouter un plat</span>
                </div>
                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Link>

            <Link href="/admin/users" className="block">
              <button className="w-full flex items-center justify-between p-4 bg-secondary-50 hover:bg-primary-50 text-secondary-900 hover:text-primary-600 rounded-2xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="font-bold">Gérer les accès</span>
                </div>
                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Link>
          </div>

          <div className="bg-primary-600 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <ChefHat className="w-12 h-12 opacity-50" />
              <h3 className="text-2xl font-bold font-outfit">
                Prêt pour le rush ?
              </h3>
              <p className="text-primary-100 text-sm leading-relaxed">
                Le pic d&apos;activité est prévu à 19:30 aujourd&apos;hui.
                Vérifiez vos stocks !
              </p>
              <Button
                variant="secondary"
                className="w-full bg-white text-primary-600 hover:bg-primary-50"
              >
                Vérifier Stock
              </Button>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-primary-500 rounded-full blur-3xl opacity-50 group-hover:scale-125 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
