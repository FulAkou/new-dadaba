import api from "../lib/api/axios";
import { ENDPOINTS } from "../lib/api/endpoints";

const dishService = {
  getDishes: async (params) => {
    const response = await api.get(ENDPOINTS.DISHES.LIST, { params });
    return response.data;
  },

  getDishById: async (id) => {
    const response = await api.get(ENDPOINTS.DISHES.DETAIL(id));
    return response.data;
  },

  createDish: async (dishData) => {
    const config =
      dishData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    const response = await api.post(ENDPOINTS.DISHES.CREATE, dishData, config);
    return response.data;
  },

  updateDish: async (id, dishData) => {
    const config =
      dishData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    const response = await api.put(
      ENDPOINTS.DISHES.UPDATE(id),
      dishData,
      config
    );
    return response.data;
  },

  deleteDish: async (id) => {
    const response = await api.delete(ENDPOINTS.DISHES.DELETE(id));
    return response.data;
  },
};

export default dishService;
