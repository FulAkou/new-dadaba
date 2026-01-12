import Cookies from "js-cookie";

export const setupInterceptors = (api) => {
  // Request Interceptor
  api.interceptors.request.use(
    (config) => {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const { response } = error;

      if (response && response.status === 401) {
        // Unauthorized - Clear auth state and redirect to login if not already there
        Cookies.remove("token");
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/login")
        ) {
          // window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );
};
