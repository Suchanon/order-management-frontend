import { create } from 'zustand';
import { getOrders, createOrder, updateOrder, deleteOrder } from "../api/orderApi"
interface OrderItem {
  orderItemId: number;
  customerEmail: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  totalPrice: string; // If totalPrice should be a number, change to `number`
  status: string;
  createdAt: string; // Consider using `Date` if you will parse it as a Date object
  items: OrderItem[];
}

interface OrderState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: number) => void;

  fetchOrders: () => void;
  createOrder: (order: any) => void;
}

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

  createOrder: async (order: any) => {
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

  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),

  updateOrder: async (order) => {
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

  deleteOrder: async (id) => {
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
