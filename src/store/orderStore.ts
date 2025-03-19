import { create } from 'zustand';
import { getOrders, createOrder, updateOrder, deleteOrder } from "../api/orderApi"
import { Order, OrderState } from "../interfaces/order"

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],

  setOrders: (orders) => set({ orders }),

  fetchOrders: async () => {
    try {
      const response = await getOrders();
      set({ orders: response });
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.message || error.message || "Failed to fetch orders",
      };
    }
  },

  createOrder: async (order: Order) => {
    try {
      const response = await createOrder(order);
      set({ orders: await getOrders() });
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.message || error.message || "Failed to create order",
      };
    }
  },

  addOrder: (order: Order) => set((state) => ({ orders: [...state.orders, order] })),

  updateOrder: async (order: Order) => {
    try {
      const response = await updateOrder(order);
      set({ orders: await getOrders() });
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.message || error.message || "Failed to update order",
      };
    }
  },

  deleteOrder: async (id: number) => {
    try {
      const response = await deleteOrder(id);
      set((state) => ({
        orders: state.orders.filter((o) => o.orderId !== id),
      }));
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error?.response?.data?.message || error.message || "Failed to delete order",
      };
    }
  },
}));
