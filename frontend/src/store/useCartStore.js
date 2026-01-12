import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (dish, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === dish.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === dish.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...dish, quantity }] });
        }
      },

      removeItem: (dishId) => {
        set({
          items: get().items.filter((item) => item.id !== dishId),
        });
      },

      updateQuantity: (dishId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(dishId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === dishId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
