
  export interface Order {
    orderId: number;
    userId: number;
    customerName: string;
    createdAt: string;
    items: OrderItem[];
  }


  export interface CreateOrderInterface {
      user: {
          name: string;
          email: string;
      };
      totalPrice: number;
      status: string;
      orderItems: OrderItem[];
  }
  export interface OrderItem {
    orderItemId: number;
    productName: string;
    quantity: number;
    price: number | string;
  }
  
  
  export interface OrderState {
    orders: Order[];
    setOrders: (orders: Order[]) => void;
    addOrder: (order: Order) => void;
    updateOrder: (order: Order) => void;
    deleteOrder: (id: number) => void;
    fetchOrders: () => Promise<{ success: boolean; data?: Order[]; error?: string }>;
    createOrder: (order: Order) => Promise<{ success: boolean; data?: Order; error?: string }>;
  }