import { useState } from "react";
import { createOrder } from "../api/orderApi"
import { useOrderStore } from "../store/orderStore"

interface OrderItem {
    productName: string;
    quantity: number;
    price: number | string;
}

interface Order {
    user: {
        name: string;
        email: string;
    };
    totalPrice: number;
    status: string;
    orderItems: OrderItem[];
}

export default function CreateOrder() {
    const { createOrder, fetchOrders } = useOrderStore();
    const [order, setOrder] = useState<Order>({
        user: { name: "", email: "" },
        totalPrice: 0,
        status: "pending",
        orderItems: [{ productName: "", quantity: 1, price: "" }],
    });

    const addItem = () => {
        setOrder((prev) => ({
            ...prev,
            orderItems: [...prev.orderItems, { productName: "", quantity: 1, price: "" }],
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
            const items = prev.orderItems.map((item, i) =>
                i === index ? { ...item, [key]: value } : item
            );
            return { ...prev, orderItems: items };
        });
    };

    const updateUser = (key: keyof Order["user"], value: string) => {
        setOrder((prev) => ({
            ...prev,
            user: { ...prev.user, [key]: value },
        }));
    };

    //   const calculateTotal = () => {
    //     return order.orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    //   };

    const sanitizeOrder = (): Order => {
        return {
            ...order,
            orderItems: order.orderItems.map((item) => ({
                ...item,
                price: item.price === "" ? 0 : item.price,
            })),
        };
    };
    const submitOrder = async () => {
        console.log("order>>>", order)
        alert("Order submitted successfully!");
        await createOrder(sanitizeOrder())
        await fetchOrders()
        setOrder({ user: { name: "", email: "" }, totalPrice: 0, status: "pending", orderItems: [{ productName: "", quantity: 1, price: "" }] });
        // const finalOrder = { ...order, totalPrice: calculateTotal() };
        // try {

        //     const response = await createOrder(sanitizeOrder())
        //     if (response) {
        //         alert("Order submitted successfully!");
        //         setOrder({ user: { name: "", email: "" }, totalPrice: 0, status: "pending", orderItems: [{ productName: "", quantity: 1, price: "" }] });
        //         // addOrder(order)
        //     }
        // } catch (error) {
        //     console.error("Error submitting order:", error);
        // }
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
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => updateItem(index, "price", Number(e.target.value))}
                    />
                    <button onClick={() => removeItem(index)}>Remove</button>
                </div>
            ))}
            <button onClick={addItem}>Add Item</button>
            <br />
            {/* <h3>Total Price: ${calculateTotal().toFixed(2)}</h3> */}
            <button onClick={submitOrder}>Submit Order</button>
        </div>
    );
}
