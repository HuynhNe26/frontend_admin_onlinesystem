import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("adminUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("adminToken");
      const newUser = localStorage.getItem("adminUser");

      setToken(newToken);
      setUser(newUser ? JSON.parse(newUser) : null);
    };

    window.addEventListener("tokenChange", handleStorageChange);

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("tokenChange", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("tokenChange"));
  };

  return (
    <AuthContext.Provider value={{ token, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};