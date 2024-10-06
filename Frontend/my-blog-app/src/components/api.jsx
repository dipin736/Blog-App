import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Update with your Django server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set Authorization header
export const setAuthToken = (accessToken) => {
  if (accessToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Function to store tokens in localStorage
export const storeTokens = (tokens) => {
  localStorage.setItem('accessToken', tokens.access);
  localStorage.setItem('refreshToken', tokens.refresh);
  setAuthToken(tokens.access); // Set the token for the axios instance
};

// Function to retrieve access token from localStorage
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// Function to retrieve refresh token from localStorage
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Function to clear tokens from localStorage
export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  setAuthToken(null); // Clear the Authorization header
};

// Function to refresh the access token
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }
  try {
    const response = await api.post('token/refresh/', { refresh: refreshToken });
    setAuthToken(response.data.access);
    storeTokens(response.data);
  } catch (error) {
    console.error("Failed to refresh token:", error);
    clearTokens(); // Clear tokens if refresh fails
  }
};

// Intercept requests to ensure the access token is set
api.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we receive a 401 error and it's not a refresh request, try to refresh the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request as retried
      try {
        await refreshAccessToken();
        const accessToken = getAccessToken();
        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
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
