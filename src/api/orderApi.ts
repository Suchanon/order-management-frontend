import axios from 'axios';

const API_URL: string = 
  `${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_VERSION}/orders` || 
  "http://localhost:3000/v1/orders";

/**
 * Handles API errors and logs them
 */
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", error.response?.data || error.message);
    return { error: error.response?.data?.message || "An unexpected error occurred" };
  }
  return { error: "Something went wrong" };
};

/**
 * Fetch orders with error handling
 */
export const getOrders = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new order with error handling
 */
export const createOrder = async (order: any) => {
  try {
    const response = await axios.post(API_URL, order);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update an order with error handling
 */
export const updateOrder = async (order: any) => {
  try {
    const response = await axios.put(`${API_URL}/full-update`, order);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete an order with error handling
 */
export const deleteOrder = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return { success: true };
  } catch (error) {
    throw handleApiError(error);
  }
};
