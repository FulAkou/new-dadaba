"use client";

import Button from "@/components/ui/Button";
import applicationService from "@/services/application.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, ChefHat, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const recruitmentSchema = z.object({
  lastName: z.string().min(2, "Le nom est requis"),
  firstName: z.string().min(2, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  cv: z
    .custom((value) => {
      return value instanceof FileList && value.length > 0;
    }, "Le CV est requis")
    .refine((files) => files[0]?.size <= 5000000, `La taille max est de 5MB.`)
    .refine(
      (files) =>
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(files[0]?.type),
      "Format accepté : PDF ou Word"
    ),
});

export default function RecruitmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(recruitmentSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("lastName", data.lastName);
      formData.append("firstName", data.firstName);
      formData.append("email", data.email);
      formData.append("cv", data.cv[0]);
      // Default position
      formData.append("position", "Chef Cuisinier");

      await applicationService.createApplication(formData);
      toast.success("Votre candidature a bien été envoyée !");

      reset();
      setFileName("");
    } catch (error) {
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-20 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-primary-100 rounded-full mb-4 animate-scale-in">
            <ChefHat className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-outfit text-secondary-900">
            Rejoignez notre <span className="text-primary-500">Brigade</span>
          </h1>
          <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
            Nous sommes à la recherche de talents passionnés pour enrichir notre
            expérience culinaire. Si vous êtes un Chef Cuisinier créatif et
            rigoureux, cette opportunité est pour vous.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-secondary-100">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                  Le Poste : Chef Cuisinier
                </h3>
                <p className="text-secondary-500 leading-relaxed">
                  En tant que Chef Cuisinier, vous serez responsable de la
                  création des menus, de la gestion de la cuisine et de la
                  garantie de la qualité exceptionnelle de chaque plat servi.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-secondary-900">
                  Ce que nous cherchons :
                </h4>
                <ul className="space-y-3">
                  {[
                    "Expérience confirmée en cuisine gastronomique",
                    "Leadership et esprit d'équipe",
                    "Créativité et passion pour les produits frais",
                    "Rigueur et respect des normes d'hygiène",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-secondary-600"
                    >
                      <span className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary-600" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-secondary-50 p-6 rounded-3xl">
              <h3 className="text-xl font-bold text-secondary-900 mb-6">
                Postuler maintenant
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary-700">
                      Nom
                    </label>
                    <input
                      {...register("lastName")}
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white transition-all"
                      placeholder="Votre nom"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary-700">
                      Prénoms
                    </label>
                    <input
                      {...register("firstName")}
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white transition-all"
                      placeholder="Vos prénoms"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary-700">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-white transition-all"
                    placeholder="Contact email"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary-700">
                    CV (PDF/Word)
                  </label>
                  <div className="relative">
                    <input
                      {...register("cv")}
                      type="file"
                      id="cv-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        register("cv").onChange(e);
                        handleFileChange(e);
                      }}
                    />
                    <label
                      htmlFor="cv-upload"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-8 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                        fileName
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-secondary-200 bg-white text-secondary-500 hover:border-primary-300 hover:text-primary-500"
                      }`}
                    >
                      <Upload className="w-5 h-5 mb-0.5" />
                      <span className="font-bold text-sm text-center">
                        {fileName || "Cliquez pour charger votre CV"}
                      </span>
                    </label>
                  </div>
                  {errors.cv && (
                    <p className="text-xs text-red-500">{errors.cv.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-4 text-lg mt-2 flex items-center justify-center"
                  isLoading={isSubmitting}
                >
                  <span>Envoyer ma candidature</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
