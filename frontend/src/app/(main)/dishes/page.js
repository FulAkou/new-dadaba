"use client";

import DishCard from "@/components/dishes/DishCard";
import dishService from "@/services/dish.service";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

export default function DishesPage() {
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const data = await dishService.getDishes();
        setDishes(data.dishes || data); // Handle both array and paginated response
      } catch (error) {
        console.error("Error fetching dishes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const filteredDishes = Array.isArray(dishes)
    ? dishes.filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dish.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-outfit text-secondary-900 leading-tight">
            Notre <span className="text-primary-500">Menu</span>
          </h1>
          <p className="text-secondary-500 max-w-md">
            Découvrez une collection de plats gastronomiques conçus pour
            éveiller vos sens au festival.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un plat..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 bg-secondary-100 rounded-xl text-secondary-600 hover:bg-secondary-200 transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
          <p className="text-secondary-500 font-medium">
            Chargement des délices...
          </p>
        </div>
      ) : filteredDishes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary-50 rounded-3xl border-2 border-dashed border-secondary-200">
          <p className="text-secondary-500 text-lg">
            Aucun plat ne correspond à votre recherche.
          </p>
        </div>
      )}
    </div>
  );
}
