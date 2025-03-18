import { useState, useEffect } from "react";
import { getOrders, deleteOrder } from "../api/orderApi"

import { useOrderStore } from '../store/orderStore';
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
  total_price: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const initialOrders: Order[] = [
  {
    orderId: 6,
    userId: 13,
    customerName: "John Doe updated",
    customerEmail: "postman.doe@example.comupdated",
    total_price: "99999999.99",
    status: "pending",
    created_at: "2025-03-17T10:07:57.775Z",
    items: [
      {
        orderItemId: 7,
        customerEmail: "postman.doe@example.comupdated",
        productName: "Laptop updated",
        quantity: 99,
        price: 9999999,
      },
      {
        orderItemId: 8,
        customerEmail: "postman.doe@example.comupdated",
        productName: "Wireless Mouse updated",
        quantity: 9,
        price: 9999,
      },
    ],
  },
  {
    orderId: 1,
    userId: 1,
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    total_price: "10.00",
    status: "pending",
    created_at: "2025-03-16T17:40:48.606Z",
    items: [
      {
        orderItemId: 3,
        customerEmail: "john.doe@example.com",
        productName: "Laptop1",
        quantity: 1,
        price: 100,
      },
      {
        orderItemId: 2,
        customerEmail: "john.doe@example.com",
        productName: "Laptop1",
        quantity: 1,
        price: 100,
      },
    ],
  },
];

export default function OrderList() {
  const { orders, createOrder, fetchOrders, deleteOrder: removeOrder } = useOrderStore();
  // const fetchOrders = async () => {
  //   const data = await getOrders();
  //   console.log("data>>", data)
  //   setOrders(data);
  // };

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
        <div key={order.orderId} className="border p-4 rounded shadow">
          <p><strong>Order##:</strong> {order.orderId}</p>
          <p><strong>Customer Name:</strong> {order.customerName} </p>
          {editingEmail === order.userId ? (<>
            <div>Editing</div>
            <input
              value={order.customerEmail}
              // onChange={(e) => handleItemInputChange(order.orderId, item.orderItemId, "productName", e.target.value)}
              placeholder="Product Name"
              className="border p-1 rounded"
            />
            <button onClick={() => { }} className="bg-blue-500 text-white p-1 rounded ml-2">Save</button>
          </>) : (<>
            <p><strong>Customer Email22:</strong> {order.customerEmail}
              <button onClick={() => handleEditEmail(order.userId)} className="bg-blue-500 text-white p-1 rounded ml-2">Edit</button>
            </p>
          </>)}


          <p><strong>Items:</strong></p>

          <ul className="list-disc pl-4">
            {order.items.map((item: any) => (
              <li key={item.orderItemId}>
                {editingItemId === item.orderItemId ? (<>
                  <input
                    value={item.productName}
                    // onChange={(e) => handleItemInputChange(order.orderId, item.orderItemId, "productName", e.target.value)}
                    placeholder="Product Name"
                    className="border p-1 rounded"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    // onChange={(e) => handleItemInputChange(order.orderId, item.orderItemId, "quantity", Number(e.target.value))}
                    placeholder="Quantity"
                    className="border p-1 rounded ml-2"
                  />
                  <input
                    type="number"
                    value={item.price}
                    // onChange={(e) => handleItemInputChange(order.orderId, item.orderItemId, "price", Number(e.target.value))}
                    placeholder="Price"
                    className="border p-1 rounded ml-2"
                  />
                  <button onClick={handleSave} className="bg-blue-500 text-white p-1 rounded ml-2">Save</button>
                </>) : (<>
                  Product name: {item.productName} Q: {item.quantity} P: ${item.price}
                  <button className="bg-yellow-500 text-white p-1 rounded ml-2">Edit</button>
                  <button className="bg-red-500 text-white p-1 rounded ml-2">Delete</button>
                </>)}

              </li>
              
            ))}
          </ul>
          <button onClick={() => handleRemoveOrderById(order.orderId)} className="bg-red-500 text-white p-1 rounded mt-2">Delete</button>

          <div>--------------------------------------------------------------------------------------------------------------</div>
        </div>
      ))}

    </div>
  );
}
