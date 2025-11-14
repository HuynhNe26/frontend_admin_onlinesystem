import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [user, setUser] = useState(
    localStorage.getItem("adminUser") ? JSON.parse(localStorage.getItem("adminUser")) : null
  );

  const login = (accessToken, userInfo) => {
    setToken(accessToken);
    setUser(userInfo);

    localStorage.setItem("adminToken", accessToken);
    localStorage.setItem("adminUser", JSON.stringify(userInfo));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
