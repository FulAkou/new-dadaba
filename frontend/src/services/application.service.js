import api from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";

const applicationService = {
  createApplication: async (data) => {
    // data should be FormData because of file upload
    const response = await api.post(ENDPOINTS.APPLICATIONS.CREATE, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getAllApplications: async () => {
    const response = await api.get(ENDPOINTS.APPLICATIONS.LIST);
    return response.data;
  },
};

export default applicationService;
