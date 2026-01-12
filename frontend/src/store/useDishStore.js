import { create } from "zustand";

export const useDishStore = create((set) => ({
  dishes: [],
  featuredDishes: [],
  currentDish: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },

  setDishes: (dishes, pagination) =>
    set({
      dishes,
      pagination: pagination || {
        page: 1,
        limit: dishes.length,
        total: dishes.length,
        pages: 1,
      },
      error: null,
    }),
  setFeaturedDishes: (dishes) => set({ featuredDishes: dishes }),
  setCurrentDish: (dish) => set({ currentDish: dish, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addDish: (dish) => set((state) => ({ dishes: [dish, ...state.dishes] })),
  updateDish: (dish) =>
    set((state) => ({
      dishes: state.dishes.map((d) => (d.id === dish.id ? dish : d)),
      currentDish: state.currentDish?.id === dish.id ? dish : state.currentDish,
    })),
  removeDish: (dishId) =>
    set((state) => ({
      dishes: state.dishes.filter((d) => d.id !== dishId),
    })),
}));
