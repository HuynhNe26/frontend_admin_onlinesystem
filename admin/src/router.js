import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Error404 from "./components/error_404/error_404";
import Layout from "./components/layout";
import Logout from "./pages/logout_admin/Logout";
import Home from "./pages/home/home";
import Login from "./pages/login_admin/Login";
import ManageAdmin from "./pages/CRUD_admin/manage_admin";
import CreateAdmin from "./pages/CRUD_admin/create_admin";
import ManageUser from "./pages/manage_user/manage_user";
export default function Router() {
  // ===== QUAN TRỌNG: Dùng useState để re-render khi token thay đổi =====
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  // Lắng nghe sự thay đổi của localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("adminToken"));
    };

    // Lắng nghe event storage
    window.addEventListener("storage", handleStorageChange);

    // Custom event cho cùng tab
    window.addEventListener("tokenChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenChange", handleStorageChange);
    };
  }, []);

  // Routes khi chưa đăng nhập
  if (!token) {
    return (
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    );
  }

  // Routes khi đã đăng nhập
  return (
    <Routes>
      {/* Trang chính */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/admin/home" replace />} />
        <Route path="/admin/home" element={<Home />} />
        <Route path="/admin/manage-admin" element={<ManageAdmin />} />
        <Route path="/admin/create-admin" element={<CreateAdmin />} />
        <Route path="/admin/manage-users" element={<ManageUser/>} />
        <Route path="/logout" element={<Logout />} />
      </Route>

      {/* Trang lỗi */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}