import api from "../lib/api/axios";
import { ENDPOINTS } from "../lib/api/endpoints";

const reviewService = {
  getDishReviews: async (dishId) => {
    const response = await api.get(ENDPOINTS.REVIEWS.DISH_REVIEWS(dishId));
    return response.data;
  },

  getAllReviews: async (params) => {
    const response = await api.get(ENDPOINTS.REVIEWS.ALL, { params });
    return response.data;
  },

  createReview: async (reviewData) => {
    const response = await api.post(ENDPOINTS.REVIEWS.CREATE, reviewData);
    return response.data;
  },

  approveReview: async (id) => {
    const response = await api.patch(ENDPOINTS.REVIEWS.APPROVE(id), {
      status: "APPROVED",
    });
    return response.data;
  },

  rejectReview: async (id) => {
    const response = await api.patch(ENDPOINTS.REVIEWS.REJECT(id), {
      status: "REJECTED",
    });
    return response.data;
  },
};

export default reviewService;
