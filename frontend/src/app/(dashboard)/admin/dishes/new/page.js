"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { dishSchema } from "@/lib/validations/dish.validation";
import dishService from "@/services/dish.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Image as ImageIcon, Upload, X } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function NewDishPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      price: 0,
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image est trop lourde (max 5Mo)");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("image", selectedFile);

      await dishService.createDish(formData);
      toast.success("Le plat a été créé avec succès !");
      router.push("/admin/dishes");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la création"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            Ajouter un <span className="text-primary-500">Plat</span>
          </h1>
          <p className="text-secondary-500 font-medium">
            Créez une nouvelle expérience culinaire
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Left Side: Basic Info */}
        <div className="md:col-span-2 space-y-6 bg-white p-8 rounded-3xl border border-secondary-100 shadow-sm">
          <Input
            label="Nom du Plat"
            placeholder="ex: Risotto aux Champignons des bois"
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-secondary-200 bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-h-[120px]"
              placeholder="Décrivez les saveurs, les ingrédients et ce qui rend ce plat spécial..."
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
              placeholder="0.00"
              error={errors.price?.message}
              {...register("price")}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700">
                Image du Plat
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {!selectedFile ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-secondary-200 hover:border-primary-500 hover:bg-primary-50 text-secondary-500 hover:text-primary-600 transition-all font-bold"
                >
                  <Upload className="w-5 h-5" />
                  Choisir une photo
                </button>
              ) : (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-primary-100 bg-primary-50 text-primary-700">
                  <span className="text-sm font-bold truncate max-w-[150px]">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 hover:bg-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="submit" className="px-10" isLoading={isLoading}>
              Publier le Plat
            </Button>
            <Link href="/admin/dishes">
              <Button variant="ghost" type="button">
                Annuler
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-secondary-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-secondary-900 uppercase tracking-widest">
              Aperçu Visuel
            </h3>

            <div className="aspect-square rounded-2xl bg-secondary-50 overflow-hidden border-2 border-dashed border-secondary-200 flex flex-col items-center justify-center p-4 text-center relative group">
              {previewUrl ? (
                <>
                  <NextImage
                    src={previewUrl}
                    alt="Aperçu"
                    fill
                    className="object-cover rounded-xl"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-secondary-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
                    >
                      Changer
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-secondary-400">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <p className="text-xs font-medium">
                    L&apos;aperçu apparaîtra ici après avoir choisi une photo
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-secondary-50">
              <div
                className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg ${
                  selectedFile
                    ? "text-green-600 bg-green-50"
                    : "text-secondary-400 bg-secondary-50"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    selectedFile
                      ? "bg-green-500 animate-pulse"
                      : "bg-secondary-300"
                  }`}
                />
                {selectedFile ? "Prêt pour publication" : "Attente d'image"}
              </div>
              <p className="text-[10px] text-secondary-400 leading-relaxed italic">
                * Les images seront optimisées automatiquement pour le web.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
