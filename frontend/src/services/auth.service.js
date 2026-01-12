import api from "../lib/api/axios";
import { ENDPOINTS } from "../lib/api/endpoints";

const authService = {
  login: async (credentials) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get(ENDPOINTS.AUTH.ME);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  confirmEmail: async (token) => {
    const response = await api.get(
      `${ENDPOINTS.AUTH.CONFIRM_EMAIL}?token=${token}`
    );
    return response.data;
  },
};

export default authService;
