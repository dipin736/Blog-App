import axios from "axios";

const api = axios.create({
  baseURL: "ec2-3-111-33-23.ap-south-1.compute.amazonaws.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (accessToken) => {
  if (accessToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const storeTokens = (tokens) => {
  localStorage.setItem("accessToken", tokens.access);
  localStorage.setItem("refreshToken", tokens.refresh);
  setAuthToken(tokens.access);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  setAuthToken(null);
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }
  try {
    const response = await api.post("token/refresh/", {
      refresh: refreshToken,
    });
    setAuthToken(response.data.access);
    storeTokens(response.data);
  } catch (error) {
    console.error("Failed to refresh token:", error);
    clearTokens();
  }
};

api.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 
      try {
        await refreshAccessToken();
        const accessToken = getAccessToken();
        n;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        clearTokens();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
