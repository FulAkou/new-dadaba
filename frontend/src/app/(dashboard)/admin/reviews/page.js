"use client";

import DataTable from "@/components/admin/DataTable";
import reviewService from "@/services/review.service";
import {
  CheckCircle,
  MessageSquare,
  Search,
  Star,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getAllReviews();
      setReviews(data.reviews || data);
    } catch (error) {
      toast.error("Erreur lors du chargement des avis");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await reviewService.approveReview(id);
      toast.success("Avis approuvé");
      fetchReviews();
    } catch (error) {
      toast.error("Erreur lors de l&apos;approbation");
    }
  };

  const handleReject = async (id) => {
    try {
      await reviewService.rejectReview(id);
      toast.success("Avis rejeté");
      fetchReviews();
    } catch (error) {
      toast.error("Erreur lors du rejet");
    }
  };

  const columns = [
    {
      header: "Utilisateur",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-secondary-900">{row.user?.name}</span>
          <span className="text-xs text-secondary-400">
            Plat: {row.dish?.name}
          </span>
        </div>
      ),
    },
    {
      header: "Note",
      cell: (row) => (
        <div className="flex items-center gap-1 text-yellow-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < row.rating ? "fill-current" : "text-secondary-200"
              }`}
            />
          ))}
          <span className="ml-1 text-xs font-bold text-secondary-600">
            {row.rating}/5
          </span>
        </div>
      ),
    },
    {
      header: "Commentaire",
      cell: (row) => (
        <p className="text-sm text-secondary-600 max-w-[300px] line-clamp-2">
          &quot;{row.comment}&quot;
        </p>
      ),
    },
    {
      header: "Statut",
      cell: (row) => {
        const statusColors = {
          PENDING: "bg-yellow-100 text-yellow-600",
          APPROVED: "bg-green-100 text-green-600",
          REJECTED: "bg-red-100 text-red-600",
        };
        return (
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              statusColors[row.status]
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.status === "PENDING" && (
            <>
              <button
                onClick={() => handleApprove(row.id)}
                className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                title="Approuver"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleReject(row.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Rejeter"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          <button className="p-2 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all">
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-black font-outfit text-secondary-900 leading-tight">
          Modération des <span className="text-primary-500">Avis</span>
        </h1>
        <p className="text-secondary-500 font-medium">
          Gérez la réputation de votre festival
        </p>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-secondary-100 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher dans les commentaires..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-secondary-100 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        isLoading={isLoading}
        emptyMessage="Aucun avis à modérer."
      />
    </div>
  );
}
