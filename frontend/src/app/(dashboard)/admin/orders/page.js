"use client";

import DataTable from "@/components/admin/DataTable";
import orderService from "@/services/order.service";
import {
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data.orders || data);
    } catch (error) {
      toast.error("Erreur lors du chargement des commandes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      toast.success("Statut mis à jour");
      fetchOrders();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

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
      label: "En cuisine",
      color: "bg-orange-100 text-orange-600",
      icon: () => (
        <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ),
    },
    READY: { label: "Prêt", color: "bg-indigo-100 text-indigo-600", icon: Eye },
    COMPLETED: {
      label: "Terminé",
      color: "bg-green-100 text-green-600",
      icon: CheckCircle,
    },
    CANCELLED: {
      label: "Annulé",
      color: "bg-red-100 text-red-600",
      icon: XCircle,
    },
  };

  const columns = [
    {
      header: "Commande",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-secondary-900">
            #{row.id.slice(-6).toUpperCase()}
          </span>
          <span className="text-xs text-secondary-400">{row.secretCode}</span>
        </div>
      ),
    },
    {
      header: "Client",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-secondary-900">
            {row.user?.name || row.deliveryName || "Client"}
          </span>
          <span className="text-xs text-secondary-400">
            {row.user?.telephone || row.deliveryPhone}
          </span>
        </div>
      ),
    },
    {
      header: "Total",
      cell: (row) => (
        <span className="font-bold text-secondary-900">{row.total} FCFA</span>
      ),
    },
    {
      header: "Statut",
      cell: (row) => {
        const status = statusMap[row.status] || statusMap.PENDING;
        const Icon = status.icon;
        return (
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${status.color}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {status.label}
            </span>
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.status === "PENDING" && (
            <button
              onClick={() => handleUpdateStatus(row.id, "CONFIRMED")}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
              title="Confirmer"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {row.status === "CONFIRMED" && (
            <button
              onClick={() => handleUpdateStatus(row.id, "PREPARING")}
              className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
              title="Mettre en cuisine"
            >
              <Truck className="w-4 h-4" />
            </button>
          )}
          {row.status === "PREPARING" && (
            <button
              onClick={() => handleUpdateStatus(row.id, "READY")}
              className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
              title="Marquer comme prêt"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {row.status === "READY" && (
            <button
              onClick={() => handleUpdateStatus(row.id, "COMPLETED")}
              className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
              title="Terminer la commande"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <Link href={`/admin/orders/${row.id}`}>
            <button className="p-2 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all">
              <Eye className="w-4 h-4" />
            </button>
          </Link>
        </div>
      ),
    },
  ];

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((o) => {
        const matchesSearch =
          o.id.includes(searchTerm) ||
          (o.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "ALL" || o.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-black font-outfit text-secondary-900 leading-tight">
          Suivi des <span className="text-primary-500">Commandes</span>
        </h1>
        <p className="text-secondary-500 font-medium">
          Gérez le flux de vos commandes en temps réel
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-3xl border border-secondary-100 shadow-sm">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par ID ou client..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-secondary-100 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-secondary-400 min-w-5 h-5 ml-2" />
          <select
            className="flex-grow md:w-48 px-4 py-3 rounded-2xl border border-secondary-100 focus:ring-2 focus:ring-primary-500/20 outline-none font-bold text-sm text-secondary-700 bg-secondary-50 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="CONFIRMED">Confirmé</option>
            <option value="PREPARING">En cuisine</option>
            <option value="READY">Prêt</option>
            <option value="COMPLETED">Terminé</option>
            <option value="CANCELLED">Annulé</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredOrders}
        isLoading={isLoading}
        emptyMessage="Aucune commande correspondante."
      />
    </div>
  );
}
