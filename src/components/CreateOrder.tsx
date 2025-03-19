import { useState } from "react";
import { useOrderStore } from "../store/orderStore"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface OrderItem {
    productName: string;
    quantity: number;
    price: number | string;
}

interface CreateOrderInterface {
    user: {
        name: string;
        email: string;
    };
    totalPrice: number;
    status: string;
    orderItems: OrderItem[];
}

export default function CreateOrder() {
    const { createOrder,  } = useOrderStore();
    const [order, setOrder] = useState<CreateOrderInterface>({
        user: { name: "", email: "" },
        totalPrice: 0,
        status: "pending",
        orderItems: [{ productName: "", quantity: 1, price: 0 }],
    });

    const addItem = () => {
        setOrder((prev) => ({
            ...prev,
            orderItems: [...prev.orderItems, { productName: "", quantity: 1, price: 0 }],
        }));
    };

    const removeItem = (index: number) => {
        setOrder((prev) => {
            const items = prev.orderItems.filter((_, i) => i !== index);
            return { ...prev, orderItems: items };
        });
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
        setOrder({ user: { name: "", email: "" }, totalPrice: 0, status: "pending", orderItems: [{ productName: "", quantity: 1, price: "" }] });

    };

    return (
        <div>
            <h2>Create Order</h2>
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    value={order.user.name}
                    onChange={(e) => updateUser("name", e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={order.user.email}
                    onChange={(e) => updateUser("email", e.target.value)}
                />
            </div>
            <h3>Order Items</h3>
            {order.orderItems.map((item, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={item.productName}
                        onChange={(e) => updateItem(index, "productName", e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={order.orderItems[index].quantity || ""}
                        onChange={(e) => updateItem(index, "quantity", e.target.value ? Number(e.target.value) : "")}
                        onBlur={(e) => {
                            if (!e.target.value || Number(e.target.value) <= 0) {
                                updateItem(index, "quantity", 1); // Restore 1 if empty or invalid
                            }
                        }}
                        min={1}
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={order.orderItems[index].price || ""}
                        onChange={(e) => updateItem(index, "price", e.target.value ? Number(e.target.value) : "")}
                        onBlur={(e) => {
                            if (!e.target.value) {
                                updateItem(index, "price", 0); // Restore 0 if empty
                            }
                        }}
                        min={0}
                    />

                    <button onClick={() => removeItem(index)}>Remove</button>
                </div>
            ))}
            <button onClick={addItem}>Add Item</button>
            <br />
            <button onClick={submitOrder}>Submit Order</button>
        </div>
    );
}
