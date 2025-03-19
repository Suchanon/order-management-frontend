import { useState } from "react";
import { useOrderStore } from "../store/orderStore"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/CreateOrder.css";
interface OrderItem {
    productName: string;
    quantity: number | string;
    price: number | string;
}

interface CreateOrderInterface {
    user: {
        name: string;
    };
    orderItems: OrderItem[];
}

export default function CreateOrder() {
    const { createOrder,  } = useOrderStore();
    const [order, setOrder] = useState<CreateOrderInterface>({
        user: { name: ""},
        orderItems: [{ productName: "", quantity: "", price: 0 }],
    });

    const addItem = () => {
        setOrder((prev) => ({
            ...prev,
            orderItems: [...prev.orderItems, { productName: "", quantity: 1, price: 0 }],
        }));
    };

    const removeItem = (index: number) => {
        if(index>1){
            setOrder((prev) => {
                const items = prev.orderItems.filter((_, i) => i !== index);
                return { ...prev, orderItems: items };
            });
        }else{
            toast.dismiss();
            toast.info("Please buy me one product😊");
        }

    };

    const updateItem = (index: number, key: keyof OrderItem, value: string | number) => {
        setOrder((prev) => {
            const items = prev.orderItems.map((item, i) => {
                if (i !== index) return item;

                let updatedValue = value;

                if (key === "quantity") {
                    updatedValue = value === "" ? "" : Math.max(1, Math.floor(Number(value)));
                } else if (key === "price") {
                    updatedValue = value === "" ? "" : Math.max(0, Number(value));
                }

                return { ...item, [key]: updatedValue };
            });

            return { ...prev, orderItems: items };
        });
    };


    const updateUser = (key: keyof CreateOrderInterface["user"], value: string) => {
        setOrder((prev) => ({
            ...prev,
            user: { ...prev.user, [key]: value },
        }));
    };


    const sanitizeOrder = (): any => {
        return {
            ...order,
            orderItems: order.orderItems.map((item) => ({
                ...item,
                price: item.price === "" ? 0 : item.price,
            })),
        };
    };
    const submitOrder = async () => {
        const response: any = await createOrder(sanitizeOrder())
        if (!response.success) {
            toast.error("Failed to submit order.");
            return;
        }
        toast.dismiss();
        toast.success("Order submitted successfully!");
        setOrder({ user: { name: "" }, orderItems: [{ productName: "", quantity: 1, price: "" }] });

    };

    return (
        <div className="order-form modern">
            <h2 className="title">Create Order</h2>
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Name"
                    value={order.user.name}
                    onChange={(e) => updateUser("name", e.target.value)}
                    className="input"
                />
            </div>
            <h3 className="subtitle">Order Items</h3>
            <div className="items-list">
                {order.orderItems.map((item, index) => (
                    <div key={index} className="order-item modern-card">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={item.productName}
                            onChange={(e) => updateItem(index, "productName", e.target.value)}
                            className="input"
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={item.quantity || ""}
                            onChange={(e) => updateItem(index, "quantity", e.target.value ? Number(e.target.value) : "")}
                            onBlur={(e) => {
                                if (!e.target.value || Number(e.target.value) <= 0) {
                                    updateItem(index, "quantity", 1);
                                }
                            }}
                            min={1}
                            className="input"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={item.price || ""}
                            onChange={(e) => updateItem(index, "price", e.target.value ? Number(e.target.value) : "")}
                            onBlur={(e) => {
                                if (!e.target.value) {
                                    updateItem(index, "price", 0);
                                }
                            }}
                            min={0}
                            className="input"
                        />
                        <button
                            onClick={() => removeItem(index)}
                            className="remove-btn modern-btn"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={addItem} className="add-btn modern-btn">
                Add Item
            </button>
            <button onClick={submitOrder} className="submit-btn modern-btn">
                Submit Order
            </button>
        </div>
    );
}
