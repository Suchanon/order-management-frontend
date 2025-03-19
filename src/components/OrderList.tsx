import { useState, useEffect } from "react";
import { getOrders, deleteOrder } from "../api/orderApi";
import { useOrderStore } from "../store/orderStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OrderItem, Order } from "../interfaces/order"
import "../css/OrderList.css";

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
    toast.dismiss();
    toast.success("Order deleted successfully!");
  };

  return (
<div className="order-container">
  <ToastContainer position="top-right" closeButton={false} autoClose={3000} />
  {orders.map((order: Order) => (
    <div key={order.orderId} className="order-card">
      <p><strong>Order ID:</strong> {order.orderId}</p>

      <p><strong>Customer Name:</strong>
        {editingOrderId === order.orderId ? (
          <input
            value={editingOrderData?.customerName || ""}
            onChange={(e) => handleChange(e, "customerName")}
            className="order-input"
          />
        ) : (
          ` ${order.customerName}`
        )}
      </p>

      <p><strong>Items:</strong></p>
      
      <ul className="order-list">
        {order.items.map((item: OrderItem, index: number) => (
          <li key={item.orderItemId}>
            <span><strong>Product name:</strong> </span>
            {editingOrderId === order.orderId ? (
              <input
                value={editingOrderData?.items[index]?.productName || ""}
                onChange={(e) => handleItemChange(index, "productName", e.target.value)}
                className="order-input"
              />
            ) : (
              ` ${item.productName}`
            )}

            <span> | <strong>Quantity:</strong> </span>
            {editingOrderId === order.orderId ? (
              <input
                type="number"
                value={editingOrderData?.items[index]?.quantity === "" ? "" : editingOrderData?.items[index]?.quantity || 1}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    handleItemChange(index, "quantity", 1);
                  }
                }}
                className="order-input order-input-small"
                min={1}
              />
            ) : (
              ` ${item.quantity}`
            )}

            <span> | <strong>Price:</strong> </span>
            {editingOrderId === order.orderId ? (
              <input
                type="number"
                value={editingOrderData?.items[index]?.price || 1}
                onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
                className="order-input order-input-small"
              />
            ) : (
              `${item.price} bath.`
            )}
          </li>
        ))}
      </ul>

      {editingOrderId === order.orderId ? (
        <div className="button-group">
          <button onClick={handleSave} className="btn btn-save">Save</button>
          <button onClick={handleCancel} className="btn btn-cancel">Cancel</button>
        </div>
      ) : (
        <div className="button-group">
          <button onClick={() => handleEdit(order)} className="btn btn-edit">Edit</button>
          <button onClick={() => handleRemoveOrderById(order.orderId)} className="btn btn-delete">Delete</button>
        </div>
      )}

      <hr className="divider" />
    </div>
  ))}
</div>

  );
}
