"use client";

import Button from "@/components/ui/Button";
import userService from "@/services/user.service";
import { useAuthStore } from "@/store";
import { Camera, Mail, Phone, Save, Shield, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side basic validation for telephone (backend expects 10 digits)
    if (formData.telephone && !/^[0-9]{10}$/.test(formData.telephone)) {
      toast.error(
        "Le numéro de téléphone doit contenir exactement 10 chiffres"
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await userService.updateProfile(formData);
      // backend returns the updated user object directly (not { user })
      setUser(response);
      toast.success("Profil mis à jour avec succès !");
    } catch (error) {
      // Prefer backend validation message when available
      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erreur lors de la mise à jour";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
      <div>
        <h1 className="text-4xl font-black font-outfit text-secondary-900 leading-tight">
          Mon <span className="text-primary-500">Profil</span>
        </h1>
        <p className="text-secondary-500 font-medium">
          Gérez vos informations personnelles et préférences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Avatar & Quick Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-secondary-100 text-center space-y-4 shadow-sm">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 border-4 border-white shadow-xl shadow-primary-500/10">
                <span className="text-4xl font-black font-outfit">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-secondary-900 text-white rounded-full hover:bg-primary-500 transition-colors shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold text-secondary-900">
                {user?.name}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="px-3 py-0.5 bg-secondary-100 text-secondary-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-secondary-950 p-6 rounded-[2.5rem] text-white space-y-4 shadow-xl">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary-500">
              Sécurité
            </h4>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between text-left p-3 hover:bg-white/5 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-bold">
                    Changer de mot de passe
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Personal Info Form */}
        <div className="md:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-10 rounded-[2.5rem] border border-secondary-100 shadow-sm space-y-8"
          >
            <h3 className="text-xl font-bold font-outfit text-secondary-900 border-b border-secondary-50 pb-4">
              Informations Personnelles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-secondary-400 ml-1">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-secondary-100 bg-secondary-50/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-secondary-900 font-bold outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-secondary-400 ml-1">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-secondary-100 bg-secondary-50/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-secondary-900 font-bold outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-secondary-400 ml-1">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  disabled
                  value={formData.email}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-secondary-100 bg-secondary-50 cursor-not-allowed text-secondary-400 font-bold outline-none"
                />
              </div>
              <p className="text-[10px] text-secondary-400 italic mt-1 ml-1">
                L&apos;adresse email ne peut pas être modifiée.
              </p>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full sm:w-auto px-10 gap-2 group"
                isLoading={isLoading}
              >
                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
