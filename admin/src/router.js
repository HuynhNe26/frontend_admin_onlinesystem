import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Error404 from "./components/error_404/error_404";
import Layout from "./components/layout";
import Home from "./pages/home/home";
import Login from "./pages/login_admin/Login";

import { useAuth } from "./context/AuthContext";

export default function Router() {
  const { token, user } = useAuth();

  // Nếu chưa đăng nhập
  if (!token || !user) {
    return (
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    );
  }

  // Nếu đã đăng nhập
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/admin/home" replace />} />
        <Route path="/admin/home" element={<Home />} />

        {/* Thêm các route khác ở đây */}
      </Route>

      {/* Redirect về home nếu đã login mà vào /admin/login */}
      <Route path="/admin/login" element={<Navigate to="/admin/home" replace />} />

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}