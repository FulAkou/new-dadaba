"use client";

import DataTable from "@/components/admin/DataTable";
import Button from "@/components/ui/Button";
import { registerSchema } from "@/lib/validations/auth.validation";
import userService from "@/services/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Search,
  Shield,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Create User Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "USER",
    },
  });

  const selectedRole = watch("role");

  const handleCreateUser = async (data) => {
    setIsCreating(true);
    try {
      await userService.createUser(data);
      toast.success("Utilisateur créé avec succès !");
      setIsCreateModalOpen(false);
      reset();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur lors de la création");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, roleFilter, searchTerm]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: searchTerm,
      };
      if (roleFilter !== "ALL") {
        params.role = roleFilter;
      }

      const data = await userService.getUsers(params);
      setUsers(data.users || []);
      if (data.pagination) {
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      header: "Utilisateur",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold border border-primary-200">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-secondary-900">{row.name}</span>
            <span className="text-xs text-secondary-400">
              Inscrit le {new Date(row.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-secondary-600">
            <Mail className="w-3 h-3" /> {row.email}
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary-600">
            <Phone className="w-3 h-3" /> {row.telephone || "Non renseigné"}
          </div>
        </div>
      ),
    },
    {
      header: "Rôle",
      cell: (row) => {
        const roleColors = {
          ADMIN: "bg-red-100 text-red-600",
          SUPER_ADMIN: "bg-purple-100 text-purple-600",
          STAFF: "bg-blue-100 text-blue-600",
          USER: "bg-secondary-100 text-secondary-600",
        };
        return (
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              roleColors[row.role] || roleColors.USER
            }`}
          >
            {row.role}
          </span>
        );
      },
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button className="p-2 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all">
            <Shield className="w-4 h-4" />
          </button>
          <button className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // No client-side filtering needed anymore as it's server-side

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-outfit text-secondary-900 leading-tight">
            Gestion <span className="text-primary-500">Utilisateurs</span>
          </h1>
          <p className="text-secondary-500 font-medium">
            Contrôlez les accès et les rôles de la plateforme
          </p>
        </div>

        <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
          <UserPlus className="w-5 h-5" />
          Créer un utilisateur
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-secondary-100 shadow-sm flex-grow w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-secondary-100 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset to page 1 on search
              }}
            />
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 p-1 bg-secondary-50 rounded-xl max-w-full">
          {["ALL", "USER", "STAFF", "ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => {
                setRoleFilter(role);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                roleFilter === role
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-secondary-500 hover:text-secondary-900"
              }`}
            >
              {role === "ALL" ? "Tous" : role}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        emptyMessage="Aucun utilisateur trouvé."
      />

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
        <p className="text-sm text-secondary-500 font-medium">
          Page {page} sur {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 relative animate-scale-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-secondary-50 rounded-full transition-colors text-secondary-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black font-outfit text-secondary-900 mb-2">
              Nouveau <span className="text-primary-500">Utilisateur</span>
            </h3>
            <p className="text-secondary-500 mb-6">
              Créez un compte et attribuez un rôle
            </p>

            <form
              onSubmit={handleSubmit(handleCreateUser)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary-700">
                  Rôle
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-secondary-50 rounded-xl">
                  {["USER", "STAFF", "ADMIN"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setValue("role", role)}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        selectedRole === role
                          ? "bg-white text-primary-600 shadow-sm"
                          : "text-secondary-500 hover:text-secondary-900"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary-700">
                  Nom Complet
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                  placeholder="Ex: Jean Dupont"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary-700">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary-700">
                  Téléphone
                </label>
                <input
                  {...register("telephone")}
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                  placeholder="0123456789"
                />
                {errors.telephone && (
                  <p className="text-xs text-red-500">
                    {errors.telephone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary-700">
                  Mot de passe
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                  placeholder="******"
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary-700">
                  Confirmer
                </label>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                  placeholder="******"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-4 text-lg mt-4"
                isLoading={isCreating}
              >
                Créer le compte
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
