import api from "../lib/api/axios";
import { ENDPOINTS } from "../lib/api/endpoints";

const orderService = {
  getOrders: async (params) => {
    const response = await api.get(ENDPOINTS.ORDERS.LIST, { params });
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get(ENDPOINTS.ORDERS.MY_ORDERS);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(ENDPOINTS.ORDERS.DETAIL(id));
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await api.post(ENDPOINTS.ORDERS.CREATE, orderData);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(ENDPOINTS.ORDERS.UPDATE_STATUS(id), {
      status,
    });
    return response.data;
  },
};

export default orderService;
