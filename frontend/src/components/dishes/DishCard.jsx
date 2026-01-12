"use client";

import Button from "@/components/ui/Button";
import { useCartStore } from "@/store";
import { Eye, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

const DishCard = ({ dish }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(dish);
    toast.success(`${dish.name} ajouté au panier !`);
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-secondary-100 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={dish.imageUrl || "/images/placeholder-dish.png"}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          width={500}
          height={500}
        />

        {/* Overlay Buttons */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link href={`/dishes/${dish.id}`}>
            <button className="p-3 bg-white rounded-full text-secondary-900 hover:bg-primary-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
              <Eye className="w-5 h-5" />
            </button>
          </Link>
          <button
            onClick={handleAddToCart}
            className="p-3 bg-primary-500 rounded-full text-white hover:bg-primary-600 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-secondary-900 border border-white/20">
            {dish.price} FCFA
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-secondary-900 group-hover:text-primary-500 transition-colors">
            {dish.name}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold text-secondary-600">4.5</span>
          </div>
        </div>

        <p className="text-sm text-secondary-500 line-clamp-2 leading-relaxed">
          {dish.description}
        </p>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-2xl font-black text-secondary-900 font-outfit">
            {dish.price}
            <span className="text-sm font-bold text-primary-500 ml-1">€</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg py-2"
            onClick={handleAddToCart}
          >
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
