import { useState, useEffect } from "react";
import { getOrders, deleteOrder } from "../api/orderApi"

import { useOrderStore } from '../store/orderStore';
interface OrderItem {
  order_item_id: number;
  customer_email: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  order_id: number;
  user_id: number;
  customer_name: string;
  customer_email: string;
  total_price: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const initialOrders: Order[] = [
  {
    order_id: 6,
    user_id: 13,
    customer_name: "John Doe updated",
    customer_email: "postman.doe@example.comupdated",
    total_price: "99999999.99",
    status: "pending",
    created_at: "2025-03-17T10:07:57.775Z",
    items: [
      {
        order_item_id: 7,
        customer_email: "postman.doe@example.comupdated",
        product_name: "Laptop updated",
        quantity: 99,
        price: 9999999,
      },
      {
        order_item_id: 8,
        customer_email: "postman.doe@example.comupdated",
        product_name: "Wireless Mouse updated",
        quantity: 9,
        price: 9999,
      },
    ],
  },
  {
    order_id: 1,
    user_id: 1,
    customer_name: "John Doe",
    customer_email: "john.doe@example.com",
    total_price: "10.00",
    status: "pending",
    created_at: "2025-03-16T17:40:48.606Z",
    items: [
      {
        order_item_id: 3,
        customer_email: "john.doe@example.com",
        product_name: "Laptop1",
        quantity: 1,
        price: 100,
      },
      {
        order_item_id: 2,
        customer_email: "john.doe@example.com",
        product_name: "Laptop1",
        quantity: 1,
        price: 100,
      },
    ],
  },
];

export default function OrderList() {
  const { orders, setOrders, deleteOrder: removeOrder } = useOrderStore();
  const fetchOrders = async () => {
    const data = await getOrders();
    console.log("data>>", data)
    setOrders(data);
  };

  const [editingEmail, setEditingEmail] = useState<number | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const handleEditItem = (itemId: number) => {
    setEditingItemId(itemId);
  };

  const handleEditEmail = (userId: number) => {
    setEditingEmail(userId);
  }

  const handleSave = () => {
    setEditingItemId(null);
    setEditingEmail(null);
  };

  useEffect(() => {
    fetchOrders();
    console.log('i fire once');
  }, []);

  const handleRemoveOrderById = async (orderId:number) =>{

    console.log("orderId>>", orderId)
    console.log("orders>>>", orders)
    const deleteSuc = await deleteOrder(orderId)
    if(deleteSuc){
      removeOrder(orderId)
    }else{
      console.log("Error")
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div>From order list naaa</div>
      {orders.map((order: any) => (
        <div key={order.order_id} className="border p-4 rounded shadow">
          <p><strong>Order##:</strong> {order.order_id}</p>
          <p><strong>Customer Name:</strong> {order.customer_name} </p>
          {editingEmail === order.user_id ? (<>
            <div>Editing</div>
            <input
              value={order.customer_email}
              // onChange={(e) => handleItemInputChange(order.order_id, item.order_item_id, "product_name", e.target.value)}
              placeholder="Product Name"
              className="border p-1 rounded"
            />
            <button onClick={() => { }} className="bg-blue-500 text-white p-1 rounded ml-2">Save</button>
          </>) : (<>
            <p><strong>Customer Email22:</strong> {order.customer_email}
              <button onClick={() => handleEditEmail(order.user_id)} className="bg-blue-500 text-white p-1 rounded ml-2">Edit</button>
            </p>
          </>)}


          <p><strong>Items:</strong></p>

          <ul className="list-disc pl-4">
            {order.items.map((item: any) => (
              <li key={item.order_item_id}>
                {editingItemId === item.order_item_id ? (<>
                  <input
                    value={item.product_name}
                    // onChange={(e) => handleItemInputChange(order.order_id, item.order_item_id, "product_name", e.target.value)}
                    placeholder="Product Name"
                    className="border p-1 rounded"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    // onChange={(e) => handleItemInputChange(order.order_id, item.order_item_id, "quantity", Number(e.target.value))}
                    placeholder="Quantity"
                    className="border p-1 rounded ml-2"
                  />
                  <input
                    type="number"
                    value={item.price}
                    // onChange={(e) => handleItemInputChange(order.order_id, item.order_item_id, "price", Number(e.target.value))}
                    placeholder="Price"
                    className="border p-1 rounded ml-2"
                  />
                  <button onClick={handleSave} className="bg-blue-500 text-white p-1 rounded ml-2">Save</button>
                </>) : (<>
                  Product name: {item.product_name} Q: {item.quantity} P: ${item.price}
                  <button className="bg-yellow-500 text-white p-1 rounded ml-2">Edit</button>
                  <button className="bg-red-500 text-white p-1 rounded ml-2">Delete</button>
                </>)}

              </li>
              
            ))}
          </ul>
          <button onClick={() => handleRemoveOrderById(order.order_id)} className="bg-red-500 text-white p-1 rounded mt-2">Delete</button>

          <div>--------------------------------------------------------------------------------------------------------------</div>
        </div>
      ))}

    </div>
  );
}
