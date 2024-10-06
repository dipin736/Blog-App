import React, { createContext, useState, useEffect, useContext } from 'react';
import { setAuthToken, storeTokens, refreshAccessToken, clearTokens } from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check localStorage for stored user
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (username, userId, tokens) => {
    const userData = { username, userId }; // Include userId in user data
    setUser(userData); // Store the username and userId in state
    localStorage.setItem('user', JSON.stringify(userData)); // Store user in localStorage
    setAuthToken(tokens.access); // Set access token
    storeTokens(tokens); // Store tokens
  };

  const logout = () => {
    clearTokens(); // Clear tokens on logout
    setUser(null); // Clear user state
    localStorage.removeItem('user'); // Remove user from localStorage
  };

  // Check for token expiration and refresh if needed
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
