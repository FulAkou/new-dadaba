"use client";

import DataTable from "@/components/admin/DataTable";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import dishService from "@/services/dish.service";
import { Edit, ExternalLink, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminDishesPage() {
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    setIsLoading(true);
    try {
      const data = await dishService.getDishes();
      setDishes(data.dishes || data);
    } catch (error) {
      toast.error("Erreur lors du chargement des plats");
    } finally {
      setIsLoading(false);
    }
  };

  /* New import */
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);

  /* ... */

  const handleDelete = (dish) => {
    setDishToDelete(dish);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!dishToDelete) return;

    try {
      await dishService.deleteDish(dishToDelete.id);
      toast.success("Plat supprimé");
      fetchDishes();
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const columns = [
    {
      header: "Plat",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary-100 overflow-hidden relative">
            <Image
              src={row.imageUrl}
              alt={row.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-secondary-900">{row.name}</span>
            <span className="text-xs text-secondary-400 truncate max-w-[200px]">
              {row.description}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Prix",
      cell: (row) => (
        <span className="font-bold text-primary-600">{row.price} FCFA</span>
      ),
    },
    {
      header: "Créé le",
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/dishes/${row.id}`} target="_blank">
            <button className="p-2 text-secondary-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
              <ExternalLink className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/admin/dishes/${row.id}/edit`}>
            <button className="p-2 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all">
              <Edit className="w-4 h-4" />
            </button>
          </Link>
          <button
            onClick={() => handleDelete(row)}
            className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filteredDishes = Array.isArray(dishes)
    ? dishes.filter((d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-outfit text-secondary-900 leading-tight">
            Gestion des <span className="text-primary-500">Plats</span>
          </h1>
          <p className="text-secondary-500 font-medium">
            Ajoutez ou modifiez les plats du festival
          </p>
        </div>

        <Link href="/admin/dishes/new">
          <Button className="gap-2">
            <Plus className="w-5 h-5" />
            Nouveau Plat
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-secondary-100 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-secondary-100 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-4 text-sm font-bold text-secondary-500">
          {filteredDishes.length} Plats au total
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredDishes}
        isLoading={isLoading}
        emptyMessage="Aucun plat trouvé. Commencez par en créer un !"
      />

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Supprimer le plat"
      >
        <div className="space-y-6">
          <p className="text-secondary-600">
            Êtes-vous sûr de vouloir supprimer le plat{" "}
            <span className="font-bold text-secondary-900">
              {dishToDelete?.name}
            </span>{" "}
            ? Cette action est irréversible.
          </p>

          <div className="flex gap-4">
            <Button
              variant="secondary"
              className="w-full justify-center"
              onClick={() => setDeleteModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              className="w-full justify-center"
              onClick={confirmDelete}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
