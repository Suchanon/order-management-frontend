import { create } from 'zustand';

interface Order {
order_id: number;
  customerName: string;
  items: string;
  totalPrice: number;
}

interface OrderState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: number) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (order) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.order_id === order.order_id ? order : o)),
    })),
  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.order_id !== id),
    })),
}));
