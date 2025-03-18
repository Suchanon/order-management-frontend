import { create } from 'zustand';
import { getOrders, createOrder } from "../api/orderApi"
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

  fetchOrders: () => Promise<void>;
  createOrder: (order: any) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  fetchOrders: async () => {
    set({ orders: await getOrders() });
  },
  createOrder: async (order: any) => {
    await createOrder(order)
    set({ orders: await getOrders() });
  },
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (order) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.orderId === order.orderId ? order : o)),
    })),
  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.orderId !== id),
    })),
}));
