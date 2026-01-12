"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  Bell,
  Camera,
  Globe,
  Lock,
  Mail,
  Save,
  Shield,
  Smartphone,
  Store,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Paramètres mis à jour avec succès !");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-5xl space-y-8 animate-slide-up">
      <div>
        <h1 className="text-4xl font-black font-outfit text-secondary-900 leading-tight">
          Paramètres du <span className="text-primary-500">Système</span>
        </h1>
        <p className="text-secondary-500 font-medium">
          Configurez les préférences globales de votre plateforme
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation gauche */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-600 rounded-xl font-bold transition-all border border-primary-100 shadow-sm shadow-primary-500/5">
            <Store className="w-5 h-5" />
            Informations Générales
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900 rounded-xl font-bold transition-all">
            <Bell className="w-5 h-5" />
            Notifications & Alertes
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900 rounded-xl font-bold transition-all">
            <Shield className="w-5 h-5" />
            Sécurité & Accès
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900 rounded-xl font-bold transition-all">
            <Globe className="w-5 h-5" />
            Langue & Région
          </button>
        </div>

        {/* Formulaire Principal */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-8">
          {/* Section: Restaurant */}
          <div className="bg-white p-8 rounded-3xl border border-secondary-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-secondary-50">
              <div className="p-2 bg-secondary-900 text-white rounded-lg">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="font-black font-outfit text-secondary-900 uppercase tracking-wider text-sm">
                Boutique Dadaba National
              </h3>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-secondary-100 flex items-center justify-center border-2 border-dashed border-secondary-300 overflow-hidden relative">
                  <Store className="w-8 h-8 text-secondary-400" />
                </div>
                <button
                  type="button"
                  className="absolute -bottom-2 -right-2 p-2 bg-primary-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-secondary-900">
                  Logo de l'enseigne
                </p>
                <p className="text-xs text-secondary-500 max-w-[200px]">
                  Format PNG ou JPG, taille recommandée 512x512.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nom public"
                defaultValue="Dadaba National"
                placeholder="Nom affiché aux clients"
              />
              <Input
                label="Email de contact"
                defaultValue="contact@dadaba.com"
                icon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="Téléphone"
                defaultValue="+225 07 00 00 00 00"
                icon={<Smartphone className="w-4 h-4" />}
              />
              <Input
                label="Site Web"
                defaultValue="https://dadaba.market"
                icon={<Globe className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Section: Système */}
          <div className="bg-white p-8 rounded-3xl border border-secondary-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-secondary-50">
              <div className="p-2 bg-secondary-900 text-white rounded-lg">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-black font-outfit text-secondary-900 uppercase tracking-wider text-sm">
                Paramètres Système
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-2xl">
                <div>
                  <p className="font-bold text-secondary-900 text-sm">
                    Maintenance du site
                  </p>
                  <p className="text-xs text-secondary-500">
                    Désactive les commandes clients pour tout le site
                  </p>
                </div>
                <div className="w-12 h-6 bg-secondary-200 rounded-full relative cursor-pointer ring-offset-2 focus-within:ring-2 ring-primary-500">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-2xl">
                <div>
                  <p className="font-bold text-secondary-900 text-sm">
                    Notifications Email
                  </p>
                  <p className="text-xs text-secondary-500">
                    Envoyer un email à l'admin pour chaque nouvelle commande
                  </p>
                </div>
                <div className="w-12 h-6 bg-primary-500 rounded-full relative cursor-pointer ring-offset-2 focus-within:ring-2 ring-primary-500">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pb-12">
            <Button variant="ghost" type="button">
              Réinitialiser
            </Button>
            <Button type="submit" className="px-10 gap-2" isLoading={isLoading}>
              <Save className="w-4 h-4" />
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
