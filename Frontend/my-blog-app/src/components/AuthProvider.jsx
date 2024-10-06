import React, { createContext, useState, useEffect, useContext } from "react";
import {
  setAuthToken,
  storeTokens,
  refreshAccessToken,
  clearTokens,
} from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (username, userId, tokens) => {
    const userData = { username, userId };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setAuthToken(tokens.access);
    storeTokens(tokens);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }, 15 * 60 * 1000);

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
