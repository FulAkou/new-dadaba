"use client";

import Button from "@/components/ui/Button";
import dishService from "@/services/dish.service";
import reviewService from "@/services/review.service";
import { useAuthStore, useCartStore } from "@/store";
import {
  ChevronLeft,
  Clock,
  Flame,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DishDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [dish, setDish] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuthStore();

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dishData = await dishService.getDishById(id);
        setDish(dishData);
        // Reviews are already included in dishData from the backend include
        if (dishData.reviews) {
          setReviews(dishData.reviews);
        }
      } catch (error) {
        toast.error("Plat introuvable");
        router.push("/dishes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleAddToCart = () => {
    addItem(dish, quantity);
    toast.success(`${dish.name} ajouté au panier !`);
  };

  const handleOpenReviewModal = () => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour donner votre avis");
      router.push("/login");
      return;
    }
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userComment.trim()) {
      toast.error("Veuillez écrire un commentaire");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await reviewService.createReview({
        dishId: id,
        rating: userRating,
        comment: userComment,
      });
      toast.success("Votre avis a été soumis avec succès !");
      setIsReviewModalOpen(false);
      setUserComment("");
      setUserRating(5);

      // Refresh reviews
      const dishData = await dishService.getDishById(id);
      if (dishData.reviews) {
        setReviews(dishData.reviews);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Erreur lors de l'envoi de l'avis"
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-secondary-500 font-bold font-outfit uppercase tracking-widest text-xs">
          Préparation de la vue...
        </p>
      </div>
    );
  }

  if (!dish) return null;
  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-secondary-500 hover:text-primary-500 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Retour</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Image */}
        <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-secondary-100 border-8 border-white shadow-2xl">
          <Image
            src={dish.imageUrl || "/images/placeholder-dish.png"}
            alt={dish.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-8 left-8 flex gap-3">
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold text-secondary-900">
              <Flame className="w-4 h-4 text-orange-500" /> Populaire
            </div>
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold text-secondary-900">
              <Clock className="w-4 h-4 text-primary-500" /> 15-20 min
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-black font-outfit text-secondary-900">
              {dish.name}
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full text-yellow-600">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-black">4.8</span>
              </div>
              <span className="text-secondary-400 font-medium">
                ({reviews.length} Avis clients)
              </span>
            </div>
          </div>

          <p className="text-lg text-secondary-600 leading-relaxed">
            {dish.description}
          </p>

          <div className="space-y-6">
            <p className="text-4xl font-black text-primary-500 font-outfit">
              {dish.price.toFixed(2)} FCFA
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center gap-4 bg-secondary-100 p-2 rounded-2xl w-full sm:w-auto justify-between">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary-600 hover:text-primary-500 transition-colors shadow-sm"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-black text-xl text-secondary-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary-600 hover:text-primary-500 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <Button
                size="lg"
                className="w-full flex-grow py-6 gap-3 group"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Ajouter au panier • {(dish.price * quantity).toFixed(2)} FCFA
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-secondary-50 rounded-2xl flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="text-xs font-bold text-secondary-600 uppercase tracking-widest leading-tight">
                Authenticité
                <br />
                Garantie
              </span>
            </div>
            <div className="p-4 bg-secondary-50 rounded-2xl flex items-center gap-4">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-xs font-bold text-secondary-600 uppercase tracking-widest leading-tight">
                Ingrédients
                <br />
                Frais
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-32 space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black font-outfit text-secondary-900">
            Avis de la <span className="text-primary-500">Communauté</span>
          </h2>
          <Button
            variant="ghost"
            className="font-bold underline"
            onClick={handleOpenReviewModal}
          >
            Donner mon avis
          </Button>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-8 rounded-[2.5rem] border border-secondary-100 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-400 font-bold">
                      {review.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-secondary-900">
                        {review.user?.name}
                      </p>
                      <p className="text-[10px] text-secondary-400 font-bold uppercase tracking-widest">
                        Client Vérifié
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < review.rating
                            ? "fill-current"
                            : "text-secondary-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-secondary-600 leading-relaxed italic">
                  &quot;{review.comment}&quot;
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary-50 rounded-[3rem] border-2 border-dashed border-secondary-200">
            <p className="text-secondary-500 font-medium">
              Aucun avis pour le moment. Soyez le premier !
            </p>
          </div>
        )}
      </section>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 relative animate-scale-in">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-secondary-50 rounded-full transition-colors text-secondary-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black font-outfit text-secondary-900 mb-2">
              Notez ce <span className="text-primary-500">Plat</span>
            </h3>
            <p className="text-secondary-500 mb-6">
              Partagez votre expérience avec la communauté
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          userRating >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-secondary-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="font-bold text-secondary-900">
                  {userRating}/5 -{" "}
                  {userRating === 5
                    ? "Excellent !"
                    : userRating === 4
                    ? "Très bon"
                    : userRating === 3
                    ? "Bien"
                    : userRating === 2
                    ? "Moyen"
                    : "Mauvais"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary-700">
                  Votre commentaire
                </label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Qu'avez-vous pensé du goût, de la texture ?"
                  className="w-full h-32 px-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full py-4 text-lg"
                isLoading={isSubmittingReview}
              >
                Publier mon avis
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
