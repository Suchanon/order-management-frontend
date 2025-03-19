import { useState, useEffect } from "react";
import { getOrders, deleteOrder } from "../api/orderApi";
import { useOrderStore } from "../store/orderStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  totalPrice: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderList() {
  const { orders, fetchOrders, deleteOrder, updateOrder } = useOrderStore();

  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [editingOrderData, setEditingOrderData] = useState<any>();

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (order: Order) => {
    setEditingOrderId(order.orderId);
    setEditingOrderData({ ...order });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (editingOrderData) {
      setEditingOrderData({ ...editingOrderData, [field]: e.target.value });
    }
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {

    if (editingOrderData) {
      const updatedItems = [...editingOrderData.items];
      if (field === "quantity") {
        // Allow empty input but don't update state immediately
        let newQuantity = value === "" ? "" : Math.max(1, Math.floor(Number(value)));
        updatedItems[index] = { ...updatedItems[index], quantity: newQuantity };
      } else {
        updatedItems[index] = { ...updatedItems[index], [field]: value };
      }

      setEditingOrderData({ ...editingOrderData, items: updatedItems });
    }
  };

  const handleSave = async () => {
    updateOrder(editingOrderData)
    setEditingOrderId(null);
    setEditingOrderData(null);
  };

  const handleCancel = () => {
    setEditingOrderId(null);
    setEditingOrderData(null);
  };

  const handleRemoveOrderById = async (orderId: number) => {
    const response:any = await deleteOrder(orderId); // Now, it correctly returns an object
  
    if (!response.success) {
      toast.error(`Error: ${response.error}`);
      return;
    }
  
    toast.success("Order deleted successfully!");
  };

  return (
    <div className="space-y-4 p-4">
       <ToastContainer position="top-right" closeButton={false} autoClose={3000} />
      {orders.map((order: Order) => (
        <div key={order.orderId} className="border p-4 rounded shadow">
          <p><strong>Order ID:</strong> {order.orderId}</p>

          <p><strong>Customer Name:</strong>
            {editingOrderId === order.orderId ? (
              <input
                value={editingOrderData?.customerName || ""}
                onChange={(e) => handleChange(e, "customerName")}
                className="border p-1 rounded ml-2"
              />
            ) : (
              ` ${order.customerName}`
            )}
          </p>

          <p><strong>Customer Email:</strong>
            {editingOrderId === order.orderId ? (
              <input
                value={editingOrderData?.customerEmail || ""}
                onChange={(e) => handleChange(e, "customerEmail")}
                className="border p-1 rounded ml-2"
              />
            ) : (
              ` ${order.customerEmail}`
            )}
          </p>

          <p><strong>Status:</strong>
            {editingOrderId === order.orderId ? (
              <input
                value={editingOrderData?.status || ""}
                onChange={(e) => handleChange(e, "status")}
                className="border p-1 rounded ml-2"
              />
            ) : (
              ` ${order.status}`
            )}
          </p>

          <p><strong>Items:</strong></p>
          <ul className="list-disc pl-4">
            {order.items.map((item: any, index: any) => (
              <li key={item.orderItemId}>
                <span><strong>Product:</strong> </span>
                {editingOrderId === order.orderId ? (
                  <input
                    value={editingOrderData?.items[index]?.productName || ""}
                    onChange={(e) => handleItemChange(index, "productName", e.target.value)}
                    className="border p-1 rounded ml-2"
                  />
                ) : (
                  ` ${item.productName}`
                )}

                <span> | <strong>Qty:</strong> </span>
                {editingOrderId === order.orderId ? (
                  <input
                    type="number"
                    value={editingOrderData?.items[index]?.quantity === "" ? "" : editingOrderData?.items[index]?.quantity || 1}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        handleItemChange(index, "quantity", 1); // Ensure it never stays empty
                      }
                    }}
                    className="border p-1 rounded ml-2 w-16"
                    min={1} // Prevents negative numbers
                  />

                ) : (
                  ` ${item.quantity}`
                )}

                <span> | <strong>Price:</strong> </span>
                {editingOrderId === order.orderId ? (
                  <input
                    type="number"
                    value={editingOrderData?.items[index]?.price || 0}
                    onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
                    className="border p-1 rounded ml-2 w-20"
                  />
                ) : (
                  ` $${item.price}`
                )}
              </li>
            ))}
          </ul>

          {editingOrderId === order.orderId ? (
            <div className="mt-2">
              <button onClick={handleSave} className="bg-green-500 text-white p-1 rounded mr-2">Save</button>
              <button onClick={handleCancel} className="bg-gray-500 text-white p-1 rounded">Cancel</button>
            </div>
          ) : (
            <div className="mt-2">
              <button onClick={() => handleEdit(order)} className="bg-blue-500 text-white p-1 rounded mr-2">Edit</button>
              <button onClick={() => handleRemoveOrderById(order.orderId)} className="bg-red-500 text-white p-1 rounded">Delete</button>
            </div>
          )}

          <hr className="mt-4" />
        </div>
      ))}
    </div>
  );
}
