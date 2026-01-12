export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/signin",
    REGISTER: "/auth/signup",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CONFIRM_EMAIL: "/auth/confirm",
  },
  DISHES: {
    LIST: "/dishes",
    DETAIL: (id) => `/dishes/${id}`,
    CREATE: "/dishes",
    UPDATE: (id) => `/dishes/${id}`,
    DELETE: (id) => `/dishes/${id}`,
  },
  ORDERS: {
    LIST: "/orders",
    MY_ORDERS: "/orders/my-orders",
    DETAIL: (id) => `/orders/${id}`,
    CREATE: "/orders",
    UPDATE_STATUS: (id) => `/orders/${id}/status`,
  },
  REVIEWS: {
    DISH_REVIEWS: (dishId) => `/reviews/dish/${dishId}`,
    CREATE: "/reviews",
    APPROVE: (id) => `/reviews/${id}/status`,
    REJECT: (id) => `/reviews/${id}/status`,
    ALL: "/reviews/all",
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_AS_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
  },
  USERS: {
    LIST: "/users",
    DETAIL: (id) => `/users/${id}`,
    CREATE: "/users",
    UPDATE_PROFILE: "/users/profile",
  },
  APPLICATIONS: {
    CREATE: "/applications",
    LIST: "/applications",
  },
};
