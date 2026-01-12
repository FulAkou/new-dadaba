"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { dishSchema } from "@/lib/validations/dish.validation";
import dishService from "@/services/dish.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Image as ImageIcon, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function EditDishPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dishSchema),
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const watchedImageUrl = watch("imageUrl");

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const dish = await dishService.getDishById(id);
        reset(dish);
        if (dish.imageUrl) setPreviewUrl(dish.imageUrl);
      } catch (error) {
        toast.error("Plat introuvable");
        router.push("/admin/dishes");
      } finally {
        setIsFetching(false);
      }
    };
    fetchDish();
  }, [id, reset, router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (data.imageUrl) {
        formData.append("imageUrl", data.imageUrl);
      }

      await dishService.updateDish(id, formData);
      toast.success("Le plat a été mis à jour !");
      router.push("/admin/dishes");
    } catch (error) {
      const message =
        error.response?.data?.error || error.response?.data?.message || "Erreur lors de la mise à jour";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-secondary-500 font-bold uppercase tracking-widest text-xs">
          Récupération des données...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-slide-up">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/dishes"
          className="p-2 bg-white border border-secondary-100 rounded-xl hover:bg-secondary-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-secondary-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-black font-outfit text-secondary-900 leading-tight">
            Modifier le <span className="text-primary-500">Plat</span>
          </h1>
          <p className="text-secondary-500 font-medium">
            Mise à jour des informations de{" "}
            <span className="text-secondary-900 font-bold">
              {watch("name")}
            </span>
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="md:col-span-2 space-y-6 bg-white p-8 rounded-3xl border border-secondary-100 shadow-sm">
          <Input
            label="Nom du Plat"
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-secondary-200 bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-h-[120px]"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Prix (FCFA)"
              type="number"
              step="0.01"
              error={errors.price?.message}
              {...register("price", { valueAsNumber: true })}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700">
                Photo du Plat
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="dish-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="dish-image"
                  className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-secondary-50 text-secondary-700 border border-secondary-200 rounded-xl hover:bg-secondary-100 transition-all font-bold text-sm w-full"
                >
                  <ImageIcon className="w-4 h-4" />
                  {selectedFile ? "Changer de photo" : "Choisir une photo"}
                </label>
              </div>
              {selectedFile && (
                <p className="text-[10px] text-primary-500 font-bold italic">
                  Image sélectionnée : {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="submit" className="px-10 gap-2" isLoading={isLoading}>
              <Save className="w-4 h-4" />
              Sauvegarder les modifications
            </Button>
            <Link href="/admin/dishes">
              <Button variant="ghost" type="button">
                Annuler
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-secondary-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-widest">
              Aperçu Visuel
            </h3>

            <div className="aspect-square rounded-2xl bg-secondary-50 overflow-hidden border-2 border-dashed border-secondary-200 flex flex-col items-center justify-center p-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Aperçu"
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`flex-col items-center gap-2 text-secondary-400 ${
                  previewUrl ? "hidden" : "flex"
                }`}
              >
                <ImageIcon className="w-12 h-12 mb-2" />
                <p className="text-xs font-medium text-center italic">
                  Image manquante
                </p>
              </div>
            </div>

            <div className="bg-primary-50 p-4 rounded-xl space-y-2">
              <p className="text-[10px] font-black text-primary-600 uppercase tracking-wider">
                Note de l&apos;administrateur
              </p>
              <p className="text-xs text-primary-700 leading-relaxed font-medium">
                Les modifications seront immédiatement visibles par tous les
                clients sur la plateforme.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
