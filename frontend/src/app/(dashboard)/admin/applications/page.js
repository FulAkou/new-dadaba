"use client";

import DataTable from "@/components/admin/DataTable";
import Button from "@/components/ui/Button";
import applicationService from "@/services/application.service";
import { Download, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminApplicationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await applicationService.getAllApplications();
      setApplications(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des candidatures");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCV = (app) => {
    if (!app.cvUrl) {
      toast.error("Aucun CV disponible pour ce candidat");
      return;
    }
    // Ouverture directe dans un nouvel onglet pour éviter les problèmes CORS
    // et garantir l'accès au fichier (PDF ou Image)
    window.open(app.cvUrl, "_blank");
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: "Candidat",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold border border-primary-200">
            {row.lastName.charAt(0).toUpperCase()}
            {row.firstName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-secondary-900">
              {row.firstName} {row.lastName}
            </span>
            <span className="text-xs text-secondary-400">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Poste",
      cell: (row) => (
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
          {row.position}
        </span>
      ),
    },
    {
      header: "Date",
      cell: (row) => (
        <span className="text-sm text-secondary-600">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "CV",
      cell: (row) => (
        <Button
          size="sm"
          variant="outline"
          className="gap-2 h-8 px-3"
          onClick={() => handleDownloadCV(row)}
        >
          <Download className="w-4 h-4" />
          Télécharger
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-outfit text-secondary-900 leading-tight">
            Gestion <span className="text-primary-500">Candidatures</span>
          </h1>
          <p className="text-secondary-500 font-medium">
            Suivi des recrutements pour le poste de Chef Cuisinier
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-secondary-100 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-secondary-100 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredApplications}
        isLoading={isLoading}
        emptyMessage="Aucune candidature reçue pour le moment."
      />
    </div>
  );
}
