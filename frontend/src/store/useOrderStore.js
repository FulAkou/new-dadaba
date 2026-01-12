import { create } from "zustand";

export const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  setOrders: (orders) => set({ orders, error: null }),
  setCurrentOrder: (order) => set({ currentOrder: order, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      ),
      currentOrder:
        state.currentOrder?.id === orderId
          ? { ...state.currentOrder, status }
          : state.currentOrder,
    })),
}));
