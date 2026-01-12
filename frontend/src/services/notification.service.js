import api from "../lib/api/axios";
import { ENDPOINTS } from "../lib/api/endpoints";

const notificationService = {
  getNotifications: async () => {
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.LIST);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id));
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    return response.data;
  },
};

export default notificationService;
