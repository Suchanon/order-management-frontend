import axios from 'axios';

const API_URL:string = process.env.REACT_APP_API_URL || "http://localhost:3000";
export const getOrders = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const createOrder = async (order: any) => {
  const response = await axios.post(API_URL, order);
  return response.data;
};

export const updateOrder = async (id: number, order: any) => {
  const response = await axios.put(`${API_URL}/${id}`, order);
  return response.data;
};
//done
export const deleteOrder = async (id: number) => {
  console.log("Call delete order", id)
  await axios.delete(`${API_URL}/${id}`);
  return true
};
