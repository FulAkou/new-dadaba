"use client";

import dishService from "@/services/dish.service";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import DishCard from "./DishCard";

export default function FeaturedDishes() {
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const data = await dishService.getDishes();
        // Handle both array and paginated response
        const dishList = data.dishes || data;
        setDishes(Array.isArray(dishList) ? dishList : []);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishes();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
          <p className="text-secondary-500 font-medium animate-pulse">
            Préparation de nos spécialités...
          </p>
        </div>
      </section>
    );
  }

  if (dishes.length === 0) {
    return null; // Don't show the section if no dishes
  }

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50 -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-50 rounded-full blur-3xl opacity-50 -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-primary-500 font-bold tracking-wider uppercase text-sm">
              Notre Menu
            </h2>
            <h3 className="text-4xl md:text-5xl font-black font-outfit text-secondary-900 leading-tight">
              Découvrez nos <br />
              <span className="text-primary-500">Incontournables</span>
            </h3>
            <p className="text-secondary-600 max-w-md">
              Une sélection rigoureuse des meilleurs morceaux de viande,
              cuisinés avec passion pour une explosion de saveurs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {dishes.slice(0, 8).map((dish, index) => (
            <div
              key={dish.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <DishCard dish={dish} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
