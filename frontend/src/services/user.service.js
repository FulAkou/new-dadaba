import api from "../lib/api/axios";
import { ENDPOINTS } from "../lib/api/endpoints";

const userService = {
  getUsers: async (params) => {
    const response = await api.get(ENDPOINTS.USERS.LIST, { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(ENDPOINTS.USERS.DETAIL(id));
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put(ENDPOINTS.USERS.UPDATE_PROFILE, userData);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post(ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  },
};

export default userService;
